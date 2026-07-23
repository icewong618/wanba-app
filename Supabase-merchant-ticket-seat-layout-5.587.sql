-- 乐生活 v5.587：票务座位区删除、单座删除、排号方向与过道布局。
alter table public.merchant_ticket_sections
  add column if not exists row_direction text not null default 'forward',
  add column if not exists seat_layout text not null default 'single',
  add column if not exists seat_blocks jsonb not null default '[1]'::jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname='merchant_ticket_sections_row_direction_check') then
    alter table public.merchant_ticket_sections add constraint merchant_ticket_sections_row_direction_check check (row_direction in ('forward','reverse'));
  end if;
  if not exists (select 1 from pg_constraint where conname='merchant_ticket_sections_seat_layout_check') then
    alter table public.merchant_ticket_sections add constraint merchant_ticket_sections_seat_layout_check check (seat_layout in ('single','left_right','left_center_right','custom'));
  end if;
  if not exists (select 1 from pg_constraint where conname='merchant_ticket_sections_seat_blocks_check') then
    alter table public.merchant_ticket_sections add constraint merchant_ticket_sections_seat_blocks_check check (jsonb_typeof(seat_blocks)='array');
  end if;
end;
$$;

update public.merchant_ticket_sections
set seat_blocks=jsonb_build_array(seats_per_row)
where seat_blocks='[1]'::jsonb and seats_per_row<>1;

