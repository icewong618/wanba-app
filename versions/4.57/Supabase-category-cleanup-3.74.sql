-- 乐生活 3.74：历史帖子分类清洗 SQL
-- 用途：把早期或测试数据中的非标准分类，统一为当前前端使用的标准分类。
-- 标准分类：美食、玩乐、好物、生活、社区

-- 1. 执行前预览：查看当前 posts 表里有哪些分类值
select
  category,
  count(*) as total
from public.posts
group by category
order by total desc, category asc;

-- 2. 清洗常见旧分类值
update public.posts
set category = case
  when trim(category) in ('吃喝', '喝喝', '吃吃', '餐饮', '美食餐饮', 'food', 'restaurant') then '美食'
  when trim(category) in ('玩玩', '看看', '活动', '娱乐', 'event', 'events', 'fun') then '玩乐'
  when trim(category) in ('买买', '购物', '省钱', '折扣', 'deal', 'deals', 'shop', 'shopping') then '好物'
  when trim(category) in ('日常', '本地', 'local') then '生活'
  when trim(category) in ('邻里', '公告', 'community') then '社区'
  else category
end
where category is not null
  and trim(category) in (
    '吃喝', '喝喝', '吃吃', '餐饮', '美食餐饮', 'food', 'restaurant',
    '玩玩', '看看', '活动', '娱乐', 'event', 'events', 'fun',
    '买买', '购物', '省钱', '折扣', 'deal', 'deals', 'shop', 'shopping',
    '日常', '本地', 'local',
    '邻里', '公告', 'community'
  );

-- 3. 空分类统一为生活
update public.posts
set category = '生活'
where category is null
   or trim(category) = '';

-- 4. 执行后复查：如果仍有非标准分类，会在这里列出
select
  category,
  count(*) as total
from public.posts
where category not in ('美食', '玩乐', '好物', '生活', '社区')
group by category
order by total desc, category asc;

-- 5. 执行后总览
select
  category,
  count(*) as total
from public.posts
group by category
order by total desc, category asc;
