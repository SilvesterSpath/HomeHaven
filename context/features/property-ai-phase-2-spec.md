# Property AI Phase 2 Spec

## Overview

This is phase 2 of 3 for the AI-assisted property listing feature.

The goal of this phase is to connect the existing Add Property page to the backend AI endpoint created in phase 1.

This phase should only integrate the AI feature into the property create flow.

The AI feature should:

- generate a title
- generate a short description
- fill the existing form fields

Mappings:

- title -> Listing Name
- shortDescription -> Description

## Requirements for phase 2

- Update `components/PropertyAddForm.jsx`
- Add a "Generate with AI" button near the Description section
- Add minimal local state for:
  - isGenerating
  - aiError
  - rawNotes
- Add an optional `rawNotes` textarea for user guidance
- Build the AI request payload from existing form values:
  - property type
  - location
  - beds
  - baths
  - amenities
  - rawNotes
- Call `/api/properties/ai-content`
- On success:
  - fill the existing Listing Name field
  - fill the existing Description field
- Keep the normal property submit flow unchanged
- Do not integrate into the edit page in this phase
- Do not add bullet points, tags, or SEO keywords
- Do not refactor unrelated form logic

## References

- `components/PropertyAddForm.jsx`
- `app/properties/add/page.jsx`
- `app/api/properties/ai-content/route.js`
- `utils/requests.js`
- `context/features/property-ai-phase-1-spec.md`
- `context/features/property-ai-phase-3-spec.md`
