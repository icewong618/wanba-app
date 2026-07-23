-- 乐生活 v5.584：零售订单写入商家协议版本，形成可追溯交易记录。

create or replace function public.marketplace_retail_order_attach_terms()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_terms public.merchant_platform_agreements%rowtype;
begin
  select * into v_terms
  from public.merchant_platform_agreements
  where merchant_user_id=new.merchant_user_id and agreement_key='marketplace_terms'
  order by accepted_at desc
  limit 1;
  if found then
    new.marketplace_terms_version := v_terms.agreement_version;
    new.marketplace_terms_accepted_at := v_terms.accepted_at;
  end if;
  return new;
end;
$$;

drop trigger if exists marketplace_retail_order_attach_terms on public.merchant_retail_orders;
create trigger marketplace_retail_order_attach_terms
before insert on public.merchant_retail_orders
for each row execute function public.marketplace_retail_order_attach_terms();

revoke all on function public.marketplace_retail_order_attach_terms() from public, anon, authenticated;
