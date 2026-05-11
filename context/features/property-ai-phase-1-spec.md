# Property AI Phase 1 Spec

## Overview

This is phase 1 of 3 for the AI-assisted property listing feature.

The goal of this phase is to implement the backend-only foundation for AI content generation.
No frontend integration should be done in this phase.

The AI feature should generate only:

- title
- shortDescription

These outputs will later map to:

- title -> Listing Name
- shortDescription -> Description

## Requirements for phase 1

- Add backend route at `app/api/properties/ai-content/route.js`
- POST endpoint only
- Require authenticated user using the existing session/auth utility
- Accept JSON input with:
  - propertyType
  - location
  - beds
  - baths
  - amenities
  - rawNotes (optional)
- Add minimal input validation
- Call the AI provider from the server
- Prompt the model to return only:
  - title
  - shortDescription
- Validate the AI response shape before returning it
- Return normalized JSON error responses
- Do not modify any frontend files in this phase
- Do not change the Property schema in this phase
- Do not persist any AI-specific fields in this phase

## References

- `app/api/properties/route.js`
- `app/api/properties/[id]/route.js`
- `utils/getSessionUser.js`
- `models/Property.js`
- `context/features/property-ai-phase-2-spec.md`
- `context/features/property-ai-phase-3-spec.md`
