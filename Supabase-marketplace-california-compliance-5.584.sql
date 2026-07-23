-- 乐生活 v5.584：加州合规规则层
-- 说明：这是平台发布规则，不替代律师意见。明确违法或高风险的内容会阻止发布；
-- 需要许可证、年龄核验或业务条件判断的内容进入人工合规审核，审核前不公开。

alter table public.marketplace_listing_controls
  drop constraint if exists marketplace_listing_controls_status_check;
alter table public.marketplace_listing_controls
  add constraint marketplace_listing_controls_status_check
  check (status in ('active','review','frozen','removed'));

create table if not exists public.marketplace_compliance_rules (
  id uuid primary key default gen_random_uuid(),
  jurisdiction_code text not null default 'US-CA',
  rule_key text not null,
  action text not null check (action in ('block','review')),
  title_zh text not null,
  keywords text[] not null default '{}',
  active boolean not null default true,
  legal_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (jurisdiction_code, rule_key)
);

alter table public.marketplace_compliance_rules enable row level security;
revoke all on public.marketplace_compliance_rules from anon, authenticated;

insert into public.marketplace_compliance_rules(jurisdiction_code,rule_key,action,title_zh,keywords,legal_note)
values
  ('US-CA','illicit_controlled_substances','block','违法受管制物质',array['可卡因','海洛因','芬太尼','冰毒','迷幻药','cocaine','heroin','fentanyl','methamphetamine','illegal drug'],'不得发布违法受管制物质或相关交易信息。'),
  ('US-CA','counterfeit_or_stolen','block','假冒、盗版或疑似赃物',array['假货','高仿','复刻','盗版','仿冒','赃物','偷来','盗窃','counterfeit','replica','knockoff','pirated','stolen goods'],'不得发布假冒、盗版或疑似赃物。'),
  ('US-CA','adult_exploitation','block','成人服务或剥削性内容',array['成人服务','裸照','色情服务','escort','pornographic','adult service'],'不得发布成人服务或剥削性内容。'),
  ('US-CA','weapons_and_ammunition','review','武器、弹药及相关配件',array['枪支','手枪','步枪','猎枪','霰弹枪','弹药','子弹','消音器','firearm','handgun','rifle','shotgun','ammunition','bullet','suppressor'],'该类交易可能涉及联邦、加州及地方许可、背景审查或持牌交易要求。'),
  ('US-CA','regulated_cannabis_tobacco_alcohol','review','酒类、烟草、电子烟或大麻相关商品',array['大麻','cannabis','marijuana','烟草','烟弹','电子烟','vape','nicotine','酒类','白酒','啤酒','wine','alcohol'],'该类商品可能需要年龄核验、执照和地区限制。'),
  ('US-CA','prescription_medical','review','处方药、医疗器械或受监管健康商品',array['处方药','prescription drug','处方','医疗器械','medical device','注射剂','injectable'],'该类商品可能需要处方、许可或专业资质。'),
  ('US-CA','animals_food_safety','review','活体动物、食品或易腐商品',array['活体动物','宠物出售','生鲜','自制食品','raw meat','live animal','food delivery'],'该类商品可能涉及检疫、食品安全和地方经营许可。'),
  ('US-CA','financial_legal_services','review','金融、保险、法律或移民服务',array['贷款','投资回报','保险代办','法律服务','移民代办','loan guarantee','investment return','legal service'],'该类服务可能涉及牌照、广告与消费者保护规则。')
on conflict(jurisdiction_code,rule_key) do update
set action=excluded.action,title_zh=excluded.title_zh,keywords=excluded.keywords,legal_note=excluded.legal_note,active=true,updated_at=now();

create or replace function public.marketplace_listing_compliance(p_text text, p_jurisdiction text default 'US-CA')
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  v_text text := lower(coalesce(p_text,''));
  v_rule public.marketplace_compliance_rules%rowtype;
  v_keyword text;
