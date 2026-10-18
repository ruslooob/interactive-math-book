---
status: proposed
---

# Place one book tree in a collapsible sidebar

A separate table of contents, breadcrumbs, and links between sections created competing navigation paths. They also hid the position of practice pages in the book. Use one tree, `book → chapter → section → page`, as the main navigation. Place it in a collapsible sidebar. A hamburger button opens it on every implemented content page.

Theory and practice categories are adjacent pages within each section. The sidebar stays open across navigation until the learner explicitly closes it. Bottom navigation follows the same page order as the tree. Do not use a separate table of contents or breadcrumbs.

This arrangement makes the book structure available without permanently reducing the space for learning material. It gives theory and practice one clear navigation model.

## Options considered

- An always-visible sidebar shows the structure well but permanently uses space needed for the learning material.
- A separate table of contents and breadcrumbs are familiar individually but duplicate navigation and split the representation of the book structure.
- One collapsible tree can be hidden when unnecessary and remains the navigation point for the whole book.

## Consequences

- The book structure, available pages, and their order must have one data source.
- Adding a practice page changes both the tree and the adjacent-page navigation order.
- Sidebar state belongs to the book shell and must not reset when the learner changes pages.
