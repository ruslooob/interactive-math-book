# Final Cyrillic audit

This audit records the verification work in issue #50 for spec #45. The scan
covered tracked file contents and filenames on integration commit `6f0c4ec`.
The occurrence inventory and scanner used during implementation were removed
after verification, as requested by the user.

## Remaining occurrences

The scan found 994 Cyrillic occurrences: 993 content segments and one filename.
All remaining segments matched preserved baseline entries by kind, path, and
trimmed segment SHA-256 hash, including duplicate counts. The comparison found
zero new entries, zero missing preserved entries, and zero agent-facing entries.
The baseline had 1,422 entries: 428 agent-facing, 992 book, and two exceptions.

Every remaining occurrence in each location below has the reason shown. A
content segment is text between quotes, backticks, Markdown table bars, or HTML
tag brackets that contains at least one Cyrillic character.

| Location | Content segments | Reason to preserve |
| --- | ---: | --- |
| `app/src/content/*.ts` | 555 | Russian learner content and source textbook titles. |
| `app/src/components/*.tsx` | 200 | Visible or accessible Russian book interface text. |
| `app/src/App.tsx`, `app/index.html`, `app/src/lib/exponential.ts` | 6 | Visible or accessible Russian book interface text. |
| `app/README.md` | 1 | Exact displayed progress text. |
| `books/` original table of contents | 50 | Original textbook source text. |
| `docs/CHAPTER-3-LEARNING-GOAL-AUDIT.md` | 9 | Exact textbook section titles quoted in the audit. |
| `docs/LEARNING-DESIGN-RULES.md` | 6 | Exact book title, notation, or displayed text quoted in rules. |
| `docs/adr/0003-textbook-shaped-practice.md` | 1 | Exact displayed progress status. |
| `output/visualizations/paragraph-11-progress.html` | 106 | Visible or accessible Russian text in the archived book prototype. |
| `tests/paragraph-11-practice.spec.ts` | 58 | Exact Russian UI locators or expected learner text. |
| **Book total** | **992** | All book content stays Russian. |

The two exceptions are exact paths. The Cyrillic table-of-contents filename in
`books/` preserves the source record. The ignored local PDF path in `.gitignore`
must match the source filename. The original Russian table of contents remains
unchanged.

## Checks

- The tracked-file scan counted 993 content segments and one filename on `6f0c4ec`.
- `npm ci`: installed dependencies.
- `npm run build`: passed. Vite reported a nonblocking bundle-size warning.
- `npm test`: all 7 Chromium tests passed.
- Browser at 1440 × 900: opened the §11 theory page and saw its Russian heading. Opened the Russian book tree with a mouse click. Selected the comparison practice page with a mouse click. Pressed ArrowRight on the exercise selector. Focus moved to part 2, and the Russian exercise label remained visible.

No acceptance criterion remains unchecked.
