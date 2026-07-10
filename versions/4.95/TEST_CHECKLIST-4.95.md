# v4.95 QA Checklist

## Version

- [ ] Launch screen shows v4.95.
- [ ] Browser console shows `乐生活 当前版本：v4.95`.
- [ ] GitHub Pages deployment succeeds.
- [ ] Daily Price Cache Sync points to `versions/4.95`.

## Merchant AI Final Precheck

- [ ] Merchant AI modal fits on iPhone.
- [ ] Merchant AI modal fits on Android Chrome.
- [ ] Type selection step shows current AI limitation clearly.
- [ ] Material input step warns that prices and factual business data must be confirmed by the merchant.
- [ ] Generate button cannot be repeatedly tapped.
- [ ] Regenerate limit is still 3 times per post.
- [ ] Daily AI usage limit is still 10 times.
- [ ] Old generated versions can still be restored.
- [ ] Publishing creates a home feed post.
- [ ] Published AI post includes `商家发布` in tags.
- [ ] Success page opens the published post.
- [ ] External platform copy still works.

## 5.0 Decision

- [ ] Confirm whether current merchant AI assistant wording is acceptable for public beta.
- [ ] Confirm whether real AI API integration must happen before 5.0.
- [ ] Confirm whether video AI remains disabled for 5.0.
