---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it under `.scratch/handoffs/` in the current project. Use a timestamp and short descriptive slug in the filename so parallel handoffs do not collide.

Include a "suggested skills" section in the document, naming which project skills the next agent should use. Follow the invocation convention in `.agents/skills/README.md`.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
