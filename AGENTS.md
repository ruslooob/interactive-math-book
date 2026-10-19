# AGENTS.md

## General rules

- Write briefly and clearly.
- Prefer Bash for commands.
- The root `Makefile` lists all available project commands. Use its targets for project tasks.
- Write replies in simplified English with `/asd-ste100`. Use English for repository text, Issues, pull requests, commit messages, and agent instructions.

## Agent skills

### Issue tracker

Tasks and specifications are GitHub Issues in `ruslooob/interactive-math-book`. See `docs/agents/issue-tracker.md`.

### Triage labels

Incoming GitHub Issues use `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

The project has one domain context. `GLOSSARY.md` and `docs/adr/` are at the repository root. See `docs/agents/domain.md`.

## Development and acceptance stages

1. Create a separate branch from the current `master` for each task. Do not commit task changes directly to `master`.
2. During implementation, change the code, run automated checks, and conduct an internal review. For UI changes, also run the app and check it in an available browser at the target desktop resolution. Include the required mouse and keyboard actions.
3. Commit the review candidate on the task branch, push the branch to GitHub, and open a pull request with `/pr`. A commit on the task branch records a candidate. It does not mean the user accepted it.
4. If a required check is incomplete, open a draft pull request. List the unchecked criteria and leave the verification stage incomplete. After completing agent checks, mark the pull request ready for review and give the user its link.
5. User acceptance requires explicit user approval. Builds, tests, and internal review do not replace it. Before approval, do not merge the pull request, close the issue, or declare the task resolved.

Report status in this format:

- `Completed stage: ...`;
- `Next stage: ...`;
- `User action required: ...`.

## Workspace cleanup

1. After checks, remove temporary reports, screenshots, traces, build directories, and tool caches when they are no longer needed.
2. Before finishing, check `git status` and ignored files. Leave no Playwright artifacts, temporary Markdown files, or other one-use files.
3. Keep dependencies, user files, and reproducible source materials even when Git ignores them.

## MVP development

The working app is in `app/`. It is an MVP interactive mathematics book.

1. Read `docs/LEARNING-DESIGN-RULES.md` before changing learning behavior.
2. Before implementation, record the change goal, acceptance criteria, and verification method in a GitHub Issue.
3. If discussion cannot reliably resolve a question, first create an isolated, disposable prototype with `/prototype`. Record the conclusion before changing the MVP.
4. Use `/to-spec` and `/to-tickets` for work that will take more than one session.
5. Perform each implementation task in a new session with `/implement`. Do not transfer context manually between tasks.
