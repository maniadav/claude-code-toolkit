
# Global Engineering & Agent Guidelines

This is a universal operating contract for AI coding agents and developers.

## 1. Source of Truth

Use this authority order when information conflicts:

1. Explicit requirements in the current task.
2. Current source code and executable configuration.
3. Tests and externally enforced contracts.
4. Repository-specific documentation.
5. These guidelines.
6. Generic assumptions or personal preferences.

Do not invent requirements, APIs, credentials, data, behavior, test results, or implementation details.

If documentation conflicts with the current implementation, treat the implementation as authoritative and update the documentation when appropriate.

---

## 2. Make the Smallest Correct Change

* Implement the requested behavior with the smallest reasonable change.
* Preserve existing behavior unless the task requires changing it.
* Do not refactor, rename, reformat, modernize, or reorganize unrelated code.
* Do not introduce abstractions, dependencies, configuration, infrastructure, or features without a concrete need.
* Prefer simple, readable, maintainable code over clever solutions.
* Reuse existing abstractions and patterns when they are appropriate.
* Keep responsibilities cohesive.
* Avoid premature or speculative abstraction.

A larger change is justified only when the smaller change would be incorrect, unsafe, incompatible, or unnecessarily difficult to maintain.

---

## 3. Inspect Only What the Task Requires

Before making a meaningful change:

* Inspect the relevant code.
* Check nearby implementations for established patterns.
* Check relevant configuration, tests, and documentation.
* Identify dependencies or consumers that could be affected.

Do **not** perform repository-wide investigation for a small, localized task.

Do not impose conventions from other projects or ecosystems when the repository already establishes its own conventions.

When multiple conventions exist, follow the convention used by the code being changed unless there is a concrete reason not to.

---

## 4. Match the Repository

Follow the existing repository's:

* Language and framework idioms.
* Naming and formatting conventions.
* Type system.
* Error-handling patterns.
* Module and architectural boundaries.
* Dependency-management approach.
* Testing strategy.
* Configuration model.
* API and data contracts.

Do not introduce a new pattern merely because it is theoretically cleaner or more modern.

Before adding a dependency, first check whether the repository already provides a suitable solution.

---

## 5. Code Quality

Code should be:

* Correct.
* Readable.
* Explicit where ambiguity matters.
* Consistent with surrounding code.
* Appropriately modular.
* Easy to test and maintain.
* Robust at meaningful failure boundaries.

Use precise types and contracts where supported.

Validate untrusted or external data at appropriate boundaries.

Handle meaningful null, missing, invalid, and unexpected states explicitly.

Do not bypass compiler, validator, linter, framework, authentication, authorization, sandboxing, or safety mechanisms without a justified requirement.

---

## 6. Error Handling and Security

Handle expected failures explicitly.

* Do not silently swallow errors.
* Preserve useful error context.
* Follow existing error-handling and logging conventions.
* Do not expose secrets or sensitive internal details through public errors.
* Validate external input where required.
* Do not log sensitive information unnecessarily.

Never:

* Commit secrets, credentials, tokens, or private keys.
* Hard-code credentials or environment-specific secrets.
* Weaken security controls merely to simplify implementation.
* Bypass authentication or authorization without an explicit requirement.

---

## 7. Architecture and Dependencies

Do not redesign architecture unless:

* The task requires it, or
* The existing architecture prevents a correct implementation.

Extract shared logic only when the abstraction is genuinely reusable and stable.

Keep application-specific behavior close to its owning domain when appropriate.

Before adding a dependency or external service:

1. Check for an existing solution.
2. Confirm that the dependency is actually necessary.
3. Follow the repository's dependency-management process.
4. Consider compatibility, security, maintenance, licensing, and runtime impact when relevant.

Never invent package names, APIs, versions, endpoints, credentials, or service behavior.

---

## 8. Comments and Documentation

Comments should explain **why**, not restate **what** the code already makes obvious.

Useful comments explain:

* Non-obvious decisions.
* Important invariants.
* Complex algorithms.
* Security-sensitive behavior.
* External limitations or workarounds.
* Compatibility constraints.

Do not add comments merely to describe straightforward code.

Update existing documentation when a change makes durable repository knowledge inaccurate.

Do not create documentation for trivial implementation details.

---

## 9. UI and Product Code

When modifying user-facing behavior:

* Follow the existing product and design language.
* Preserve accessibility and interaction conventions.
* Use clear, concise UI copy.
* Add UI only when it has a meaningful product purpose.

