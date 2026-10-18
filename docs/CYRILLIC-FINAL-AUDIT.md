# Final Cyrillic audit

This audit records the verification work in issue #50 for spec #45. It uses the
tracked-file boundary from [the baseline inventory](CYRILLIC-INVENTORY.md).
The scan was run on integration commit `6f0c4ec`, before this English note.

## Remaining occurrences

The scan found 994 Cyrillic occurrences in 148 tracked files: 993 content
segments and one filename. It found no agent-facing occurrence.

Each remaining occurrence matches exactly one preserved row in
[the baseline TSV](CYRILLIC-INVENTORY.tsv). The comparison uses the occurrence
kind, path, and trimmed segment SHA-256 hash, including duplicate counts.
The comparison found zero new occurrences and zero missing preserved rows.
The baseline TSV gives a reason for each matched row:

| Class | Occurrences | Reason |
| --- | ---: | --- |
| Book | 992 | Original textbook contents; learner text, interface text, prototype text, source titles, or exact UI text in tests and documentation. The TSV gives the specific reason for each row. |
| Exception | 2 | The textbook contents filename is an exact source record path. The ignored local PDF path must match its source filename. |

The book's original Russian table of contents remains in `books/`. All its
50 Cyrillic content segments and its Cyrillic filename match the baseline.
The 428 baseline agent-facing entries are absent from the final scan.

## Checks

- `python scripts/cyrillic_inventory.py --revision HEAD --summary`: 993 content segments and one filename on `6f0c4ec`.
- `npm ci`: installed dependencies.
- `npm run build`: passed. Vite reported a nonblocking bundle-size warning.
- `npm test`: all 7 Chromium tests passed.
- Browser at 1440 × 900: opened the §11 theory page and saw its Russian heading. Opened the Russian book tree with a mouse click. Selected the comparison practice page with a mouse click. Pressed ArrowRight on the exercise selector. Focus moved to part 2, and the Russian exercise label remained visible.

No acceptance criterion remains unchecked.
