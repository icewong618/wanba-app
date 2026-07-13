alter table public.posts
  add column if not exists subcategory text;

create index if not exists posts_category_subcategory_created_at_idx
  on public.posts (category, subcategory, created_at desc);

comment on column public.posts.subcategory is
  'Optional user post subtype, constrained by the 乐生活 client taxonomy.';
