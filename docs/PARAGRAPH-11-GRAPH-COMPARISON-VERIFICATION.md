# Exercises 11.13–11.25 verification

Task: [#60](https://github.com/ruslooob/interactive-math-book/issues/60). Spec: [#56](https://github.com/ruslooob/interactive-math-book/issues/56).

The isolated task branch includes the two prerequisite commits from PR #67. The prerequisite remains unaccepted. Exercise changes use a separate commit.

## Source check

Checked the local Mordkovich scan visually at PDF pages 65–66, printed pages 64–65. Higher-resolution renders confirmed small signs and fractions. All 46 parts retain their original exercise number, part letter, level, and order. Instruction text is new. Source references stay in this file and catalog metadata.

In each row below, semicolons separate parts in the order а, б, в, г. Commas inside brackets separate curves or values.

| Exercise | Verified mathematical content | Level |
| --- | --- | --- |
| 11.13 | Bases: √2; 1/π; √7; 1/√6 | Simple |
| 11.14 | Bases: π; 4−π; √π; 1/(4−π) | Simple |
| 11.15 | Bases: √8−√2; ∛24−∛4; √5−∛5; ⁵√32.1−√3 | Medium |
| 11.16 | Shared bases: [3, 8]; [3/4, 1/2]; [√7, 5, √8]; [1/√2, 1/2, 1/8] | Simple |
| 11.17 | Base 3. Exponent pairs: [1/3, 2/3]; [1/2, −1/2]; [4/5, 3/5]; [1, −3/2] | Simple |
| 11.18 | Base 5. Exponent pairs: [2/3, 4/5]; [−7/3, −6/5]; [3/5, 4/7]; [−3/8, −11/9] | Simple |
| 11.19 | Base √3. Exponent pairs: [0.3, 1/4]; [−1/3, −0.4]; [1.8, 2.1]; [3.1, √10] | Simple |
| 11.20 | Base 0.6. Exponent pairs: [0.2, 1/3]; [√5, 2.5]; [−4.1, −5]; [−6.5, 0.1] | Simple |
| 11.21 | Base 3/7. Exponent pairs: [2/3, 3/5]; [−6/7, −10/11]; [5/7, 3/11]; [−1.6, −3] | Simple |
| 11.22 | Base and exponent pair: 1.3 [34, 40]; 7/9 [16.2, −3]; 12.1 [√8, √5]; 0.65 [−√2, 1/2] | Simple |
| 11.23 | Base 2, exponents [1/3, −1/2, √3, −√2, 1.4, 0]; base 0.3, exponents [9, 0, −√5, 1/2, −9, 1/3]. Print the zero-exponent entries as 1. | Medium |
| 11.24 | Base √3, exponents [2/3, −√2, 1.2, 0, √2, √3], with the zero-exponent entry as 1; base ∛3−∛2, exponents [0.3, 0, −0.2] | Medium |
| 11.25 | Base 1/√5, exponents [5/6, −0.2, 2/3, −1/6, 1.3, −2.1]; base 1/∛2−1/√2, exponents [0.1, −0.5, −3.4] | Medium |

The close source check confirmed −1/2 in 11.23(а), −1/6 in 11.25(а), and 16.2 in 11.22(б). These values are easy to misread in the scan.

The previous provisional tasks under 11.17 and 11.18 were removed by the prerequisite. The new tasks use the verified base-3 and base-5 comparisons. Progress uses the prerequisite's v2 key. Old provisional results do not transfer.

## Mathematical checks

- Graph construction requires each curve's three coordinates at x = −1, 0, 1, the full real domain, the open positive range, and the horizontal asymptote y = 0.
- The check rejects omitted or duplicate curves, reversed growth, invalid coordinates, a closed zero boundary, and a vertical asymptote.
- Coordinates accept restricted arithmetic, fractions, pi, sqrt, cbrt, and powers. The relative tolerance is 0.01%. Invalid or non-finite expressions fail.
- The sketch uses learner coordinates. It does not obtain expected coordinates from the answer checker. All curves use common axes and scale. Line patterns distinguish close curves.
- Comparison checks use exponent order and base monotonicity. Tests use independently worked expected relations for all 24 parts.
- Ordering checks compare all submitted value IDs in order. Tests include all six worked orders, reverse orders, duplicates, and missing entries.
- Model and progress tests run without a browser or app server. Wrong attempts do not solve a part. Later wrong attempts do not remove solved status.

## Browser checks

`PLAYWRIGHT_PORT=4180 make check` passed: TypeScript, production build, 14 model tests, and 10 browser tests. The port override isolates checks from other exercise tasks.

The new browser tests run Chromium at 1440 × 900. They check mouse entry, keyboard graph construction, incorrect answers, retry, ordering moves, part navigation, saved progress after reload, replay, the 13 exercise tree entries, three graphs on common axes, and unrestricted access to §12. Existing navigation checks also pass at 390 × 844.

Screenshots of single and shared graphs and the ordering result were inspected. Closely spaced point labels overlapped in the first shared sketch. The final sketch uses axis labels and distinct line patterns.

## Pending checks

- The live Playwright tool could not start because its browser profile was in use. The computer-use browser inventory was empty. Interactive live browser verification remains pending. Automated Chromium interaction checks and screenshot inspection passed.
- The user deferred the `code-review` skill. That review stage remains pending. Basic implementation checks do not replace the deferred review.
- User acceptance remains pending. Keep the PR in draft. Do not merge the prerequisite, merge this candidate, or close the issue without explicit approval.
