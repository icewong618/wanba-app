# Leshenghuo v4.95 Merchant AI Final Precheck

This version is the final merchant AI precheck before deciding whether the project can move into the 5.0 public beta preparation stage.

## Updates

- Improved merchant AI modal behavior on small mobile screens.
- Added clearer copy that the current merchant AI feature is a content assistant, while the real AI API will be connected later.
- Added a reminder that AI does not generate prices, inventory, discount percentages, or other factual business data.
- Added a generating state to reduce repeated taps on the AI generate button.
- Merchant AI posts now receive a `商家发布` tag for clearer feed/detail identification.
- Kept v4.94 safeguards:
  - no duplicate publish taps
  - clearer success page
  - avatar/profile navigation consistency

## Database

No new SQL is required for this version.

## 5.0 Readiness Notes

The merchant AI publishing flow is usable as a front-end content assistant, but it is not a real AI API workflow yet.

Before public beta, decide whether 5.0 should launch with:

- the current assisted-template generator, clearly labeled as a content assistant
- or a real AI backend endpoint connected before public beta

Recommended remaining checks:

- Verify merchant AI flow on iPhone and Android Chrome.
- Verify publish, copy, regenerate, and old-version restore.
- Verify merchant profile logo appears correctly on AI posts.
- Verify business users understand external platforms require manual copy/paste.
- Confirm whether the current non-real-AI wording is acceptable for public beta.
