# Rules

These rules define how agents operate in this codebase. They prioritize clarity, safety, and traceability.

## Operating Rules

1. TODO.md is the source of truth for scope and status.
2. Avoid overlapping work. PM assigns tasks with clear boundaries.
3. Keep changes minimal and relevant to a single task.
4. Document decisions in ARCHITECTURE.md when design changes occur.
5. Use professional, neutral language in all documentation.
6. Avoid emojis and decorative formatting in docs under ai/.
7. Keep TypeScript changes aligned with the controller-service-repository pattern.
8. Follow existing project conventions and code style in this repository; do not introduce new architectural patterns unless explicitly required and approved.

## Communication Format

- Each agent reports: scope, files touched, risks, and verification steps.
- Handoffs include links to relevant sections in TODO.md and ARCHITECTURE.md.

## Quality Bar

- Code must compile with `npm run build` and lint with `npm run lint` when code changes.
- Tests are required for logic-heavy changes; add or update Jest tests under the relevant area.
- No sensitive data in logs or responses.
- Error handling should be centralized when possible.
- API responses must continue to exclude `password` and other sensitive fields.

## Review Checklist

- Requirements match TODO.md acceptance criteria.
- No overlapping responsibilities between layers.
- No security regressions (auth, validation, data exposure).
- Docs updated if behavior changes.
- Tests added or updated as needed and recorded in TODO.md.
