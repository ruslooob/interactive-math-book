# §11 textbook exercise inventory

Source: A. G. Mordkovich, *Algebra and Introduction to Mathematical Analysis, Grade 11*, §11, printed pages 62–73 (local scan PDF pages 63–74). The teacher preface on printed page 3 defines three levels: no mark means simple, a hollow circle means medium, and a filled circle means difficult.

This inventory records exercise numbers, parts, levels, and mathematical actions. It does not reproduce task instructions. A range includes every exercise number in that range. The source has 65 four-part exercises and 13 two-part exercises: **286 parts** in total.

The implementation requirements are in [Issue #56](https://github.com/ruslooob/interactive-math-book/issues/56).

| Printed page | Exercises | Parts per exercise | Level | Mathematical action and main forms |
| --- | --- | ---: | --- | --- |
| 62 | 11.1–11.4 | 4 | Simple | Calculate products and quotients of powers; decimal and radical bases. |
| 62 | 11.5 | 4 | Simple | Calculate powers of powers. |
| 63 | 11.6–11.7 | 4 | Simple | Calculate combined powers and radicals. |
| 63 | 11.8–11.9 | 4 | Simple | Identify exponential functions among power and exponential formulas. |
| 63 | 11.10 | 4 | Simple | Find function values from arguments. |
| 63 | 11.11–11.12 | 4 | Simple | Find arguments from function values; bases above and below one. |
| 64 | 11.13–11.14 | 4 | Simple | Sketch one exponential graph. |
| 64 | 11.15 | 4 | Medium | Classify a radical base, then sketch its graph. |
| 64 | 11.16 | 4 | Simple | Sketch two or three graphs on common axes. |
| 64–65 | 11.17–11.22 | 4 | Simple | Compare values and powers; increasing or decreasing bases and fractional, negative, or radical exponents. |
| 65 | 11.23–11.25 | 2 | Medium | Order powers, sometimes after classifying the base. |
| 66 | 11.26–11.27 | 4 | Simple | Determine monotonicity for direct powers and negative arguments. |
| 66 | 11.28 | 4 | Medium | Determine monotonicity after evaluating a radical base. |
| 66 | 11.29–11.30 | 4 | Simple | Determine monotonicity after sign, reciprocal, argument, or value transformations. |
| 66 | 11.31–11.32 | 4 | Simple | Determine upper or lower bounds. |
| 66–67 | 11.33–11.34 | 4 | Simple | Find extrema on closed or unbounded intervals. |
| 67 | 11.35–11.36 | 4 | Medium | Find extrema for shifted or scaled exponential functions. |
| 67 | 11.37–11.38 | 2 | Simple | Recover an interval from its stated extrema. |
| 68 | 11.39–11.40 | 4 | Medium | Prove exponential or trigonometric functional identities. |
| 68 | 11.41–11.43 | 4 | Simple | Find domains of exponential, reciprocal, and radical expressions. |
| 69 | 11.44–11.47 | 4 | Medium | Find ranges of scaled, shifted, rational, or radical exponential expressions. |
| 69 | 11.48–11.49 | 4 | Simple | Graph vertical or horizontal translations. |
| 69 | 11.50 | 4 | Medium | Graph combined horizontal and vertical translations. |
| 70 | 11.51–11.54 | 2 | Medium | Evaluate, graph, and read piecewise functions; check boundary values. |
| 70 | 11.55 | 2 | Medium | Graph three-part functions with trigonometric or exponential pieces. |
| 71 | 11.56 | 4 | Medium | Graph exponentials with absolute value in the exponent. |
| 71 | 11.57 | 2 | Medium | Graph absolute values of exponential expressions. |
| 71 | 11.58 | 2 | Difficult | Graph sums or differences of absolute value expressions. |
| 71 | 11.59 | 4 | Simple | Solve equations by converting both sides to one base. |
| 71 | 11.60 | 4 | Medium | Solve equations with radical bases. |
| 71 | 11.61–11.62 | 4 | Medium | Solve exponential-versus-linear equations. |
| 71 | 11.63–11.65 | 4 | Medium | Solve exponential-versus-reciprocal equations. |
| 72 | 11.66 | 4 | Medium | Solve exponential-versus-square-root equations. |
| 72 | 11.67–11.68 | 4 | Simple | Solve direct exponential inequalities. |
| 72 | 11.69 | 4 | Medium | Solve inequalities with compound radical bases. |
| 72 | 11.70–11.72 | 4 | Medium | Find where an exponential graph lies above or below a line. |
| 73 | 11.73–11.74 | 4 | Medium | Solve inequalities against linear or reciprocal expressions. |
| 73 | 11.75–11.77 | 4 | Difficult | Solve inequalities against trigonometric, absolute value, or square-root expressions. |
| 73 | 11.78 | 2 | Difficult | Find the largest integer function value; count integers in a function's range. |

## Source checks for the specification

- The current app declares 282 parts. The PDF count is 286.
- The app's tasks labeled 11.17 and 11.18 do not match the mathematical content under those numbers in the book.
- The 23-type list in Issue #17 omits the integer-count task in 11.78(b).
- The printed wording of 11.38(b) appears to say “maximum” twice. The second stated value is smaller. The answer key does not include 11.38, so the intended word remains uncertain.
- Issue #56 records the editorial decision to use “minimum” for that second value and show a source note in the app.
