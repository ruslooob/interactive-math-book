# Interactive mathematics book MVP

The React application implements §§11–19 and one tree for the whole book. Each section has a learning goal that determines the content order and the type of interaction.

## Run

Use Node.js 20.19.x or 22.12 or newer.

From the project root, run:

```sh
npm install
npm run dev
```

The commands are the same on Windows, macOS, and Linux. Open the address printed by Vite.

## Navigation

- The top header always shows the application name, `Interactive Books`.
- The book title appears in the open tree header, to the left of the hamburger button.
- The hamburger button opens the shared book tree on pages in §§11–19.
- The tree stays open during navigation until the learner closes it with the hamburger button.
- The tree and learning material scroll independently.
- The tree shows chapter, section, and page titles.
- §§11–19 open implemented material.
- Other chapters open a placeholder.
- Bottom buttons move between adjacent pages in the implemented chapter's tree.
- The material is not locked and does not require sequential completion.

Direct links use URL parameters:

```text
?section=14
?section=11&page=compare-values
?chapter=4
```

## Interactions

- §11: interactive exponential-function graph, table, and value calculation.
- §12: problem-form slider, common-base trainer, and complete exponential-equation solver.
- §13: visual solution region, inequality-direction trainer, and complete exponential-inequality solver.
- §14: conversion between exponential and logarithmic notation.
- §15: interactive logarithmic-function graph.
- §16: numerical check and trainer for applying logarithm properties.
- §17: graphical illustration, domain-restriction trainer, and complete logarithmic-equation solver.
- §18: visual solution region, inequality-direction trainer, and complete logarithmic-inequality solver.
- §19: tangent, formula-choice trainer, and derivative calculation.

The MVP separates parameterized animations that explain mathematical relationships from trainers that develop specific skills. On a wide screen, animation parameters or trainer actions appear to the right of the main area. On a narrow screen, they appear directly below it. The understanding check shows one question at a time and ends with an overall result.

## Build

From the project root, run:

```sh
npm run build
```

The §11 shell opens with the confirmed progress snapshot `68 из 282 решено`. New solved exercise parts on the comparison page are stored locally in the browser. The app does not use server synchronization or content locking.

## Sources for definitions and formulas

The textbook scan supplies only the book structure and section titles. Definitions and formulas were checked against open OpenStax textbooks:

- [Key concepts for the chapter on exponential and logarithmic functions](https://openstax.org/books/precalculus-2e/pages/4-key-concepts).
- [Exponential and logarithmic equations](https://openstax.org/books/precalculus-2e/pages/4-6-exponential-and-logarithmic-equations).
- [Exponential inequalities](https://math.libretexts.org/Courses/Cosumnes_River_College/Corequisite_Codex/07%3A_Solving_Inequalities/7.07%3A_Solving_Exponential_Inequalities).
- [Logarithmic inequalities](https://math.libretexts.org/Courses/Cosumnes_River_College/Corequisite_Codex/07%3A_Solving_Inequalities/7.08%3A_Solving_Logarithmic_Inequalities).
- [Derivatives of exponential and logarithmic functions](https://openstax.org/books/calculus-volume-1/pages/3-9-derivatives-of-exponential-and-logarithmic-functions).
- [Formulas for arbitrary bases](https://openstax.org/books/calculus-volume-1/pages/6-7-integrals-exponential-functions-and-logarithms).

Exercise part statements and grouping for 11.17–11.18 came from the [approved disposable prototype](../output/visualizations/paragraph-11-progress.html), recorded in commit `a780087`. The production shell and transfer boundaries are described in [issue #21](https://github.com/ruslooob/interactive-math-book/issues/21).

General review conclusions are in [`docs/LEARNING-DESIGN-RULES.md`](../docs/LEARNING-DESIGN-RULES.md). The three original layout options remain in Git history at commit `63917d2`.

The alignment of §§11–19 with their learning goals is checked in [`docs/CHAPTER-3-LEARNING-GOAL-AUDIT.md`](../docs/CHAPTER-3-LEARNING-GOAL-AUDIT.md).
