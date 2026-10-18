# Baseline Cyrillic inventory

This inventory supports issue #46 and spec #45. It records tracked files at commit
`26590ad95dff26ebbd7c63c6149ca738af1c99c8`. The baseline is fixed before
any translation. The inventory does not change the book or its source record.

## Scope and totals

The baseline has 145 tracked files. Cyrillic appears on 1,163 content lines in
38 files and in one filename. The scan divides these lines at quotes, backticks,
Markdown table bars, and HTML tag brackets. Each resulting segment with Cyrillic
is one inventory entry. A segment can contain more than one Cyrillic word.

| Class | Entries | Action |
| --- | ---: | --- |
| `agent` | 428 | Translate in later tickets. |
| `book` | 992 | Preserve the original Russian text. |
| `exception` | 2 | Preserve the exact source path. |
| **Total** | **1,422** | 1,421 content segments and one filename. |

The occurrence list is in [CYRILLIC-INVENTORY.tsv](CYRILLIC-INVENTORY.tsv).
Each row gives a file, a one-based line number, and the one-based column of the
first Cyrillic character. A filename has line 0. Paths with Cyrillic use Python
Unicode escapes in the TSV, so the inventory itself adds no Cyrillic matches.
The SHA-256 value identifies the trimmed source segment. Open the named file at
the baseline commit to read the original text. A dash in `reason` means the
general class criterion applies.

## Classification criteria

`agent` means instructions, design decisions, audits, source documentation,
comments, test names, or automation messages for maintainers and coding agents.
This includes guidance about learning design. A sentence about a learner is
still agent-facing when the learner does not see that sentence in the book.

`book` means Russian text that a learner sees or hears in the current app or
the archived book prototype. It includes lessons, examples, exercise text,
hints, feedback, navigation, progress, page titles, and accessible labels.
Exact UI locators and expected UI text in tests also stay Russian. The original
textbook table of contents and source section titles stay Russian as book
source content. The book's Russian source text must remain in its original form.

`exception` means an exact path that must match a source record. The two
exceptions are the Cyrillic filename of the textbook table of contents and
the ignored local textbook PDF path in `.gitignore`. Translating either path
would break an exact reference. The table of contents file's *contents* are
classified as `book`.

## Mixed files reviewed

The TSV classifies each segment, not each whole file. Key boundaries are:

| File | Agent-facing text | Preserved text |
| --- | --- | --- |
| `app/src/App.tsx` | Local storage comments at lines 59 and 97. | UI text on the other matched lines. |
| `app/src/content/practice11.ts` | Source comment at line 24. | Exercise data on the other matched lines. |
| `tests/paragraph-11-practice.spec.ts` | Test names at lines 20, 58, 75, 83, 111, and 133. | UI locators and expected output. |
| `output/visualizations/paragraph-11-progress.html` | Prototype comment at lines 9 and 10. | Visible and accessible prototype text. |
| `app/README.md` | Maintainer prose. | Exact progress text at line 61, column 63. |
| `docs/CHAPTER-3-LEARNING-GOAL-AUDIT.md` | Audit headings, goals, findings, and actions. | Source section titles in the first table column on lines 9–17. |
| `docs/LEARNING-DESIGN-RULES.md` | Design rules and prose. | Exact source title, math notation, page heading, and feedback examples at lines 3, 22, 27, 81, and 82. |
| `docs/adr/0003-textbook-shaped-practice.md` | Decision text. | Exact progress status at line 13, column 320. |

All other matched app components, app content records, and the archived
prototype contain learner-facing text. The repository guidance, glossary,
mission, notes, ADRs, READMEs, workflow, and remaining audit prose are
agent-facing. The `.gitignore` path is an exception.

## Repeat the baseline scan

Run these commands from the repository root:

```sh
python scripts/cyrillic_inventory.py --summary
python scripts/cyrillic_inventory.py --verify docs/CYRILLIC-INVENTORY.tsv
```

The script reads Git blobs from the fixed baseline commit. It does not depend
on later changes in the worktree. `--verify` checks each recorded location and
segment hash against a fresh scan. It rejects missing, duplicate, stale, or
unclassified entries. It also rejects an exception without a reason. The
expected result is `Verified 1422 classified occurrences.`

The scan covers characters with `CYRILLIC` in their Unicode name in tracked
UTF-8 file contents and tracked filenames. A later ticket must run a fresh scan of
its current revision. Use `python scripts/cyrillic_inventory.py --revision HEAD --summary`
to find new or remaining Cyrillic. The fixed baseline inventory remains the
reference for deciding what to translate or preserve.
