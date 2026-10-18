---
status: accepted
---

# Design the section before the React prototype

The first single-file prototype of the exponential function confirmed a suitable visual direction. It did not test the main product hypothesis: whether interactive material can explain a difficult mathematical idea. Subsequent prototypes and the current MVP are parts of a complete React project. Interface work starts after the team defines the content, learning goal, and interaction method.

## Context

The `prototype/exponential-function.html` prototype helped compare three layouts. Option A was the best fit because of its minimal design, warm palette, and clear separation of animation from its parameters. Option B offered useful expressive techniques. Option C was not selected as the main direction.

The prototype also showed these limits:

- The chosen topic and interaction were too simple to test the product's value.
- There was too little information for a complete explanation.
- The text stated an observed result but gave little help toward understanding it.
- There was no short introduction to the question, context, and purpose of the exploration.
- The interface was designed before the section topic was defined.
- A single HTML file works for a disposable mockup but makes component reuse and product development difficult.

## Decision

### 1. Design the section first

Before drawing a new screen, write a testable section prototype. It must answer these questions:

1. Who is the learner, and what must the learner already know?
2. What is the section topic, and what exactly must the learner understand?
3. Why does this concept usually cause difficulty?
4. Which misconception must the section detect or correct?
5. What short introduction will prepare the learner to explore?
6. Which information is necessary for understanding, and which information can be removed?
7. What will the learner change or manipulate?
8. How does each action relate to the section topic?
9. What must the learner be able to explain or solve after the interaction?
10. What observable result will show that learning occurred?

Do not start the interface prototype until the answers are agreed. The text, animation, and animation parameters must serve one learning goal. They must not act as unrelated parts of the page.

### 2. Build prototypes with React

Create each new prototype as a complete React and TypeScript frontend project. The single-file HTML prototype remains the primary record of the first experiment. Do not use it as the product foundation or copy it directly into the new codebase.

Separate these parts in the project:

- Section content and wording.
- Mathematical model and calculations.
- Experiment state.
- Visualization.
- Controls.
- Page layout and visual theme.

Make recurring elements reusable only after a second real use case appears. These elements include formulas, graphs, parameter sliders, explanations, observations, tasks, and experiment state. Until then, use local components without early generalization.

### 3. Choose tools after the concept

React is the fixed foundation. Choose other tools to fit the learning task before implementing the visual mockup.

| Need | Initial preferred tool | When to choose another solution |
| --- | --- | --- |
| Prototype build | Vite and TypeScript | Only when new requirements exceed Vite's capabilities. |
| Formulas | KaTeX | When formulas are only occasional static labels and a library is unnecessary. |
| Graphs and geometric objects | SVG with React components | Canvas when there are many objects or frequent redraws. |
| Scales and mathematical coordinate transforms | Small pure functions; separate D3 modules if complexity grows | Use full D3 rendering only when it has a clear benefit. |
| State animation | React, CSS, and `requestAnimationFrame` | A specialized library for complex sequences and transitions. |
| Direct object manipulation | Pointer Events | A ready-made library if gestures and constraints become a separate problem. |

Do not let a library determine the learning sequence. First define the learner's action and expected understanding. Then choose the smallest tool that supports the action.

### 4. Visual foundation

The baseline visual direction for React prototypes is:

- A minimal layout.
- A warm, light background.
- A limited accent palette.
- A clear sequence: introduction → control → visualization → conclusion or check.
- Enough open space to keep complex material readable.

Option B can contribute large typography, a focus on one change, and expressive animation. Use these techniques sparingly. They must not make the section interface harder to read.

### 5. Increase the scope of the next iteration deliberately

The next topic must be difficult enough to show the benefit of an interactive explanation over static text. The prototype must include:

- A short text introduction.
- A central question.
- Necessary definitions or prior knowledge.
- An interactive animation.
- Explanations that change with the animation.
- One or more contrasting cases.
- A prediction task before the result appears.
- A short understanding check after exploration.
- The source and limits of the explanation.

Include other information only when it helps explain the topic or check understanding.

### 6. Examine decisions after prototyping

Disposable prototypes do not require an interview before every iteration. After prototyping, use the `grilling` skill for a structured examination before finalizing product or architecture decisions, unless the user explicitly requests another approach.

## Consequences

- Preparing the section prototype before writing the interface takes more time.
- The first screen will take slightly longer to create, but there is less risk of visualizing the wrong idea well.
- The React foundation supports development across topics and tests whether components can be reused.
- Evaluation considers both appearance and whether the learner can explain and apply the concept after interacting.
- The first HTML prototype remains a disposable record of the visual directions found.

## Condition for starting a new prototype

Choose a topic and agree on the section prototype before creating a React prototype. Only then select the visualization libraries and first set of components.
