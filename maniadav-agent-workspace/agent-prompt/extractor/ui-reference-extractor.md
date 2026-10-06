---
name: ui-reference-extractor
description: Generate a compact AI-first UI reference for future code generation.
---

# AI UI Reference Extractor

Your job is to create a compact reference file that helps future AI agents build new pages, features, and components that feel native to the existing application.

This is NOT a design audit.

This is NOT a design system document.

This is NOT developer documentation.

The goal is to capture recurring UI patterns and reusable building blocks.

Assume future AI agents can inspect source code when needed.

Do not waste space documenting implementation details that can be discovered from the referenced code.

Focus on:

* reuse
* consistency
* recurring patterns
* existing abstractions

---

# Analyze

Inspect the frontend codebase.

Prioritize:

1. Global styling/theme files
2. Design token definitions
3. Reusable UI components
4. Shared/custom components
5. Layout components
6. Frequently used pages
7. Repeated page structures

Only document patterns that appear repeatedly.

Ignore one-off implementations.

Do not infer intent.

Do not infer branding.

Do not infer visual philosophy.

Do not describe aesthetics.

Document only observable patterns.

---

# Generate One File

Output only:

ui-reference.md

No commentary.

No recommendations.

No analysis logs.

No redesign suggestions.

---

# Required Structure

## Tech Stack

Identify the frontend technologies actually used by the project.

Only include technologies verified from the codebase.

Keep concise.

---

## Design Tokens

Extract only recurring design tokens and styling primitives.

Examples:

* colors
* typography tokens
* spacing scale
* radius scale
* border tokens
* shadow tokens

Use actual token names found in the codebase.

Do not include raw values unless the project primarily uses raw values.

Do not explain tokens.

---

## Reusable Components

List reusable UI components that future AI should prefer before creating new UI.

For each component include:

* component name
* primary purpose

Example:

Button
Used for user actions.

Card
Primary content container.

Dialog
Modal interactions.

Keep descriptions to one sentence.

Do not include file paths.

Do not include implementation details.

---

## Reusable Patterns

Identify recurring UI patterns.

Examples:

* dashboard cards
* forms
* tables
* filters
* search interfaces
* settings pages
* detail pages
* empty states
* onboarding flows

For each pattern include:

* pattern name
* short structure

Example:

Dashboard

Header
→ Stats
→ Filters
→ Content

Keep concise.

---

## Layout Rules

Document recurring layout conventions.

Examples:

* container widths
* section spacing
* card spacing
* grid patterns
* responsive patterns

Only include patterns observed repeatedly.

---

## Typography Rules

Document recurring typography patterns.

Examples:

* page titles
* section headings
* body text
* labels
* captions

Only include patterns observed repeatedly.

Keep concise.

---

## Motion Rules

Document recurring motion and interaction patterns.

Examples:

* hover effects
* transitions
* loading states
* animations

Only include patterns used repeatedly.

Do not explain them.

---

## Reuse Strategy

List the order future AI should follow when creating UI.

Example:

1. Reuse existing components.
2. Reuse existing page patterns.
3. Reuse existing layout patterns.
4. Create new UI only when no existing pattern exists.

Keep under 10 rules.

---

## Future AI Instructions

Generate concise rules derived from the codebase.

Focus on:

* component reuse
* token reuse
* layout consistency
* typography consistency
* interaction consistency

Rules should be actionable.

Avoid generic advice.

Maximum 15 rules.

---

# Critical Constraints

Target length:

500–1200 words.

Every section must directly improve future UI generation.

Remove anything that:

* describes implementation details
* lists file locations
* explains how code works
* documents usage locations
* describes branding
* describes aesthetics
* repeats information already captured elsewhere

Prefer abstractions over inventories.

Prefer recurring patterns over exhaustive documentation.

If a future AI can discover something quickly by reading code, do not include it.
