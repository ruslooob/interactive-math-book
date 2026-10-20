# Issue #71 verification

## Review candidate

This branch starts from `origin/master` at `e66f080`. It includes draft PR #67 through PR #68 (`3317278`) and draft PR #69 (`0e50273`) through a local integration merge. The prerequisite PRs remain open. Their content is part of this combined candidate for review.

Conflicts occurred in the application route, book shell, content registry, and application README. The combined registry admits exercises 11.1–11.25 with 94 ready parts. The catalog still contains 78 exercises and 284 parts. Mathematical definitions and answer checks from both prerequisite implementations remain unchanged.

## Result

```text
§11 theory ↔ 11.1 ↔ ... ↔ 11.7 ↔ 11.8 ↔ ... ↔ 11.12
           ↔ 11.13 ↔ ... ↔ 11.16 ↔ 11.17 ↔ ... ↔ 11.25 ↔ §12 theory
```

Each exercise has one shared pair for page navigation. Top letter selectors choose parts. Exercise identifiers and section progress remain visible. The exercise ordinal counter and separate part and group pagination are removed.

Solved selectors and completed exercises in the tree use the same pale yellow-green background. A border marks current selection. A blue outline marks keyboard focus. Accessible names retain solved status. Replay, wrong attempts, and reload preserve first-correct progress.

Unfinished groups remain placeholders. They contain no answer controls. They do not enter the shared exercise route.

## Automated checks

`make check` passed on 2026-10-20:

- TypeScript checks and production build passed.
- All 23 model tests passed without the learner UI.
- All 17 Chromium browser tests passed.
- Route checks cover the full ordered list, group boundaries in both directions, theory, and §12.
- Mathematical and progress checks retain independent worked answers and saved-state checks from both prerequisite implementations.
- Browser checks visit all 25 exercises using the shared controls. They also check keyboard actions, solved accessible names, replay, reload, browser history, and unfinished content.

The build reports the existing warning about a JavaScript chunk larger than 500 kB. It does not fail the build.

## Browser check

The combined app ran at `http://127.0.0.1:5177/` with a 1440 × 900 viewport.

At the user's request, the preview then moved to `http://localhost:5173/`. The browser confirmed the combined exercise page and its shared navigation on that port. The running code is in the isolated `test-math-issue-71` worktree on branch `issue-71-navigation`.

- Mouse navigation crossed 11.7 → 11.8 and 11.12 → 11.13.
- Keyboard Enter returned from 11.13 to 11.12.
- Keyboard Enter opened §12 from 11.25. Mouse navigation returned to 11.25.
- Correct answers completed 11.1. Replay and reload preserved all four solved selectors and the completed tree indicator.
- Visual inspection confirmed the pale background, separate current border, visible keyboard outline, and readable answer button.
- The graph and comparison browser tests checked answer entry, retry, replay, and saved progress.
- Browser console output showed only a missing favicon request during the visible check. No application exception occurred.

Temporary screenshots and reports are removed after inspection. The browser tests can reproduce them.

## Pending stages

The user deferred the `/code-review` skill in issue #71. That review stage remains pending. The pull request must remain a draft until the required review is complete. Explicit user acceptance is also pending. No prerequisite PR or issue is merged or closed.

Source references remain in the two prerequisite verification documents:

- [Exercises 11.1–11.12](PARAGRAPH-11-EXERCISES-1-12-VERIFICATION.md)
- [Exercises 11.13–11.25](PARAGRAPH-11-GRAPH-COMPARISON-VERIFICATION.md)
