#!/usr/bin/env python3
"""check_ooxml.py — stdlib-only well-formedness check for a .docx or .xlsx.

Usage:
    python3 check_ooxml.py FILE.docx|FILE.xlsx [...]

The full OOXML validator (/mnt/skills/public/docx/scripts/office/validate.py)
exists only inside the skills image. Without it — in GitHub CI, on a plain
laptop — a builder used to skip validation and pass, which is how a document
with a stray control character (\\v, \\f) shipped unnoticed: Word refuses the
file, the suite was green. This check is the floor that always runs: no
dependencies, no network.

Checks, per file:
  * the file is a zip archive (not empty, not truncated);
  * `[Content_Types].xml` is present;
  * every `*.xml` and `*.rels` part parses as XML 1.0 (expat rejects the
    characters XML forbids — C0 controls other than tab/CR/LF, U+FFFE/FFFF,
    lone surrogates — and any unbalanced markup), is UTF-8 or UTF-16, and
    carries no DOCTYPE (checked after decoding, so UTF-16 cannot hide one);
  * the main part is present (`word/document.xml` or `xl/workbook.xml`);
  * every internal relationship target names a part that exists.

It does not check schema conformance (element order, attribute vocabularies);
that is the full validator's job, and it still runs wherever it is present.

Exit codes: 0 every file well-formed; 1 a file is malformed (one line per
problem on stderr); 2 usage.
"""

import posixpath
import re
import sys
import zipfile

try:  # defusedxml (declared by ropa-builder; present in the skills image) refuses
    # entity declarations outright; the stdlib parser is the floor elsewhere.
    import defusedxml.ElementTree as ET
    from xml.etree.ElementTree import ParseError
except ImportError:  # pragma: no cover
    import xml.etree.ElementTree as ET
    from xml.etree.ElementTree import ParseError

MAIN_PARTS = ("word/document.xml", "xl/workbook.xml")
RELS_NS = "{http://schemas.openxmlformats.org/package/2006/relationships}"
# No OOXML part carries a document type declaration, and a DTD is the only
# vehicle for entity expansion (billion laughs) or external entities (XXE),
# so its presence is a malformed part whatever the parser would do with it.
# Searched for in the DECODED text: a byte search for b"<!DOCTYPE" misses the
# same declaration in a UTF-16 part, which expat reads just as happily.
DOCTYPE = re.compile(r"<!\s*DOCTYPE", re.IGNORECASE)
# OOXML parts are UTF-8 or UTF-16 (ECMA-376 Part 2); expat also honours other
# declared encodings, so anything else is refused rather than half-checked.
ENCODING_DECL = re.compile(r"""^﻿?<\?xml[^>]*?\bencoding\s*=\s*["']([A-Za-z0-9._-]+)["']""")
ALLOWED_ENCODINGS = {"utf-8", "utf8", "utf-16", "utf16", "utf-16le", "utf-16be"}
# Bound what one part may expand to in memory; a real document.xml is a few
# megabytes at most.
MAX_PART_BYTES = 64 * 1024 * 1024


def _rels_base(rels_name):
    """word/_rels/document.xml.rels -> word/ ; _rels/.rels -> (root)."""
    folder = posixpath.dirname(rels_name)  # word/_rels
    return posixpath.dirname(folder)       # word


def _decode(data):
    """Return the part's text, or raise ValueError naming why it is refused.

    The encoding is detected the way an XML parser does (BOM, then the byte
    pattern of "<" in UTF-16 without a BOM), decoded strictly, and a declared
    encoding must be one OOXML allows.
    """
    if data[:4] in (b"\x00\x00\xfe\xff", b"\xff\xfe\x00\x00", b"\x00\x00\x00<", b"<\x00\x00\x00"):
        raise ValueError("UTF-32 encoded part (OOXML parts are UTF-8 or UTF-16)")
    if data.startswith(b"\xfe\xff") or data.startswith(b"\xff\xfe"):
        enc = "utf-16"
    elif data.startswith(b"\x00<"):
        enc = "utf-16-be"
    elif data.startswith(b"<\x00"):
        enc = "utf-16-le"
    else:
        enc = "utf-8"
    try:
        text = data.decode(enc)
    except UnicodeDecodeError as exc:
        raise ValueError(f"not valid {enc.upper()} (OOXML parts are UTF-8 or UTF-16): {exc}")
    m = ENCODING_DECL.match(text)
    if m and m.group(1).lower() not in ALLOWED_ENCODINGS:
        raise ValueError(f"declares encoding {m.group(1)!r} (OOXML parts are UTF-8 or UTF-16)")
    return text


def check(path):
    problems = []
    try:
        zf = zipfile.ZipFile(path)
    except (zipfile.BadZipFile, OSError) as exc:
        return [f"not a readable zip archive: {exc}"]
    with zf:
        names = set(zf.namelist())
        if "[Content_Types].xml" not in names:
            problems.append("missing [Content_Types].xml")
        if not any(m in names for m in MAIN_PARTS):
            problems.append(f"no main part (expected one of {', '.join(MAIN_PARTS)})")
        for name in sorted(names):
            if not (name.endswith(".xml") or name.endswith(".rels")):
                continue
            if zf.getinfo(name).file_size > MAX_PART_BYTES:
                problems.append(f"{name}: part declares {zf.getinfo(name).file_size} bytes "
                                f"(cap {MAX_PART_BYTES})")
                continue
            try:
                data = zf.read(name)
            except (zipfile.BadZipFile, OSError) as exc:
                problems.append(f"{name}: cannot read part: {exc}")
                continue
            try:
                text = _decode(data)
            except ValueError as exc:
                problems.append(f"{name}: not well-formed for OOXML: {exc}")
                continue
            if DOCTYPE.search(text):
                problems.append(f"{name}: not well-formed for OOXML: carries a DOCTYPE "
                                f"declaration (entity expansion / external entity vector)")
                continue
            try:
                root = ET.fromstring(data)
            except (ParseError, ValueError) as exc:
                # ValueError: defusedxml's refusal of entities/DTDs.
                problems.append(f"{name}: not well-formed XML: {exc}")
                continue
            if name.endswith(".rels"):
                base = _rels_base(name)
                for rel in root.iter(f"{RELS_NS}Relationship"):
                    if rel.get("TargetMode") == "External":
                        continue
                    target = rel.get("Target") or ""
                    if target.startswith("/"):
                        resolved = target.lstrip("/")
                    else:
                        resolved = posixpath.normpath(posixpath.join(base, target))
                    if resolved not in names:
                        problems.append(f"{name}: relationship {rel.get('Id')} targets "
                                        f"missing part {resolved}")
    return problems


def main(argv):
    if len(argv) < 2:
        print(__doc__.strip().splitlines()[0], file=sys.stderr)
        print("usage: check_ooxml.py FILE.docx|FILE.xlsx [...]", file=sys.stderr)
        return 2
    bad = 0
    for path in argv[1:]:
        problems = check(path)
        if problems:
            bad += 1
            for p in problems:
                print(f"{path}: {p}", file=sys.stderr)
        else:
            print(f"well-formed: {path}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