begin
  for v_rule in
    select * from public.marketplace_compliance_rules
    where jurisdiction_code=upper(trim(coalesce(p_jurisdiction,'US-CA'))) and active=true
    order by case action when 'block' then 1 else 2 end, rule_key
  loop
    foreach v_keyword in array v_rule.keywords loop
      if position(lower(v_keyword) in v_text) > 0 then
        return jsonb_build_object('action',v_rule.action,'rule_key',v_rule.rule_key,'title_zh',v_rule.title_zh,'legal_note',v_rule.legal_note);
      end if;
    end loop;
  end loop;
  return jsonb_build_object('action','allow');
end;
$$;

create or replace function public.marketplace_listing_violation(p_text text)
returns text
language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  v := public.marketplace_listing_compliance(p_text,'US-CA');
  if v->>'action'='block' then return v->>'rule_key'; end if;
  return null;
end;
$$;

create or replace function public.marketplace_listing_review_reason(p_text text)
returns text
language plpgsql stable security definer set search_path = public as $$
declare v jsonb;
begin
  v := public.marketplace_listing_compliance(p_text,'US-CA');
  if v->>'action'='review' then return v->>'rule_key'; end if;
  return null;
end;
$$;

create or replace function public.marketplace_guard_personal_listing()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_reason text; v_review text;
begin
  v_reason := public.marketplace_listing_violation(concat_ws(' ', new.title, new.description, new.category));
  if v_reason is not null then raise exception 'listing_restricted:%', v_reason using errcode = '22023'; end if;
  v_review := public.marketplace_listing_review_reason(concat_ws(' ', new.title, new.description, new.category));
  if v_review is not null then
    insert into public.marketplace_listing_controls(owner_user_id,source_type,source_id,status,reason_code,moderator_note)
    values(new.shop_user_id,'personal_shop_product',new.id::text,'review',v_review,'需要加州地区合规审核；审核前不会公开展示。')
    on conflict(owner_user_id,source_type,source_id) do update
      set status=case when public.marketplace_listing_controls.status='active' then 'review' else public.marketplace_listing_controls.status end,
          reason_code=excluded.reason_code,updated_at=now();
  end if;
  return new;
end;
$$;

create or replace function public.marketplace_guard_merchant_products()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_item jsonb; v_reason text; v_review text; v_id text;
begin
  for v_item in select value from jsonb_array_elements(coalesce(new.products, '[]'::jsonb)) loop
    v_reason := public.marketplace_listing_violation(concat_ws(' ', v_item->>'name', v_item->>'title', v_item->>'description', v_item->>'category', v_item->>'categories'));
    if v_reason is not null then raise exception 'listing_restricted:%', v_reason using errcode = '22023'; end if;
    v_review := public.marketplace_listing_review_reason(concat_ws(' ', v_item->>'name', v_item->>'title', v_item->>'description', v_item->>'category', v_item->>'categories'));
    v_id := nullif(trim(coalesce(v_item->>'id','')),'');
    if v_review is not null and v_id is not null then
      insert into public.marketplace_listing_controls(owner_user_id,source_type,source_id,status,reason_code,moderator_note)
      values(new.user_id,'merchant_product',v_id,'review',v_review,'需要加州地区合规审核；审核前不会公开展示。')
      on conflict(owner_user_id,source_type,source_id) do update
        set status=case when public.marketplace_listing_controls.status='active' then 'review' else public.marketplace_listing_controls.status end,
            reason_code=excluded.reason_code,updated_at=now();
    end if;
  end loop;
  return new;
end;
$$;

create or replace function public.marketplace_public_listing_controls(p_owner_user_id uuid, p_source_type text)
returns table(source_id text, status text)
language sql stable security definer set search_path = public as $$
  select source_id, status
  from public.marketplace_listing_controls
  where owner_user_id = p_owner_user_id
    and source_type = p_source_type
    and status in ('review','frozen','removed');
$$;

