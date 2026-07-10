# Scoop City v4.99 Video Link + AI Flow Stability

This version improves video publishing and merchant AI publishing stability.

## Changes

- Fixed hard-coded `v4.92` on launch screen and desktop header.
- Visible version now syncs from `APP_VERSION`.
- AI generating flow can no longer be closed accidentally while generation is running.
- Merchant AI copy output no longer adds platform labels such as `English` or `小红书`.
- UI label `English` is replaced with `英文版`.
- Normal publish page video link now auto-detects YouTube and TikTok.
- TikTok links render in post detail through an embedded player.
- TikTok posts show a video card in the feed.
- Merchant AI publish page now has a video link input for YouTube or TikTok.
- Merchant AI published posts can include YouTube or TikTok video links.
- Added TikTok upload authorization entry, with clear notice that real direct upload requires TikTok developer app approval and credentials.

## No SQL Required

TikTok links are stored compatibly in post content as a hidden marker for this version. A future database upgrade can add `video_provider`, `video_url`, and `video_id` columns.

