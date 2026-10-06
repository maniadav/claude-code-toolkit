Inline Comment 
Review the entire codebase and remove low value comments that only restate what the code already clearly expresses. Keep comments only where they add real engineering value.
Remove comments like:
obvious line-by-line explanations (// increment counter)
redundant naming explanations (// fetch user data above fetchUserData())
framework boilerplate comments
comments describing trivial conditions or assignments
Keep comments only if they explain:
non-obvious business logic
architectural decisions
performance optimizations
edge cases or workarounds
security implications
API contracts or invariants
complex algorithms
reasoning behind "why", not "what"
technical debt markers (TODO, FIXME, HACK) when meaningful
Follow senior engineer standards:
Prefer self-documenting code over comments
If code needs a comment because naming is poor, improve naming first
Delete stale or misleading comments
Preserve public API documentation where needed
Keep comments concise and high signal
Goal: make the codebase read like something maintained by experienced senior developers with a strong emphasis on clarity and maintainability.

