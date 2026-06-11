# 0001. Colocated component structure with layered separation

Date: 2026-06-11
Status: Accepted

## Context
The codebase started with a flat, file-per-purpose layout (all components in
one folder, all hooks in another, etc.). As it grew, navigation got painful:
finding everything related to one component meant jumping across several
distant folders. I want related code to live together and a clear rule for
where any given piece of logic belongs.

## Decision
Adopt a colocated, layered structure with these rules:

1. **Colocation.** A component that owns its own hooks, styles, or types gets
   its own folder containing them. (Trivial, logic-free components stay as a
   single file — a folder for them adds structure without hiding anything.)

2. **Screens are presentational.** Screens render UI only and hold no business
   logic. They consume hooks; they don't implement behavior.

3. **Layered data access.** Hooks never call Supabase or SQLite directly.
   Data access goes through a service layer; hooks call services.

4. **Shared code is promoted, not nested.** Anything used by more than one
   feature lives at the root of `features/`, never buried inside a single
   `features/<name>/` folder.

## Consequences
+ Everything about one component is in one place — much faster to navigate.
+ Clear, testable seams: UI (screen) / orchestration (hook) / data (service).
+ Swapping the backend touches only services.
- More files and per-component boilerplate; only pays off past a size threshold.
- Risk of premature folders for tiny components (mitigated by rule 1's caveat).
- "Shared at root" can become a dumping ground; revisit if `features/` root bloats.

## Open question
Where does pure business logic live, inside hooks, or in react-free `core/`
functions the hook calls? This ADR puts it in hooks. If hooks start getting
fat, supersede with an ADR adopting the thin-hook + `core/` pattern.