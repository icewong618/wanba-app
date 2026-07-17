-- 乐生活 v5.270：岗位 RPC 仅限已登录员工调用

revoke execute on function public.merchant_matrix_has_permission(uuid,text) from anon;
revoke execute on function public.merchant_matrix_has_role(uuid,text[]) from anon;
revoke execute on function public.merchant_matrix_my_access() from anon;
revoke execute on function public.merchant_matrix_invite_member_v2(uuid,text[],text[]) from anon;
revoke execute on function public.merchant_matrix_update_member_access(bigint,text[],text[]) from anon;
revoke execute on function public.merchant_order_can_manage(uuid) from anon;
revoke execute on function public.merchant_order_set_item_kitchen_done(bigint,boolean) from anon;
revoke execute on function public.merchant_order_set_item_served(bigint,boolean) from anon;
revoke execute on function public.merchant_order_set_status(uuid,text) from anon;
revoke execute on function public.merchant_order_complete_with_bill(uuid,text,numeric,numeric,jsonb) from anon;
revoke execute on function public.redeem_merchant_coupon_claim(bigint) from anon;
