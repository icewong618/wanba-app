# Scoop City v4.97 AI Quality + Mobile Fix

This version improves the merchant AI publishing flow and fixes several mobile/media details.

## Changes

- Merchant AI prompt now follows Xiaohongshu-style content rules.
- 乐生活、小红书、Instagram、Facebook、Google、X temporarily use the same Chinese post.
- Added an English copy version for external use.
- English brand name is standardized as `Scoop City`.
- Publish page text changed from “粘贴小红书文案，自动整理” to “粘贴文案，自动整理”.
- Mobile avatar crop now supports touch drag.
- Transparent PNG avatars are rendered on a white background.
- Removed the post detail image download button.
- YouTube videos autoplay muted when opened in post detail.

## Backend

Supabase Edge Function:

```bash
supabase functions deploy merchant-ai-generate --use-api
```

Required secrets:

```bash
OPENAI_API_KEY
OPENAI_MODEL
```

Current model tested:

```bash
gpt-4o-mini
```