create or replace function public.marketplace_moderate_listing(
  p_owner_user_id uuid,
  p_source_type text,
  p_source_id text,
  p_status text,
  p_reason_code text default null,
  p_note text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_control public.marketplace_listing_controls%rowtype;
begin
  if not exists(select 1 from public.deal_admins where user_id=auth.uid()) then raise exception 'admin_required'; end if;
  if p_source_type not in ('personal_shop_product','merchant_product') or p_status not in ('active','review','frozen','removed') then raise exception 'invalid_listing_moderation'; end if;
  insert into public.marketplace_listing_controls(owner_user_id,source_type,source_id,status,reason_code,moderator_note,reviewed_by,reviewed_at)
  values(p_owner_user_id,p_source_type,trim(p_source_id),p_status,nullif(trim(coalesce(p_reason_code,'')),''),nullif(trim(coalesce(p_note,'')),''),auth.uid(),now())
  on conflict(owner_user_id,source_type,source_id) do update set status=excluded.status,reason_code=excluded.reason_code,moderator_note=excluded.moderator_note,reviewed_by=excluded.reviewed_by,reviewed_at=excluded.reviewed_at,updated_at=now()
  returning * into v_control;
  update public.marketplace_listing_reports
  set status=case when p_status='active' then 'dismissed' when p_status='review' then 'reviewing' else 'resolved' end,handled_by=auth.uid(),handled_at=now()
  where owner_user_id=p_owner_user_id and source_type=p_source_type and source_id=trim(p_source_id) and status in ('pending','reviewing');
  return to_jsonb(v_control);
end;
$$;

create or replace function public.marketplace_admin_listing_reports(p_limit integer default 120)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists(select 1 from public.deal_admins where user_id=auth.uid()) then raise exception 'admin_required'; end if;
  return coalesce((
    select jsonb_agg(to_jsonb(x) order by x.created_at desc)
    from (
      select r.*, c.status as listing_status, c.reason_code, c.moderator_note
      from public.marketplace_listing_reports r
      left join public.marketplace_listing_controls c
        on c.owner_user_id=r.owner_user_id and c.source_type=r.source_type and c.source_id=r.source_id
      order by r.created_at desc
      limit greatest(1,least(coalesce(p_limit,120),300))
    ) x
  ),'[]'::jsonb);
end;
$$;

create or replace function public.marketplace_merchant_listing_controls()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(to_jsonb(c) order by c.updated_at desc),'[]'::jsonb)
  from public.marketplace_listing_controls c
  where c.owner_user_id=auth.uid()
    and c.source_type='merchant_product'
    and c.status in ('review','frozen','removed');
$$;

revoke all on function public.marketplace_listing_compliance(text,text) from public;
revoke all on function public.marketplace_listing_violation(text) from public;
revoke all on function public.marketplace_listing_review_reason(text) from public;
revoke all on function public.marketplace_guard_personal_listing() from public, anon, authenticated;
revoke all on function public.marketplace_guard_merchant_products() from public, anon, authenticated;
revoke all on function public.marketplace_order_event_from_retail() from public, anon, authenticated;
revoke all on function public.marketplace_admin_listing_reports(integer) from public,anon;
revoke all on function public.marketplace_merchant_listing_controls() from public,anon;
grant execute on function public.marketplace_admin_listing_reports(integer) to authenticated;
grant execute on function public.marketplace_merchant_listing_controls() to authenticated;

create or replace function public.personal_shop_public_snapshot(p_market text, p_slug text)
returns jsonb language sql stable security definer set search_path=public as $$
  select jsonb_build_object(
    'shop', (select to_jsonb(s) from public.personal_shops s where s.market_code=lower(trim(p_market)) and s.slug=lower(trim(p_slug)) and s.status='active'),
    'products', coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc) from public.personal_shop_products p join public.personal_shops s on s.user_id=p.shop_user_id where s.market_code=lower(trim(p_market)) and s.slug=lower(trim(p_slug)) and s.status='active' and p.status='active' and not exists(select 1 from public.marketplace_listing_controls c where c.owner_user_id=p.shop_user_id and c.source_type='personal_shop_product' and c.source_id=p.id::text and c.status in ('review','frozen','removed'))),'[]'::jsonb)
  );
$$;

grant execute on function public.personal_shop_public_snapshot(text,text) to anon, authenticated;
