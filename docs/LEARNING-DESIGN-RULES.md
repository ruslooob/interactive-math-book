# Rules for Designing an Interactive Section

These rules follow the review of the prototype for §11, «Показательная функция». They apply to later sections unless a specific topic has a different decision.

## Learning goal

1. Each section has one stated learning goal. Build its content around that goal, not a mandatory template.
2. A goal to introduce a concept means the learner must understand a new concept, object, or relationship. Use a brief explanation, examples, and a parameterized animation as the main tools.
3. A goal to teach problem solving means the learner must learn a specific action or method. Use problem forms, a solution method, trainers, and ways to check the result.
4. A parameterized animation can clarify a section that teaches problem solving, but it does not replace a trainer. The learner must perform the actions that make up the skill.
5. Every section element must support its learning goal. Remove an element if its role in that goal is unclear.
6. A learning goal differs from a topic. The topic names the subject, while the goal describes the learner's result.

## Text

1. Do not repeat the same idea in the same way in the introduction, definition, formula, and example.
2. A short verbal description can appear with its exact mathematical notation. Pairing text and a formula explains the idea and is not needless repetition.
3. Remove phrases about the author's intentions, such as "let us explore" or "let us consider," when they give no mathematical information.
4. If a formula states a claim precisely and briefly, use the formula as the main form.
5. A question mark can follow a short formula or notation. On hover or focus, it shows a plain-language explanation of the material beside it.
6. An explanation gives the meaning of notation instead of repeating it with different symbols.
7. Attach restrictions on variables and parameters to the defining formula with the word «где»: `y = aˣ, где a > 0, a ≠ 1`.

## Section hierarchy

1. Navigation shows the number and topic of the current section.
2. Use a heading such as `§11. Показательная функция`. Put the number and topic on one line at the same visual level.
3. The heading must not occupy most of the first screen.
4. The learning goal determines the order. To introduce a concept, use `introduction → example → parameterized animation → properties → check of understanding`.
5. To teach problem solving, use `introduction, definition, and formulas → properties and method → examples and problem forms → trainers and visual interactives → additional information and restrictions → self-check`.
6. In a section that introduces a concept, place the example in a separate block immediately after the definition. Do not put it at the same level as the definition.

## Presentation of information

1. Use an ordinary bulleted list for properties unless their relationship requires a diagram. Do not use columns, separator lines, or other table features for that list.
2. Use a semantic table for tabular values instead of a set of blocks that only look like a table.
3. Mark a warning or important restriction with attention yellow. Give the highlighted block a clear label. Do not rely on a colored background alone or use red text as the main emphasis.
4. Decorative structure must not make a simple list harder to read.
5. Remove a caption or explanation if it adds no mathematical information to the adjacent formula, table, or example.
6. If a section has several alternative forms of one problem, show one form at a time. Let the learner choose the others in a slider.
7. Show the simplest or main problem form first. Each later form adds one new difficulty.
8. Keep the slider as wide as its content needs and align it with the left edge of the main flow.
9. Below the current form, show its position and the total number of forms. Provide clear previous and next buttons, and support arrow keys.
10. Do not add dots, tabs, or other controls that jump directly to an arbitrary form.
11. Show forms together only when direct comparison is part of the learning goal.
12. Do not show learners explanatory text about how the interface works. Controls must show their purpose and state. Add text only when it gives learning information.

## Interactives

1. The project uses two kinds of interactives: parameterized animations and trainers.
2. Select the interactive by the section's learning goal. Motion or a graph alone does not make material useful.
3. Interactive controls must match meaningful learner actions. Do not add sliders or buttons only to create interaction.

### Parameterized animation

1. A parameterized animation helps learners understand a concept or relationship by changing a mathematical model.
2. The learning task determines the visualization. Use a graph only when a spatial view helps explain the material.
3. A graph supports direct exploration. Hovering over or touching any point on a curve shows its coordinates.
4. Do not add a separate parameter if the learner can act more naturally on the animation itself. A graph needs no argument slider to select a point.
5. Animation parameters contain only actions that change the mathematical state of the model.
6. Do not use a separate section of toggleable hints. Place essential guides in the animation itself.
7. Recalculate the value table when animation parameters change.
8. Let the learner enter an argument value and immediately see the calculated function value.

### Trainer

1. Each trainer develops one stated skill.
2. Tasks progress from one action to use of the full method.
3. Give a wrong answer meaningful feedback and allow another attempt.
4. After a correct answer, show the result of the action before moving to the next task.
5. End a trainer with an explicit result and allow the learner to start again.
6. Before an answer is selected, show only the problem, question, and available actions. Do not show text that reveals the rule, solution direction, or correct operation.
7. After the learner selects an answer, explain the error or show how the applied rule works.

## Check of understanding

1. Show one question at a time in a separate card.
2. After an answer, show the next question.
3. After the last question, show the final result and a short recommendation.
4. Keep the check of understanding as a separate part of the section after the explanation and example.
5. Use the direct check heading «Проверь себя».
6. If every answer is correct, show «Все ответы верны. 🙂» as the final text.

## Selected layout

The current MVP uses the sequential section layout from variant C. It was selected for its clear reading order and adequate space to explain the topic. Variants A and B remain in Git history and are no longer in development.

## Book navigation

1. The shell header always shows the application name `Interactive Books`. The open tree header shows the book title to the left of the hamburger button.
2. The hamburger button and one book tree are available on every page of the implemented chapter.
3. The tree stays open during navigation until the user closes it with the hamburger button.
4. The tree and main learning content scroll independently.
5. Do not use a separate table of contents or breadcrumbs. Navigate the book through the tree.
6. Bottom navigation moves between adjacent pages in the implemented chapter tree. Theory and practice sections take part in this sequence when a section contains both.
7. An unimplemented chapter opens a placeholder. Do not block access or hide its entry.
8. The learner can open any implemented section directly, regardless of progress in earlier sections.

## Learning content sources

1. Use the textbook scan for book structure and section titles when text extraction is not required.
2. Check missing definitions and formulas against open learning sources.
3. Record sources beside the application so their wording can be checked and revised.
