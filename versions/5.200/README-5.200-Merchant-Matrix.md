# 5.200 Merchant Matrix Accounts

This version lets a normal Scoop City account accept authorization from a verified merchant and enter that merchant's membership verification workspace without sharing a password.

## Roles

- **Owner**: merchant account owner. Can invite and revoke matrix accounts.
- **Operator**: can open the membership workspace, scan member cards, add points or stamps, redeem rewards, and redeem coupons.
- **Clerk**: same first-version verification abilities as Operator. Publishing, products, merchant profile editing, and analytics remain owner-only.

## Setup

Run Supabase-merchant-matrix-5.200.sql once in Supabase SQL Editor before testing.

## Test flow

1. Log into a verified merchant account and open Team & matrix accounts in the merchant menu.
2. Search an existing user by nickname, select a role, and invite.
3. Log into that user account, accept the invitation in My page, and enter the listed merchant workspace.
4. Scan a membership QR code or enter a member number. Complete a stamp, point, reward, or coupon action.
5. Confirm the transaction stores the actual operator. Revoke the team member from the merchant account and refresh the personal account.