Do not add decorative elements merely to make a screen look complete.

Avoid unnecessary:

* Animations.
* Gradients.
* Shadows.
* Badges.
* Cards.
* Illustrations.
* Decorative icons.
* Placeholder content.
* Marketing language.

Generated UI should look like deliberate product engineering, not generic AI output.

---

## 10. Testing and Verification

Every meaningful change needs verification proportional to its risk.

Use the narrowest useful check first.

Depending on the change, this may be:

* Type checking.
* Linting.
* Formatting.
* Unit tests.
* Integration tests.
* Component tests.
* API tests.
* End-to-end tests.
* Build validation.
* Migration checks.
* Manual verification.

Use the repository's actual commands and tooling.

Do not run broad, expensive verification when a narrower check provides sufficient confidence for a small change.

Do not claim that a test, build, migration, deployment, or command succeeded unless it was actually run and succeeded.

If verification could not be run, state what was not verified.

Never weaken or remove tests merely to make a task pass unless explicitly required.

---

## 11. Generated Files and Configuration

Understand whether a file is generated before modifying it.

Prefer changing the source or configuration that generates an artifact.

Do not manually modify generated output unless the repository explicitly requires it.

Respect environment-specific configuration.

Do not hard-code:

* Credentials.
* Secrets.
* Host-specific paths.
* Environment-specific values.

Do not add speculative configuration for possible future use.

Keep source files reasonably sized, generally no more than 300 lines. When a file exceeds this threshold, consider splitting it into cohesive, independently maintainable modules. Do not split code solely to satisfy the line limit.---

## 12. Data, APIs, and Compatibility

When changing schemas, persisted data, APIs, protocols, or public interfaces:

* Identify relevant consumers.
* Consider downstream effects.
* Preserve compatibility where required.
* Follow existing migration practices.
* Avoid destructive changes unless explicitly required and safely handled.
* Update affected contracts and tests.
* Update documentation when durable behavior changes.

Do not assume a local implementation change has no external consumers.

---

## 13. Change Discipline

Before changing code:

1. Understand the relevant implementation.
2. Identify the smallest appropriate change.
3. Check nearby patterns.
4. Check relevant documentation when necessary.
5. Consider meaningful compatibility or downstream effects.
6. Identify the appropriate verification.

After changing code:

1. Review the resulting diff.
2. Remove accidental changes.
3. Run appropriate verification.
4. Check documentation if behavior or architecture changed.
5. Confirm new files and dependencies are necessary.
6. Check for unnecessary complexity.
7. Check that no secrets or sensitive data were introduced.

Do not perform unrelated refactoring.

---

## 14. Communication

Communicate concisely and technically precisely.

* State what changed and why when useful.
* Distinguish verified facts from assumptions.
* Mention relevant limitations or unverified areas.
* Do not claim work was performed when it was not.
* Do not fabricate command output, test results, file contents, or external information.
* Avoid unnecessary ceremony.

---

## 15. Task Proportionality

**Do not use the same process for every task.**

For a small, obvious, low-risk change:

* Inspect the relevant code.
* Make the change.
* Run a lightweight appropriate check.
* Review the diff.
* Stop.

For a large, cross-cutting, ambiguous, or high-risk change:

* Investigate more broadly.
* Identify affected components.
* Consider compatibility and failure modes.
* Plan when useful.
* Run broader verification.

The goal is **sufficient confidence**, not maximum process.

Do not create plans, abstractions, documentation, tests, or investigations that provide no meaningful value for the task.

---


## 16. Final Check

Before completing a task, confirm:

* [ ] The requested behavior is implemented.
* [ ] Existing behavior was preserved where required.
* [ ] Repository conventions were followed.
* [ ] No unnecessary abstractions or dependencies were added.
* [ ] Relevant errors and edge cases are handled.
* [ ] Security and privacy implications were considered where relevant.
* [ ] Appropriate verification was performed.
* [ ] The diff contains no unrelated changes.
* [ ] Generated files were handled correctly.
* [ ] Relevant documentation remains accurate.
* [ ] No secrets or sensitive data were introduced.
* [ ] create decision.md: log every meaningful decision the you made while changing the code - and the reasoning behind it. Why this library over that one. Why this pattern. Why this tradeoff was accepted.
* [ ] create FLOW.MD:  document how execution actually travels - between files, functions, and modules. What calls what, in what order, and exactly which parts of that path you're modifying right now.
* [ ] No unnecessary AI-generated filler or decorative output was introduced.

**When the task is simple, finish simply.**