create or replace function public.merchant_ticket_public_event_seats(p_event_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare e public.merchant_ticket_events%rowtype;
begin
  select * into e from public.merchant_ticket_events where id=p_event_id and status='published' and ends_at>=now();
  if not found then return null; end if;
  return jsonb_build_object(
    'event_id',e.id,'seating_mode',e.seating_mode,'seat_map_image',e.seat_map_image,
    'sections',coalesce((select jsonb_agg(jsonb_build_object(
      'id',s.id,'name',s.name,'color',s.color,'price',s.price,'rows_count',s.rows_count,'seats_per_row',s.seats_per_row,
      'row_direction',s.row_direction,'seat_layout',s.seat_layout,'seat_blocks',s.seat_blocks,'sort_order',s.sort_order,
      'seats',coalesce((select jsonb_agg(jsonb_build_object(
        'id',x.id,'row_label',x.row_label,'seat_number',x.seat_number,'label',x.label,
        'price',coalesce(x.price_override,s.price),'status',case when x.status='held' and x.hold_expires_at<=now() then 'available' else x.status end
      ) order by x.row_label,x.seat_number) from public.merchant_ticket_seats x where x.section_id=s.id),'[]'::jsonb)
    ) order by s.sort_order,s.created_at) from public.merchant_ticket_sections s where s.event_id=e.id and s.is_active=true),'[]'::jsonb)
  );
end;
$$;

create or replace function public.merchant_ticket_save_section(p_merchant_user_id uuid,p_section jsonb)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare
  v_id uuid:=nullif(p_section->>'id','');
  r public.merchant_ticket_sections%rowtype;
  e public.merchant_ticket_events%rowtype;
  i integer;
  j integer;
  row_name text;
  v_direction text:=coalesce(nullif(p_section->>'row_direction',''),'forward');
  v_layout text:=coalesce(nullif(p_section->>'seat_layout',''),'single');
  v_blocks jsonb:=coalesce(p_section->'seat_blocks',jsonb_build_array(coalesce((p_section->>'seats_per_row')::integer,1)));
  v_block_count integer;
  v_block_valid integer;
  v_block_total integer;
  v_rows integer:=coalesce((p_section->>'rows_count')::integer,1);
  v_cols integer:=coalesce((p_section->>'seats_per_row')::integer,1);
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  if coalesce(trim(p_section->>'name'),'')='' then raise exception 'section_name_required'; end if;
  if v_direction not in ('forward','reverse') then raise exception 'invalid_row_direction'; end if;
  if v_layout not in ('single','left_right','left_center_right','custom') then raise exception 'invalid_seat_layout'; end if;
  if jsonb_typeof(v_blocks)<>'array' or jsonb_array_length(v_blocks)<1 then raise exception 'invalid_seat_blocks'; end if;
  select count(*),count(*) filter(where value~'^[1-9][0-9]*$'),coalesce(sum(case when value~'^[1-9][0-9]*$' then value::integer else 0 end),0)
    into v_block_count,v_block_valid,v_block_total from jsonb_array_elements_text(v_blocks) as block(value);
  if v_block_count<>v_block_valid or v_block_total<>v_cols then raise exception 'invalid_seat_blocks'; end if;
  select * into e from public.merchant_ticket_events where id=(p_section->>'event_id')::uuid and merchant_user_id=p_merchant_user_id for update;
  if not found or e.seating_mode<>'assigned' then raise exception 'assigned_seating_required'; end if;
  if v_id is null then
    insert into public.merchant_ticket_sections(event_id,merchant_user_id,name,color,price,rows_count,seats_per_row,row_direction,seat_layout,seat_blocks,sort_order,is_active)
    values(e.id,p_merchant_user_id,trim(p_section->>'name'),coalesce(nullif(p_section->>'color',''),'#568566'),coalesce((p_section->>'price')::numeric,0),v_rows,v_cols,v_direction,v_layout,v_blocks,coalesce((p_section->>'sort_order')::int,0),coalesce((p_section->>'is_active')::boolean,true)) returning * into r;
    for i in 1..r.rows_count loop
      row_name:=chr(64+i);
      for j in 1..r.seats_per_row loop
        insert into public.merchant_ticket_seats(event_id,section_id,merchant_user_id,row_label,seat_number,label)
        values(e.id,r.id,p_merchant_user_id,row_name,j,row_name||j);
      end loop;
    end loop;
  else
    if exists(select 1 from public.merchant_ticket_seats where section_id=v_id and status in ('sold','held')) then raise exception 'section_has_reserved_seats'; end if;
    update public.merchant_ticket_sections
      set name=trim(p_section->>'name'),color=coalesce(nullif(p_section->>'color',''),'#568566'),price=coalesce((p_section->>'price')::numeric,0),
          row_direction=v_direction,seat_layout=v_layout,seat_blocks=v_blocks,sort_order=coalesce((p_section->>'sort_order')::int,0),
          is_active=coalesce((p_section->>'is_active')::boolean,true),updated_at=now()
      where id=v_id and merchant_user_id=p_merchant_user_id returning * into r;
  end if;
  if not found then raise exception 'section_not_found'; end if;
  return to_jsonb(r);
end;
$$;

create or replace function public.merchant_ticket_delete_seat(p_merchant_user_id uuid,p_seat_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare r public.merchant_ticket_seats%rowtype;
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  delete from public.merchant_ticket_seats
    where id=p_seat_id and merchant_user_id=p_merchant_user_id and status in ('available','blocked')
    returning * into r;
  if not found then raise exception 'seat_cannot_be_deleted'; end if;
  return jsonb_build_object('ok',true,'id',r.id,'label',r.label);
end;
$$;

create or replace function public.merchant_ticket_delete_section(p_merchant_user_id uuid,p_section_id uuid)
returns jsonb language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare r public.merchant_ticket_sections%rowtype;
begin
  if not public.merchant_tickets_can_manage(p_merchant_user_id) then raise exception 'not_authorized'; end if;
  if exists(select 1 from public.merchant_ticket_seats where section_id=p_section_id and status in ('sold','held')) then raise exception 'section_has_reserved_seats'; end if;
  delete from public.merchant_ticket_sections where id=p_section_id and merchant_user_id=p_merchant_user_id returning * into r;
  if not found then raise exception 'section_not_found'; end if;
  return jsonb_build_object('ok',true,'id',r.id,'name',r.name);
end;
$$;

revoke all on function public.merchant_ticket_delete_seat(uuid,uuid) from public,anon;
revoke all on function public.merchant_ticket_delete_section(uuid,uuid) from public,anon;
grant execute on function public.merchant_ticket_delete_seat(uuid,uuid) to authenticated;
grant execute on function public.merchant_ticket_delete_section(uuid,uuid) to authenticated;
