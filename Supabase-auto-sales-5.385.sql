-- 乐生活 5.385：二手车买卖第一版
-- 运行后：交通出行 / 车辆销售类商家可开通「二手车买卖」，建立销售库存并接收卖车估价、试驾咨询线索。

create table if not exists public.merchant_auto_listings (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  make text,
  model text,
  year integer check (year between 1900 and 2100),
  price numeric(12,2) not null default 0 check (price >= 0),
  mileage integer check (mileage >= 0),
  vehicle_type text not null default '轿车',
  fuel_type text not null default '汽油',
  transmission text not null default '自动挡',
  drivetrain text,
  exterior_color text,
  interior_color text,
  vin text,
  condition_note text,
  features jsonb not null default '[]'::jsonb check (jsonb_typeof(features) = 'array'),
  photos jsonb not null default '[]'::jsonb check (jsonb_typeof(photos) = 'array'),
  description text,
  status text not null default 'available' check (status in ('available','reserved','sold','hidden')),
  is_certified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists merchant_auto_listings_public_idx
  on public.merchant_auto_listings (merchant_user_id, status, updated_at desc);

create table if not exists public.merchant_auto_leads (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid references public.merchant_auto_listings(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  lead_type text not null check (lead_type in ('test_drive','buy_inquiry','sell_quote')),
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  customer_phone text not null check (char_length(customer_phone) between 4 and 40),
  customer_email text,
  message text,
  vehicle_data jsonb not null default '{}'::jsonb check (jsonb_typeof(vehicle_data) = 'object'),
  photos jsonb not null default '[]'::jsonb check (jsonb_typeof(photos) = 'array'),
  preferred_at timestamptz,
  status text not null default 'new' check (status in ('new','contacted','scheduled','quoted','closed','archived')),
  merchant_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists merchant_auto_leads_manager_idx
  on public.merchant_auto_leads (merchant_user_id, status, created_at desc);
create index if not exists merchant_auto_leads_user_idx
  on public.merchant_auto_leads (user_id, created_at desc);

create or replace function public.merchant_auto_can_manage(p_merchant_user_id uuid)
returns boolean language sql stable security definer set search_path=public,pg_temp as $$
  select auth.uid() = p_merchant_user_id
    or exists (
      select 1 from public.merchant_team_members member
      where member.merchant_user_id = p_merchant_user_id
        and member.member_user_id = auth.uid()
        and member.status = 'active'
        and (
          coalesce(member.role,'') = 'operator'
          or 'manager' = any(coalesce(member.roles,array[]::text[]))
          or 'order_manage' = any(coalesce(member.permissions,array[]::text[]))
        )
    );
$$;
revoke all on function public.merchant_auto_can_manage(uuid) from public;
grant execute on function public.merchant_auto_can_manage(uuid) to authenticated;

alter table public.merchant_auto_listings enable row level security;
alter table public.merchant_auto_leads enable row level security;

drop policy if exists "auto listings public read 5.385" on public.merchant_auto_listings;
create policy "auto listings public read 5.385" on public.merchant_auto_listings
  for select to anon, authenticated using (status = 'available');
drop policy if exists "auto listings merchant manage 5.385" on public.merchant_auto_listings;
create policy "auto listings merchant manage 5.385" on public.merchant_auto_listings
  for all to authenticated using (public.merchant_auto_can_manage(merchant_user_id))
  with check (public.merchant_auto_can_manage(merchant_user_id));
drop policy if exists "auto leads customer read 5.385" on public.merchant_auto_leads;
create policy "auto leads customer read 5.385" on public.merchant_auto_leads
  for select to authenticated using (user_id = (select auth.uid()) or public.merchant_auto_can_manage(merchant_user_id));

create or replace function public.merchant_auto_public_catalog(p_slug text)
returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  select jsonb_build_object(
    'merchant', jsonb_build_object(
      'user_id',m.user_id,'business_name',m.business_name,'logo',m.logo,
      'cover_image',m.cover_image,'address',m.address,'phone',m.phone,'slug',m.slug
    ),
    'listings',coalesce((
      select jsonb_agg(jsonb_build_object(
        'id',a.id,'title',a.title,'make',a.make,'model',a.model,'year',a.year,'price',a.price,
        'mileage',a.mileage,'vehicle_type',a.vehicle_type,'fuel_type',a.fuel_type,'transmission',a.transmission,
        'drivetrain',a.drivetrain,'exterior_color',a.exterior_color,'interior_color',a.interior_color,
        'vin_last6',case when coalesce(a.vin,'')='' then null else right(a.vin,6) end,
        'condition_note',a.condition_note,'features',a.features,'photos',a.photos,'description',a.description,
        'is_certified',a.is_certified,'updated_at',a.updated_at
      ) order by a.updated_at desc)
      from public.merchant_auto_listings a where a.merchant_user_id=m.user_id and a.status='available'
    ),'[]'::jsonb)
  ) from public.merchants m where lower(m.slug)=lower(trim(p_slug)) limit 1;
$$;

create or replace function public.merchant_auto_manager_list(p_merchant_user_id uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if not public.merchant_auto_can_manage(p_merchant_user_id) then raise exception 'merchant_permission_denied'; end if;
  return jsonb_build_object(
    'listings',coalesce((select jsonb_agg(to_jsonb(a) order by a.updated_at desc) from public.merchant_auto_listings a where a.merchant_user_id=p_merchant_user_id),'[]'::jsonb),
    'leads',coalesce((select jsonb_agg(to_jsonb(l) order by case l.status when 'new' then 0 when 'contacted' then 1 else 2 end,l.created_at desc) from public.merchant_auto_leads l where l.merchant_user_id=p_merchant_user_id),'[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_auto_save_listing(p_merchant_user_id uuid,p_listing jsonb)
returns public.merchant_auto_listings language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_auto_listings%rowtype; listing_id uuid:=nullif(p_listing->>'id','')::uuid;
begin
  if not public.merchant_auto_can_manage(p_merchant_user_id) then raise exception 'merchant_permission_denied'; end if;
  if char_length(trim(coalesce(p_listing->>'title','')))<1 then raise exception 'listing_title_required'; end if;
  if listing_id is not null then
    select * into row from public.merchant_auto_listings where id=listing_id and merchant_user_id=p_merchant_user_id for update;
    if not found then raise exception 'listing_not_found'; end if;
    update public.merchant_auto_listings set
      title=left(trim(p_listing->>'title'),100),make=nullif(left(trim(coalesce(p_listing->>'make','')),50),''),model=nullif(left(trim(coalesce(p_listing->>'model','')),50),''),
      year=nullif(p_listing->>'year','')::integer,price=greatest(0,coalesce((p_listing->>'price')::numeric,0)),mileage=nullif(p_listing->>'mileage','')::integer,
      vehicle_type=coalesce(nullif(p_listing->>'vehicle_type',''),'轿车'),fuel_type=coalesce(nullif(p_listing->>'fuel_type',''),'汽油'),transmission=coalesce(nullif(p_listing->>'transmission',''),'自动挡'),
      drivetrain=nullif(left(trim(coalesce(p_listing->>'drivetrain','')),40),''),exterior_color=nullif(left(trim(coalesce(p_listing->>'exterior_color','')),40),''),interior_color=nullif(left(trim(coalesce(p_listing->>'interior_color','')),40),''),
      vin=nullif(left(trim(coalesce(p_listing->>'vin','')),80),''),condition_note=nullif(left(trim(coalesce(p_listing->>'condition_note','')),300),''),features=coalesce(p_listing->'features','[]'::jsonb),photos=coalesce(p_listing->'photos','[]'::jsonb),description=nullif(left(trim(coalesce(p_listing->>'description','')),3000),''),status=coalesce(nullif(p_listing->>'status',''),'available'),is_certified=coalesce((p_listing->>'is_certified')::boolean,false),updated_at=now()
    where id=row.id returning * into row;
  else
    insert into public.merchant_auto_listings(merchant_user_id,title,make,model,year,price,mileage,vehicle_type,fuel_type,transmission,drivetrain,exterior_color,interior_color,vin,condition_note,features,photos,description,status,is_certified)
    values(p_merchant_user_id,left(trim(p_listing->>'title'),100),nullif(left(trim(coalesce(p_listing->>'make','')),50),''),nullif(left(trim(coalesce(p_listing->>'model','')),50),''),nullif(p_listing->>'year','')::integer,greatest(0,coalesce((p_listing->>'price')::numeric,0)),nullif(p_listing->>'mileage','')::integer,coalesce(nullif(p_listing->>'vehicle_type',''),'轿车'),coalesce(nullif(p_listing->>'fuel_type',''),'汽油'),coalesce(nullif(p_listing->>'transmission',''),'自动挡'),nullif(left(trim(coalesce(p_listing->>'drivetrain','')),40),''),nullif(left(trim(coalesce(p_listing->>'exterior_color','')),40),''),nullif(left(trim(coalesce(p_listing->>'interior_color','')),40),''),nullif(left(trim(coalesce(p_listing->>'vin','')),80),''),nullif(left(trim(coalesce(p_listing->>'condition_note','')),300),''),coalesce(p_listing->'features','[]'::jsonb),coalesce(p_listing->'photos','[]'::jsonb),nullif(left(trim(coalesce(p_listing->>'description','')),3000),''),coalesce(nullif(p_listing->>'status',''),'available'),coalesce((p_listing->>'is_certified')::boolean,false)) returning * into row;
  end if;
  return row;
end;
$$;

create or replace function public.merchant_auto_create_lead(p_merchant_user_id uuid,p_listing_id uuid,p_lead_type text,p_customer_name text,p_customer_phone text,p_customer_email text,p_message text,p_vehicle_data jsonb default '{}'::jsonb,p_photos jsonb default '[]'::jsonb,p_preferred_at timestamptz default null)
returns public.merchant_auto_leads language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_auto_leads%rowtype;
begin
  if auth.uid() is null then raise exception 'login_required'; end if;
  if p_lead_type not in ('test_drive','buy_inquiry','sell_quote') then raise exception 'invalid_lead_type'; end if;
  if char_length(trim(coalesce(p_customer_name,'')))<1 or char_length(trim(coalesce(p_customer_phone,'')))<4 then raise exception 'customer_contact_required'; end if;
  if p_listing_id is not null and not exists(select 1 from public.merchant_auto_listings where id=p_listing_id and merchant_user_id=p_merchant_user_id and status='available') then raise exception 'listing_not_available'; end if;
  insert into public.merchant_auto_leads(merchant_user_id,listing_id,user_id,lead_type,customer_name,customer_phone,customer_email,message,vehicle_data,photos,preferred_at)
  values(p_merchant_user_id,p_listing_id,auth.uid(),p_lead_type,left(trim(p_customer_name),80),left(trim(p_customer_phone),40),nullif(left(trim(coalesce(p_customer_email,'')),120),''),nullif(left(trim(coalesce(p_message,'')),1500),''),coalesce(p_vehicle_data,'{}'::jsonb),coalesce(p_photos,'[]'::jsonb),p_preferred_at)
  returning * into row;
  return row;
end;
$$;

create or replace function public.merchant_auto_update_lead(p_lead_id uuid,p_status text,p_merchant_note text)
returns public.merchant_auto_leads language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.merchant_auto_leads%rowtype;
begin
  select * into row from public.merchant_auto_leads where id=p_lead_id for update;
  if not found or not public.merchant_auto_can_manage(row.merchant_user_id) then raise exception 'lead_permission_denied'; end if;
  update public.merchant_auto_leads set status=coalesce(nullif(p_status,''),status),merchant_note=nullif(left(trim(coalesce(p_merchant_note,'')),1500),''),updated_at=now() where id=row.id returning * into row;
  return row;
end;
$$;

revoke all on function public.merchant_auto_public_catalog(text) from public;
grant execute on function public.merchant_auto_public_catalog(text) to anon, authenticated;
revoke all on function public.merchant_auto_manager_list(uuid) from public;
grant execute on function public.merchant_auto_manager_list(uuid) to authenticated;
revoke all on function public.merchant_auto_save_listing(uuid,jsonb) from public;
grant execute on function public.merchant_auto_save_listing(uuid,jsonb) to authenticated;
revoke all on function public.merchant_auto_create_lead(uuid,uuid,text,text,text,text,text,jsonb,jsonb,timestamptz) from public;
grant execute on function public.merchant_auto_create_lead(uuid,uuid,text,text,text,text,text,jsonb,jsonb,timestamptz) to authenticated;
revoke all on function public.merchant_auto_update_lead(uuid,text,text) from public;
grant execute on function public.merchant_auto_update_lead(uuid,text,text) to authenticated;
