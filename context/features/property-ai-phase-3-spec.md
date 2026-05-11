# Property AI Phase 3 Spec

## Overview

This is phase 3 of 3 for the AI-assisted property listing feature.

The goal of this phase is to improve usability and harden the feature after the backend route and create-form integration are working.

This phase should not expand the feature beyond:

- title generation
- shortDescription generation
- Add Property page integration

## Requirements for phase 3

- Improve loading and disabled states for the "Generate with AI" button
- Improve error handling and user feedback
- Make sure duplicate clicks are prevented while generation is in progress
- Make sure empty or weak payloads are handled safely
- Review prompt quality and improve it only if needed
- Keep the returned AI shape limited to:
  - title
  - shortDescription
- Ensure the feature fails safely without breaking the Add Property form
- Add brief documentation for:
  - required environment variable
  - endpoint purpose
  - expected request/response shape

## Nice-to-have only if already simple

- Extract small helper logic if it reduces duplication cleanly
- Add a request helper in `utils/requests.js` if consistent with current project style

## Do not add in this phase

- Edit page integration
- Property schema changes
- Tags
- SEO keywords
- Bullet points
- New admin page
- Broader AI architecture changes

## References

- `components/PropertyAddForm.jsx`
- `app/api/properties/ai-content/route.js`
- `utils/requests.js`
- `README.md`
- `context/features/property-ai-phase-1-spec.md`
- `context/features/property-ai-phase-2-spec.md`
