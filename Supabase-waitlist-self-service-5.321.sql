-- 乐生活 v5.321：顾客可凭本机保存的管理令牌取消排队或更改人数。

create or replace function public.merchant_waitlist_manage_context(p_waitlist_id uuid, p_manage_token uuid)
returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare v_wait public.merchant_waitlists%rowtype;
begin
  select * into v_wait from public.merchant_waitlists where id=p_waitlist_id and manage_token=p_manage_token;
  if not found then raise exception 'waitlist_not_found'; end if;
  return jsonb_build_object('id',v_wait.id,'queue_code',v_wait.queue_code,'manage_token',v_wait.manage_token,'customer_name',v_wait.customer_name,'customer_phone',v_wait.customer_phone,'party_size',v_wait.party_size,'queue_number',v_wait.queue_number,'estimated_wait_minutes',v_wait.estimated_wait_minutes,'status',v_wait.status,'preorder_items',v_wait.preorder_items);
end;
$$;

create or replace function public.merchant_waitlist_update_party(
  p_waitlist_id uuid, p_manage_token uuid, p_customer_name text, p_customer_phone text, p_party_size integer
)
returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare v_wait public.merchant_waitlists%rowtype; v_ahead integer; v_wait_minutes integer;
begin
  if coalesce(trim(p_customer_name),'')='' then raise exception 'waitlist_name_required'; end if;
  if coalesce(trim(p_customer_phone),'')='' then raise exception 'waitlist_phone_required'; end if;
  if coalesce(p_party_size,0) not between 1 and 20 then raise exception 'waitlist_party_size_invalid'; end if;
  select * into v_wait from public.merchant_waitlists where id=p_waitlist_id and manage_token=p_manage_token for update;
  if not found or v_wait.status<>'queued' then raise exception 'waitlist_not_editable'; end if;
  select count(*) into v_ahead from public.merchant_waitlists where merchant_user_id=v_wait.merchant_user_id and queue_date=v_wait.queue_date and status='queued' and queue_number<v_wait.queue_number;
  v_wait_minutes:=v_ahead*10 + case when p_party_size>v_wait.party_size then 10 else 0 end;
  update public.merchant_waitlists set customer_name=left(trim(p_customer_name),40),customer_phone=left(trim(p_customer_phone),32),party_size=p_party_size,estimated_wait_minutes=v_wait_minutes,updated_at=now() where id=v_wait.id returning * into v_wait;
  return jsonb_build_object('id',v_wait.id,'queue_code',v_wait.queue_code,'manage_token',v_wait.manage_token,'customer_name',v_wait.customer_name,'customer_phone',v_wait.customer_phone,'party_size',v_wait.party_size,'queue_number',v_wait.queue_number,'people_ahead',v_ahead,'estimated_wait_minutes',v_wait.estimated_wait_minutes,'status',v_wait.status,'preorder_items',v_wait.preorder_items);
end;
$$;

create or replace function public.merchant_waitlist_cancel(p_waitlist_id uuid, p_manage_token uuid)
returns jsonb
language plpgsql security definer set search_path = public, auth as $$
declare v_wait public.merchant_waitlists%rowtype;
begin
  select * into v_wait from public.merchant_waitlists where id=p_waitlist_id and manage_token=p_manage_token for update;
  if not found or v_wait.status<>'queued' then raise exception 'waitlist_not_cancellable'; end if;
  update public.merchant_waitlists set status='cancelled',updated_at=now() where id=v_wait.id;
  return jsonb_build_object('id',v_wait.id,'status','cancelled');
end;
$$;

revoke all on function public.merchant_waitlist_manage_context(uuid,uuid) from public, anon, authenticated;
revoke all on function public.merchant_waitlist_update_party(uuid,uuid,text,text,integer) from public, anon, authenticated;
revoke all on function public.merchant_waitlist_cancel(uuid,uuid) from public, anon, authenticated;
grant execute on function public.merchant_waitlist_manage_context(uuid,uuid) to anon, authenticated;
grant execute on function public.merchant_waitlist_update_party(uuid,uuid,text,text,integer) to anon, authenticated;
grant execute on function public.merchant_waitlist_cancel(uuid,uuid) to anon, authenticated;
