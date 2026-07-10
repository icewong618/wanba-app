# Leshenghuo v4.94 Merchant AI Publishing Experience QA

This version is a QA-focused patch on top of v4.93. It improves the merchant AI publishing flow and makes avatar navigation more consistent across the app.

## Updates

- Merchant AI publish button now blocks repeated taps while publishing.
- Merchant AI success page now explains whether external platform copy is ready.
- If cloud save fails, the success page keeps a clear warning that the post is only visible locally until database permission is fixed.
- Home feed author avatar and name now open the user or merchant profile.
- Weekend/activity feed author avatar and name now open the user or merchant profile.
- Comment avatars and names now open the user or merchant profile.
- Message center avatars in DMs, comments, fans, likes and favorites now open the user or merchant profile.

## Database

No new SQL is required for this version.

## Deployment

- Main file: `index.html`
- Version archive: `versions/4.94/`
- Daily price sync workflow path: `versions/4.94`
