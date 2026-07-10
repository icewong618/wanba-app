# v4.96 QA Checklist

## Version

- [ ] Launch screen shows v4.96.
- [ ] Browser console shows `乐生活 当前版本：v4.96`.
- [ ] GitHub Pages deployment succeeds.
- [ ] Daily Price Cache Sync points to `versions/4.96`.

## Supabase Edge Function

- [ ] `OPENAI_API_KEY` is set in Supabase Secrets.
- [ ] `merchant-ai-generate` function is deployed.
- [ ] Function does not expose OpenAI key in browser code.
- [ ] Function returns structured platform content.

## Merchant AI

- [ ] Merchant can open AI publishing flow.
- [ ] Generation fails clearly if function is missing or key is missing.
- [ ] Failed generation does not consume daily AI usage.
- [ ] Successful generation consumes 1 daily use.
- [ ] Successful regeneration increases per-post regeneration count.
- [ ] AI output includes 乐生活, 小红书, Instagram, Facebook, Google, and X versions.
- [ ] AI output does not invent prices, inventory, discounts, dates, addresses, or claims.
- [ ] Publish to 乐生活 still creates a home feed post.
- [ ] External platform copy still works.
