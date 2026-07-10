# Scoop City v4.98 Merchant AI Flow UX Fix

This version improves the merchant AI publishing flow without changing the AI backend quality rules.

## Changes

- Added a visible AI generation loading state with spinner, progress bar, and elapsed seconds.
- Preserved merchant input text when uploading images or changing tone.
- Added exit confirmation for the AI publishing flow.
- Added a final `完成` button; closing is no longer the only way to finish.
- `查看发布效果` now temporarily opens the published post and returns to the AI flow after closing the post.
- The success page keeps copy/edit actions available until the merchant chooses `完成`.

## No SQL Required

This version only changes frontend flow behavior.

