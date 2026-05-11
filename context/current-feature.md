# Current Feature

<!-- Feature Name -->

## Status

<!-- Not Started|In Progress|Completed -->

Not Started

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-17: Feature initialized from `property-ai-phase-1-spec.md` and status set to In Progress.
- 2026-04-20: Property AI Phase 1 complete. Fixed error classification gaps: malformed request JSON now returns `400 INVALID_REQUEST`; AI provider network failures and upstream body parse failures now return normalized `502` errors (`AI_PROVIDER_ERROR` / `AI_INVALID_RESPONSE`). Changes in `app/api/properties/ai-content/route.js` and `utils/ai/generatePropertyAIContent.js`.
- 2026-04-20: Feature updated to Property AI Phase 2 (Frontend Integration).
- 2026-04-20: Feature updated to Property AI Phase 3 (Hardening & Documentation).
- 2026-04-20: Property AI Phase 3 complete. Added client-side empty location guard with user-facing error, auto-clear error on rawNotes change, aria-busy on generate button. Added AI feature documentation to README.md (env vars, endpoint, request/response shape, error codes). Added 4 route error-path tests (malformed JSON, fetch throw, provider body parse fail, non-OK response) and 6 component tests (location guard, success fill, error display, error auto-clear, loading state, duplicate click prevention). 20 tests passing.

**Completed Features**

- **Property AI - Phase 1 (Backend Foundation)** — 2026-04-20
  - POST-only authenticated endpoint at `app/api/properties/ai-content/route.js`
  - Input validation for `propertyType`, `location`, `beds`, `baths`, `amenities`, `rawNotes`
  - OpenAI call via `utils/ai/generatePropertyAIContent.js`
  - Response shape validation returning only `title` and `shortDescription`
  - Normalized JSON error responses with structured `code`/`message`
  - Error classification hardened: malformed JSON → `400`, provider network failures → `502`

- **Property AI - Phase 2 (Frontend Integration)** — 2026-04-20
  - `generateAIPropertyContent` request helper added to `utils/requests.js`
  - `PropertyAddForm` updated with `isGenerating`, `aiError`, `rawNotes` state
  - AI handler builds payload from existing form values and calls `/api/properties/ai-content`
  - On success fills Listing Name (`fields.name`) and Description (`fields.description`)
  - AI helper UI nested under Description field with reduced visual weight
  - Normal form submit flow unchanged

- **Property AI - Phase 3 (Hardening & Documentation)** — 2026-04-20
  - Client-side empty location guard with user-facing error before API call
  - Error auto-clears when user edits rawNotes
  - `aria-busy` on generate button for screen reader support
  - AI feature section added to `README.md` (env vars, endpoint, request/response shape, error codes)
  - 4 route error-path tests: malformed JSON, fetch throw, provider body parse fail, non-OK response
  - 6 component tests: location guard, success fill, error display, error auto-clear, loading state, duplicate click prevention
