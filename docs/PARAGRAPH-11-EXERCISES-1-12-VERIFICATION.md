# Exercises 11.1–11.12: verification notes

Task: [#59](https://github.com/ruslooob/interactive-math-book/issues/59), part of [#56](https://github.com/ruslooob/interactive-math-book/issues/56).

## Source check

Source: the local Mordkovich Grade 11 scan, printed pages 62–63 (PDF pages 63–64). All 48 prompts were visually checked against rendered scan pages. Every exercise has four parts, а, б, в, г, in that order. All twelve exercises have the simple book level. Instruction wording is new. Source references remain in these notes and catalog metadata.

The following results come from independent calculations. Each row lists parts а, б, в, г in source order.

| Exercise | Printed page | Worked results |
| --- | --- | --- |
| 11.1 | 62 | 32; 343; 3; 27/64 |
| 11.2 | 62 | 5; 2; 1/49; 9 |
| 11.3 | 62 | 2; 16; 2; 8/27 |
| 11.4 | 62 | 0.6; 1.44; 1/9; 2/7 |
| 11.5 | 62 | 4; 1/7; 27; 4/3 |
| 11.6 | 63 | 1/2; 16/81; 27; 3/2 |
| 11.7 | 63 | 1; 1/10; 9∛3; ∛2 |
| 11.8 | 63 | Exponential; power; power; exponential |
| 11.9 | 63 | Exponential; power; power on x ≥ 0; exponential |
| 11.10 | 63 | (343, 1/7, √7); (√2/4, 1/2, √2); (1, 9, 9√3); (27/8, 9/4, 32/243) |
| 11.11 | 63 | 4; 7/2; −1/2; −11/2 |
| 11.12 | 63 | 2; 5/2; −3; −9/2 |

Detailed source checks:

- 11.2(г) uses fifth roots of 3 and exponents −1/3 and 31/3. Their sum is 10, so the result is 3².
- 11.3(в) uses the mixed exponent 2⅓, then division by 8².
- 11.4(в) uses fifth roots of 1/3 and exponents 6.3 and −3.7.
- 11.6(б) uses the outer exponent 6. The resulting exponent is 4.1 × 6 − 20.6 = 4.
- 11.7(в) uses ∛81, 3^2.6, and division by 3^1.6. The resulting exponent is 4/3 + 2.6 − 1.6 = 7/3.
- 11.7(г) uses ∜16 and ∛128, followed by division by 2³. The second radical is a cube root.
- 11.9(в) places x under the square root and 5 outside it. It is not an exponential function.
- 11.10 requires three outputs per part. The checks preserve argument order, including the negative arguments and 2.5.
- 11.12 uses base 1/5. Outputs above 1 require negative arguments.

No source correction was required for this range.

## Verification methods

`tests/paragraph-11-values-model.spec.ts` checks public answer and progress interfaces without a browser or app server. It checks all 48 parts with wrong answers, correct answers, and replay. It also checks stored solved results, equivalent radical expressions, decimal commas, ordered outputs, and invalid arithmetic input.

`tests/paragraph-11-exercises.spec.ts` checks interface actions separately. At 1440 × 900, it checks mouse submission, retry, part selection, completion, replay, reload, keyboard classification, and keyboard entry of three values. It also checks all twelve tree entries, optional access to 11.12, and navigation to §12. A 390 × 844 check covers a radical answer and page overflow. Screenshots support visual inspection. Temporary screenshots are removed after inspection.

The existing catalog, progress, and book navigation tests remain part of `make check`.

The input notation uses symbolic templates. A failing browser check showed that the earlier numeric root example matched the answer to 11.7(г). The retained regression check prevents that answer from appearing before submission.

Final agent checks on 2026-10-20: `make check` passed the type checks, build, 14 model tests, and 9 browser tests. The 1440 × 900 screenshots show readable prompts, fields, and feedback. No page errors occurred in the mouse workflow. The Vite build reports a bundle-size warning.

## Pending stages

- The required `code-review` skill remains pending at the user's request, as recorded in issue #59. The PR must remain a draft.
- Explicit user acceptance remains pending. Do not merge the PR or close the issue before acceptance.
