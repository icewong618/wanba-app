-- 乐生活 5.95：会员奖励兑换与撤销审计
-- 非破坏性：保留既有流水，只补充类型、撤销状态及原子兑换接口。

alter table public.merchant_member_transactions
  add column if not exists transaction_kind text not null default 'manual_adjustment',
  add column if not exists reversal_of_id bigint references public.merchant_member_transactions(id),
  add column if not exists revoked_at timestamp with time zone,
  add column if not exists revoked_by uuid references auth.users(id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'merchant_member_transactions_kind_check'
      and conrelid = 'public.merchant_member_transactions'::regclass
  ) then
    alter table public.merchant_member_transactions
      add constraint merchant_member_transactions_kind_check
      check (transaction_kind in (
        'manual_adjustment',
        'stamp_checkin',
        'points_adjustment',
        'reward_redeem',
        'reward_reversal'
      ));
  end if;
end $$;

update public.merchant_member_transactions
set transaction_kind = case
  when note like '撤销奖励兑换%' then 'reward_reversal'
  when note like '奖励兑换%' then 'reward_redeem'
  when source = 'code_checkin' then 'stamp_checkin'
  when action = 'points' then 'points_adjustment'
  else 'manual_adjustment'
end
where transaction_kind = 'manual_adjustment';

create index if not exists merchant_member_transactions_merchant_created_idx
  on public.merchant_member_transactions (merchant_user_id, created_at desc);

create index if not exists merchant_member_transactions_membership_created_idx
  on public.merchant_member_transactions (membership_id, created_at desc);

-- 会员本人不应能修改自己的积分或消费次数，只有所属商家能变更。
drop policy if exists "users and merchants can update memberships" on public.merchant_memberships;
create policy "merchants can update memberships"
on public.merchant_memberships
for update to authenticated
using ((select auth.uid()) = merchant_user_id)
with check ((select auth.uid()) = merchant_user_id);

create or replace function public.redeem_merchant_reward(
  p_membership_id bigint,
  p_quantity integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_membership public.merchant_memberships%rowtype;
  v_target integer;
  v_reward text;
  v_before integer;
  v_deduct integer;
  v_after integer;
  v_transaction_id bigint;
begin
  if v_actor is null then
    raise exception 'not authenticated';
  end if;
  if coalesce(p_quantity, 0) < 1 then
    raise exception 'quantity must be at least 1';
  end if;

  select * into v_membership
  from public.merchant_memberships
  where id = p_membership_id
  for update;

  if not found or v_membership.merchant_user_id <> v_actor then
    raise exception 'not allowed';
  end if;

  select greatest(1, coalesce(loyalty_target, 8)), coalesce(nullif(trim(loyalty_reward), ''), '会员奖励')
  into v_target, v_reward
  from public.merchants
  where user_id = v_actor
  limit 1;

  if v_target is null then
    v_target := 8;
    v_reward := '会员奖励';
  end if;

  v_before := greatest(0, coalesce(v_membership.stamp_count, 0));
  v_deduct := v_target * p_quantity;
  if v_before < v_deduct then
    raise exception 'insufficient stamps';
  end if;
  v_after := v_before - v_deduct;

  update public.merchant_memberships
  set stamp_count = v_after,
      updated_at = timezone('utc', now())
  where id = v_membership.id;

  insert into public.merchant_member_transactions (
    membership_id, merchant_user_id, user_id, action,
    delta, before_value, after_value, source, note, transaction_kind
  ) values (
    v_membership.id, v_actor, v_membership.user_id, 'stamp',
    -v_deduct, v_before, v_after, 'manual',
    format('奖励兑换：%s 份「%s」，每份扣 %s 次', p_quantity, v_reward, v_target),
    'reward_redeem'
  ) returning id into v_transaction_id;

  return jsonb_build_object(
    'membership_id', v_membership.id,
    'transaction_id', v_transaction_id,
    'before_value', v_before,
    'after_value', v_after,
    'quantity', p_quantity,
    'reward', v_reward
  );
end;
$$;

create or replace function public.revert_merchant_reward_redemption(
  p_transaction_id bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_actor uuid := auth.uid();
  v_redemption public.merchant_member_transactions%rowtype;
  v_membership public.merchant_memberships%rowtype;
  v_before integer;
  v_restore integer;
  v_after integer;
  v_reversal_id bigint;
begin
  if v_actor is null then
    raise exception 'not authenticated';
  end if;

  select * into v_redemption
  from public.merchant_member_transactions
  where id = p_transaction_id
  for update;

  if not found or v_redemption.merchant_user_id <> v_actor then
    raise exception 'not allowed';
  end if;
  if v_redemption.transaction_kind <> 'reward_redeem' then
    raise exception 'only reward redemption can be reversed';
  end if;
  if v_redemption.revoked_at is not null then
    raise exception 'redemption already reversed';
  end if;

  v_restore := abs(coalesce(v_redemption.delta, 0));
  if v_restore < 1 then
    raise exception 'invalid redemption amount';
  end if;

  select * into v_membership
  from public.merchant_memberships
  where id = v_redemption.membership_id
    and merchant_user_id = v_actor
  for update;

  if not found then
    raise exception 'membership not found';
  end if;

  v_before := greatest(0, coalesce(v_membership.stamp_count, 0));
  v_after := v_before + v_restore;

  update public.merchant_memberships
  set stamp_count = v_after,
      updated_at = timezone('utc', now())
  where id = v_membership.id;

  update public.merchant_member_transactions
  set revoked_at = timezone('utc', now()),
      revoked_by = v_actor
  where id = v_redemption.id;

  insert into public.merchant_member_transactions (
    membership_id, merchant_user_id, user_id, action,
    delta, before_value, after_value, source, note,
    transaction_kind, reversal_of_id
  ) values (
    v_membership.id, v_actor, v_membership.user_id, 'stamp',
    v_restore, v_before, v_after, 'manual',
    format('撤销奖励兑换：恢复 %s 次消费记录', v_restore),
    'reward_reversal', v_redemption.id
  ) returning id into v_reversal_id;

  return jsonb_build_object(
    'membership_id', v_membership.id,
    'redemption_id', v_redemption.id,
    'reversal_id', v_reversal_id,
    'before_value', v_before,
    'after_value', v_after
  );
end;
$$;

revoke all on function public.redeem_merchant_reward(bigint, integer) from public;
revoke all on function public.revert_merchant_reward_redemption(bigint) from public;
revoke all on function public.redeem_merchant_reward(bigint, integer) from anon;
revoke all on function public.revert_merchant_reward_redemption(bigint) from anon;
revoke all on function public.redeem_merchant_reward(bigint, integer) from authenticated;
revoke all on function public.revert_merchant_reward_redemption(bigint) from authenticated;
grant execute on function public.redeem_merchant_reward(bigint, integer) to authenticated;
grant execute on function public.revert_merchant_reward_redemption(bigint) to authenticated;

analyze public.merchant_member_transactions;
analyze public.merchant_memberships;
