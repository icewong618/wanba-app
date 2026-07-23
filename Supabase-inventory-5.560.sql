-- 乐生活 v5.560：零售商品库存与条码管理

create table if not exists public.merchant_inventory_items (
  id uuid primary key default gen_random_uuid(),
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  barcode text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  low_stock_threshold integer not null default 0 check (low_stock_threshold >= 0),
  last_counted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (merchant_user_id, product_id)
);

create unique index if not exists merchant_inventory_items_barcode_unique
  on public.merchant_inventory_items (merchant_user_id, barcode)
  where barcode is not null and barcode <> '';
create index if not exists merchant_inventory_items_merchant_updated_idx
  on public.merchant_inventory_items (merchant_user_id, updated_at desc);

create table if not exists public.merchant_inventory_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_item_id uuid not null references public.merchant_inventory_items(id) on delete cascade,
  merchant_user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  movement_type text not null check (movement_type in ('receive', 'issue', 'count')),
  quantity_change integer not null,
  quantity_before integer not null,
  quantity_after integer not null check (quantity_after >= 0),
  note text,
  created_at timestamptz not null default now()
);
create index if not exists merchant_inventory_movements_item_created_idx
  on public.merchant_inventory_movements (inventory_item_id, created_at desc);
create index if not exists merchant_inventory_movements_merchant_product_idx
  on public.merchant_inventory_movements (merchant_user_id, product_id, created_at desc);

alter table public.merchant_inventory_items enable row level security;
alter table public.merchant_inventory_movements enable row level security;

drop policy if exists "merchant reads own inventory items" on public.merchant_inventory_items;
create policy "merchant reads own inventory items" on public.merchant_inventory_items
  for select to authenticated using (merchant_user_id = auth.uid());

drop policy if exists "merchant reads own inventory movements" on public.merchant_inventory_movements;
create policy "merchant reads own inventory movements" on public.merchant_inventory_movements
  for select to authenticated using (merchant_user_id = auth.uid());

create or replace function public.merchant_inventory_touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists merchant_inventory_items_touch_updated_at on public.merchant_inventory_items;
create trigger merchant_inventory_items_touch_updated_at
before update on public.merchant_inventory_items
for each row execute function public.merchant_inventory_touch_updated_at();

create or replace function public.merchant_inventory_upsert(
  p_product_id text,
  p_barcode text default null,
  p_stock_quantity integer default 0,
  p_low_stock_threshold integer default 0
)
returns public.merchant_inventory_items
language plpgsql security definer set search_path = public as $$
declare
  v_actor uuid := auth.uid();
  v_merchant public.merchants%rowtype;
  v_item public.merchant_inventory_items%rowtype;
  v_product jsonb;
  v_barcode text := nullif(regexp_replace(coalesce(p_barcode, ''), '\\s+', '', 'g'), '');
  v_before integer := 0;
begin
  if v_actor is null then raise exception 'authentication_required'; end if;
  if coalesce(p_product_id, '') = '' then raise exception 'product_required'; end if;
  if p_stock_quantity < 0 or p_low_stock_threshold < 0 then raise exception 'inventory_quantity_invalid'; end if;

  select * into v_merchant from public.merchants where user_id = v_actor and verified is true limit 1;
  if not found then raise exception 'merchant_access_required'; end if;

  select product into v_product
  from jsonb_array_elements(coalesce(v_merchant.products, '[]'::jsonb)) product
  where product->>'id' = p_product_id and coalesce((product->>'active')::boolean, true)
  limit 1;
  if v_product is null then raise exception 'merchant_product_not_found'; end if;

  select * into v_item from public.merchant_inventory_items
  where merchant_user_id = v_actor and product_id = p_product_id for update;

  if found then
    v_before := v_item.stock_quantity;
    update public.merchant_inventory_items
      set barcode = coalesce(v_barcode, v_item.barcode),
          stock_quantity = p_stock_quantity,
          low_stock_threshold = p_low_stock_threshold,
          last_counted_at = now()
      where id = v_item.id
      returning * into v_item;
  else
    insert into public.merchant_inventory_items
      (merchant_user_id, product_id, barcode, stock_quantity, low_stock_threshold, last_counted_at)
      values (v_actor, p_product_id, v_barcode, p_stock_quantity, p_low_stock_threshold, now())
      returning * into v_item;
  end if;

  insert into public.merchant_inventory_movements
    (inventory_item_id, merchant_user_id, product_id, movement_type, quantity_change, quantity_before, quantity_after, note)
    values (v_item.id, v_actor, p_product_id, 'count', p_stock_quantity - v_before, v_before, p_stock_quantity, '设置库存');
  return v_item;
end;
$$;

create or replace function public.merchant_inventory_adjust(
  p_inventory_item_id uuid,
  p_movement_type text,
  p_quantity integer,
  p_note text default null
)
returns public.merchant_inventory_items
language plpgsql security definer set search_path = public as $$
declare
  v_actor uuid := auth.uid();
  v_item public.merchant_inventory_items%rowtype;
  v_before integer;
  v_after integer;
  v_delta integer;
begin
  if v_actor is null then raise exception 'authentication_required'; end if;
  if p_movement_type not in ('receive', 'issue', 'count') then raise exception 'inventory_movement_invalid'; end if;
  if p_quantity < 0 then raise exception 'inventory_quantity_invalid'; end if;

  select * into v_item from public.merchant_inventory_items
  where id = p_inventory_item_id and merchant_user_id = v_actor for update;
  if not found then raise exception 'inventory_item_not_found'; end if;

  v_before := v_item.stock_quantity;
  if p_movement_type = 'receive' then
    v_after := v_before + p_quantity;
  elsif p_movement_type = 'issue' then
    if p_quantity > v_before then raise exception 'insufficient_stock'; end if;
    v_after := v_before - p_quantity;
  else
    v_after := p_quantity;
  end if;
  v_delta := v_after - v_before;

  update public.merchant_inventory_items
    set stock_quantity = v_after,
        last_counted_at = case when p_movement_type = 'count' then now() else last_counted_at end
    where id = v_item.id
    returning * into v_item;
  insert into public.merchant_inventory_movements
    (inventory_item_id, merchant_user_id, product_id, movement_type, quantity_change, quantity_before, quantity_after, note)
    values (v_item.id, v_actor, v_item.product_id, p_movement_type, v_delta, v_before, v_after, nullif(left(coalesce(p_note, ''), 500), ''));
  return v_item;
end;
$$;

revoke all on function public.merchant_inventory_upsert(text, text, integer, integer) from public, anon;
revoke all on function public.merchant_inventory_adjust(uuid, text, integer, text) from public, anon;
grant execute on function public.merchant_inventory_upsert(text, text, integer, integer) to authenticated;
grant execute on function public.merchant_inventory_adjust(uuid, text, integer, text) to authenticated;
grant select on public.merchant_inventory_items, public.merchant_inventory_movements to authenticated;
