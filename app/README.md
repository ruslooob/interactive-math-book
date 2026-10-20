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
?section=11&page=calculate-expression&exercise=11.7
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

The §11 catalog contains 78 exercises and 284 exercise parts. Progress starts at zero and stores solved part IDs locally in the browser. Later attempts preserve solved status. The app does not use server synchronization or content locking. Source pages are internal metadata and do not appear as learner citations.

Exercises 11.1–11.12 now provide 48 optional parts. They cover power calculations, function classification, and direct and inverse function values. The tree lists each exercise in book order. Parts appear inside the selected exercise. Other practice groups remain unavailable until their exercise tickets supply complete content. Section §12 remains accessible at every progress value.

Calculated answers accept decimal points or commas, fractions, powers, `sqrt(2)`, and `root(3;2)`. Checks compare finite numerical values with a tolerance of `1e-10 * max(1, |expected|)`. The parser accepts arithmetic only and does not execute code. Exercise 11.10 checks three values in their given order. Feedback appears after submission. Replay preserves solved status. Source and worked-result checks are in [the verification notes](../docs/PARAGRAPH-11-EXERCISES-1-12-VERIFICATION.md).

Shared practice interfaces are in `src/content/exerciseContent.ts`. They cover calculated values, choices, comparisons, ordered steps, intervals, and structured graphs. Exercise tickets supply mathematical checks and add complete definitions to `paragraph11ExerciseContent`. `availableParagraph11Exercises` admits an exercise only when it is ready and every catalog part has content and a check. `submitParagraph11Answer` returns feedback and the resulting solved IDs. `saveParagraph11Progress` persists those IDs. The `v2` storage key keeps provisional results separate from the verified catalog.

## Checks

Run `make check` for type checks, the production build, model tests, and browser navigation tests. Run `make test-model` to check catalog integrity, content availability, answer feedback, and saved progress without a browser or app server. Run one model test file with `make test-model TEST_ARGS=tests/paragraph-11-model.spec.ts`. Run `make test-ui` for the existing navigation checks.

## Sources for definitions and formulas

The textbook scan supplies book structure, section titles, and exercise mathematics. Definitions and theory formulas were checked against open OpenStax textbooks:

- [Key concepts for the chapter on exponential and logarithmic functions](https://openstax.org/books/precalculus-2e/pages/4-key-concepts).
- [Exponential and logarithmic equations](https://openstax.org/books/precalculus-2e/pages/4-6-exponential-and-logarithmic-equations).
- [Exponential inequalities](https://math.libretexts.org/Courses/Cosumnes_River_College/Corequisite_Codex/07%3A_Solving_Inequalities/7.07%3A_Solving_Exponential_Inequalities).
- [Logarithmic inequalities](https://math.libretexts.org/Courses/Cosumnes_River_College/Corequisite_Codex/07%3A_Solving_Inequalities/7.08%3A_Solving_Logarithmic_Inequalities).
- [Derivatives of exponential and logarithmic functions](https://openstax.org/books/calculus-volume-1/pages/3-9-derivatives-of-exponential-and-logarithmic-functions).
- [Formulas for arbitrary bases](https://openstax.org/books/calculus-volume-1/pages/6-7-integrals-exponential-functions-and-logarithms).

The provisional 11.17–11.18 statements came from the disposable prototype recorded in commit `a780087`. They did not match those book numbers and are excluded from the learner route. The new catalog follows the source checks in [`docs/PARAGRAPH-11-EXERCISE-INVENTORY.md`](../docs/PARAGRAPH-11-EXERCISE-INVENTORY.md). Printed page 71 contains two parts for 11.64, which corrects the earlier 286-part inventory to 284 parts. The original shell transfer is described in [issue #21](https://github.com/ruslooob/interactive-math-book/issues/21).

General review conclusions are in [`docs/LEARNING-DESIGN-RULES.md`](../docs/LEARNING-DESIGN-RULES.md). The three original layout options remain in Git history at commit `63917d2`.

The alignment of §§11–19 with their learning goals is checked in [`docs/CHAPTER-3-LEARNING-GOAL-AUDIT.md`](../docs/CHAPTER-3-LEARNING-GOAL-AUDIT.md).
