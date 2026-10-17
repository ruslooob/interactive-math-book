---
name: implement-spec
description: "Implement the result of /to-spec and /to-tickets in code."
disable-model-invocation: true
---

You have been provided a spec. This spec should have tickets associated with it, describing how to implement the spec.

The issue tracker should have been provided to you. If not, tell the user to run `/setup-matt-pocock-skills`.

The goal is the entire spec implemented on a single **integration branch**, with every ticket resolved the way the issue tracker closes work.

The tickets are not a list of steps. They are a **task graph** with blocking relationships between them. This means there is always a **frontier** of tickets which are ready to be grabbed.

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, research notes, and previous commits. Don't duplicate information already available via pointers.

Use parallel implementers when the environment supports isolated agents. Otherwise execute the same tickets sequentially, one worktree and branch at a time. The task graph, isolation and completion criteria are unchanged in either mode.

## Steps

1. Read the spec and tickets to understand the task graph.

2. (optional) Use an **exploration worker** to conduct any exploration required by the tickets - relevant codebase files or external documentation. Save its Markdown notes under `.scratch/<feature>/research/` in the project so future workers can access them. This lets implementers focus on implementation rather than exploration.

3. Create the integration branch. If the issue tracker closes work through PRs, or the user asks for one, open a draft PR after the first merge in step 5 (a branch with no commits ahead of main can't open one), marked as closing the spec and tickets.

4. Use isolated **implementers** to implement each ticket, each in its own worktree on its own branch. An implementer may be a subagent or the current agent working sequentially. Each implementer:
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - calls the Skill tool with `tdd` to build the ticket;
   - merges the integration branch tip into its own branch before reporting done

5. Once an implementer completes, merge its work to the integration branch. Use a separate merger agent when available; otherwise perform the same merge and verification sequentially.

6. If this changes the **frontier** of available tickets, kick off more **implementer subagents** to work on the new tickets. This allows for maximum concurrency.

7. Once all tickets are complete, use `code-review` on the integration branch. Fix all issues raised by the code review in a single isolated implementation task.

8. If a draft PR exists, mark it ready for review. Otherwise, resolve each ticket the way the issue tracker closes work, and report the integration branch.

9. Clean up all **implementer subagent** worktrees.
