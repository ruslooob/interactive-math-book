# AGENTS.md

## Agent skills

Соглашения по запуску скиллов разными агентами и людьми описаны в `.agents/skills/README.md`.

### Issue tracker

Задачи и спецификации ведутся в GitHub Issues репозитория `ruslooob/interactive-math-book`. См. `docs/agents/issue-tracker.md`.

### Triage labels

Для входящих GitHub Issues используются стандартные состояния `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human` и `wontfix`. См. `docs/agents/triage-labels.md`.

### Domain docs

Проект использует единый доменный контекст: `GLOSSARY.md` и `docs/adr/` находятся в корне проекта. См. `docs/agents/domain.md`.

## Разработка MVP

Рабочее приложение находится в `app/` и является MVP интерактивной математической книги.

1. Перед изменением учебного поведения прочитать `docs/LEARNING-DESIGN-RULES.md`.
2. До начала реализации зафиксировать в GitHub Issue цель изменения, критерии готовности и способ проверки.
3. Если вопрос нельзя надёжно решить обсуждением, сначала создать изолированный одноразовый прототип через `/prototype`, записать вывод и только затем менять MVP.
4. Работу, рассчитанную более чем на одну сессию, оформить через `/to-spec` и `/to-tickets`.
5. Каждую задачу реализации выполнять в новой сессии через `/implement`; контекст между задачами не переносить вручную.
