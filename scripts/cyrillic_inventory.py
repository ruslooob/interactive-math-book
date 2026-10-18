"""Scan Cyrillic in Git-tracked paths and UTF-8 file contents."""

from __future__ import annotations

import argparse
import collections
import csv
import hashlib
import re
import subprocess
import sys
import unicodedata
from pathlib import Path


BASELINE = "26590ad95dff26ebbd7c63c6149ca738af1c99c8"
BOUNDARY = re.compile("['\"`«»|<>]")
FIELDS = ("kind", "path", "line", "column", "sha256", "class", "reason")


def first_cyrillic(value: str) -> int | None:
    return next((index for index, char in enumerate(value)
                 if "CYRILLIC" in unicodedata.name(char, "")), None)


def tracked_blobs(revision: str):
    output = subprocess.check_output(["git", "ls-tree", "-r", "-z", revision])
    for entry in output.split(b"\0"):
        if entry:
            metadata, name = entry.split(b"\t", 1)
            _mode, kind, object_id = metadata.split(b" ")
            if kind != b"blob":
                raise ValueError(f"Unexpected tree entry: {entry!r}")
            yield name.decode("utf-8"), object_id.decode("ascii")


def scan(revision: str):
    for path, object_id in tracked_blobs(revision):
        if (index := first_cyrillic(path)) is not None:
            yield ("path", path, 0, index + 1, path)

        try:
            content = subprocess.check_output(["git", "cat-file", "blob", object_id]).decode("utf-8")
        except UnicodeDecodeError as error:
            raise ValueError(f"Cannot decode tracked file as UTF-8: {path}") from error

        for line_number, line in enumerate(content.splitlines(), start=1):
            start = 0
            for boundary in BOUNDARY.finditer(line):
                segment = line[start : boundary.start()]
                if (index := first_cyrillic(segment)) is not None:
                    yield ("content", path, line_number, start + index + 1, segment.strip())
                start = boundary.end()
            segment = line[start:]
            if (index := first_cyrillic(segment)) is not None:
                yield ("content", path, line_number, start + index + 1, segment.strip())


def classification(kind: str, path: str, line: int, column: int, text: str) -> tuple[str, str]:
    if kind == "path":
        return "exception", "Exact source record path; renaming would break references."
    if path == ".gitignore":
        return "exception", "Exact local source PDF path; the ignore rule must match it."
    if path.startswith("books/") and path != "books/README.md":
        return "book", "Original textbook table of contents."
    if path.startswith("app/src/content/"):
        if path == "app/src/content/practice11.ts" and line == 24:
            return "agent", ""
        return "book", "Learner text or source textbook title."
    if path.startswith("app/src/components/") or path in {"app/index.html", "app/src/lib/exponential.ts"}:
        return "book", "Visible or accessible book interface text."
    if path == "app/src/App.tsx":
        return ("agent", "") if line in {59, 97} else ("book", "Visible book interface text.")
    if path == "output/visualizations/paragraph-11-progress.html":
        return ("agent", "") if line in {9, 10} else ("book", "Visible archived book prototype text.")
    if path == "tests/paragraph-11-practice.spec.ts":
        return ("agent", "") if line in {20, 58, 75, 83, 111, 133} else ("book", "Exact UI locator or expected learner text.")
    if path == "app/README.md" and (line, column) == (61, 63):
        return "book", "Exact displayed progress text."
    if path == "docs/CHAPTER-3-LEARNING-GOAL-AUDIT.md" and 9 <= line <= 17 and text.startswith("§"):
        return "book", "Textbook section title in a mixed-purpose audit table."
    if path == "docs/LEARNING-DESIGN-RULES.md":
        if (line, column) in {(3, 55), (22, 88), (22, 103), (27, 30), (81, 45), (82, 58)}:
            return "book", "Exact book title, notation, or displayed text in a mixed-purpose rule."
    if path == "docs/adr/0003-textbook-shaped-practice.md" and (line, column) == (13, 320):
        return "book", "Exact displayed progress status."
    return "agent", ""


def record(row, revision: str):
    kind, path, line, column, text = row
    category, reason = classification(kind, path, line, column, text) if revision == BASELINE else ("", "")
    reason = reason or "-"
    return (kind, path.encode("unicode_escape").decode("ascii"), line, column,
            hashlib.sha256(text.encode("utf-8")).hexdigest(), category, reason)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--summary", action="store_true")
    parser.add_argument("--revision", default=BASELINE, help="Git tree to scan; default is the task baseline")
    parser.add_argument("--verify", type=Path, metavar="INVENTORY_TSV")
    parser.add_argument("--write", type=Path, metavar="INVENTORY_TSV")
    args = parser.parse_args()
    if (args.verify or args.write) and args.revision != BASELINE:
        parser.error("Inventory writing and verification require the fixed baseline")

    found = list(scan(args.revision))
    if args.summary:
        counts = collections.Counter(row[1] for row in found)
        print(f"revision: {args.revision}")
        print(f"tracked files: {sum(1 for _ in tracked_blobs(args.revision))}")
        print(f"Cyrillic content segments: {sum(row[0] == 'content' for row in found)}")
        print(f"Cyrillic paths: {sum(row[0] == 'path' for row in found)}")
        if args.revision == BASELINE:
            classes = collections.Counter(record(row, args.revision)[5] for row in found)
            print(f"classes: {dict(classes)}")
        for path, count in counts.most_common():
            print(f"{count:5} {path}")
        return 0

    if args.verify:
        with args.verify.open(encoding="utf-8", newline="") as source:
            entries = list(csv.DictReader(source, delimiter="\t"))
        actual = {tuple(str(item) for item in record(row, args.revision)[:4]): record(row, args.revision)[4] for row in found}
        recorded = {
            (row["kind"], row["path"], row["line"], row["column"]): row
            for row in entries
        }
        errors = []
        if len(recorded) != len(entries):
            errors.append("duplicate inventory keys")
        for key, digest in actual.items():
            if key not in recorded:
                errors.append(f"missing: {key}")
            elif recorded[key]["sha256"] != digest:
                errors.append(f"text changed: {key}")
            elif recorded[key]["class"] not in {"agent", "book", "exception"}:
                errors.append(f"unclassified: {key}")
            elif recorded[key]["class"] == "exception" and recorded[key]["reason"] in {"", "-"}:
                errors.append(f"exception has no reason: {key}")
        for key in recorded.keys() - actual.keys():
            errors.append(f"stale: {key}")
        if errors:
            print("\n".join(errors), file=sys.stderr)
            return 1
        print(f"Verified {len(entries)} classified occurrences.")
        return 0

    if args.write:
        with args.write.open("w", encoding="utf-8", newline="") as destination:
            writer = csv.writer(destination, delimiter="\t", lineterminator="\n")
            writer.writerow(FIELDS)
            writer.writerows(record(row, args.revision) for row in found)
        print(f"Wrote {len(found)} classified occurrences to {args.write}.")
        return 0
    writer = csv.writer(sys.stdout, delimiter="\t", lineterminator="\n")
    writer.writerow(FIELDS)
    writer.writerows(record(row, args.revision) for row in found)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
