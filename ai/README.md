# AI Process

This folder defines a lightweight, professional workflow for coordinated AI agents working on this API codebase. The documents here are designed to be human-readable, auditable, and easy to adapt.

## Purpose

- Provide a single source of truth for planning, architecture, and operating rules.
- Keep agent responsibilities clear to avoid task overlap.
- Make the output reviewable and safe for production changes.

## Files

- TODO.md: Task backlog, in-progress items, and done work.
- ARCHITECTURE.md: System context, design constraints, and key decisions.
- RULES.md: Operating rules and quality bar.
- agents/: Role definitions and handoff expectations.

## Workflow Summary

1. Planner updates TODO.md with scoped tasks and acceptance criteria.
2. Architect updates ARCHITECTURE.md when design impacts occur.
3. PM assigns tasks and maintains dependencies in TODO.md.
4. Developers implement tasks and update status and evidence links.
5. QA writes or updates tests and records results.
6. Reviewer performs final pass against RULES.md and TODO.md.

## Conventions

- Keep edits small and traceable.
- Update TODO.md as the source of truth for progress.
- Prefer explicit checklists and acceptance criteria.
- Avoid emojis and decorative formatting.
