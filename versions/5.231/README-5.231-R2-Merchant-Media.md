# v5.231 R2 Merchant Media

- Completes the one-time migration for merchant products, coupons, order snapshots, and member avatar snapshots.
- Sends new product and coupon images to Cloudflare R2 when the merchant saves them.
- Prevents new Base64 media from being stored in Supabase database records.
