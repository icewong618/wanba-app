# Leshenghuo v4.96 Real AI Backend Integration

This version changes merchant AI publishing from a local template generator to a real backend AI workflow.

## What Changed

- Frontend no longer generates fake/template AI content locally.
- Merchant AI now calls Supabase Edge Function:
  - `merchant-ai-generate`
- OpenAI API key is kept in Supabase Secrets, not in HTML and not in GitHub.
- Failed AI backend calls do not consume daily AI usage.
- Regeneration count only increases after successful AI generation.
- AI is instructed not to invent prices, inventory, discounts, dates, addresses, rankings, or other factual business data.

## Required Supabase Secrets

Set these in Supabase before using the feature:

```bash
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

Optional:

```bash
supabase secrets set OPENAI_MODEL=gpt-4.1-mini
```

## Deploy Function

From the project root:

```bash
supabase functions deploy merchant-ai-generate
```

## Frontend Endpoint

The frontend calls:

```text
https://ptxdxepmggmjcndgukjk.supabase.co/functions/v1/merchant-ai-generate
```

It sends the current logged-in user token. If the user is not logged in, generation is blocked.

## Database

No new SQL is required for this version.

## Important

If `OPENAI_API_KEY` is not set or the function is not deployed, merchant AI generation will fail clearly and will not show fake generated content.
