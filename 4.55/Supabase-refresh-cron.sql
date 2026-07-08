create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('refresh-deals-daily-6am-la')
where exists (
  select 1 from cron.job where jobname = 'refresh-deals-daily-6am-la'
);

select cron.unschedule('refresh-deals-daily-12pm-la')
where exists (
  select 1 from cron.job where jobname = 'refresh-deals-daily-12pm-la'
);

select cron.schedule(
  'refresh-deals-daily-6am-la',
  '0 13 * * *',
  $$
  select net.http_post(
    url := 'https://ptxdxepmggmjcndgukjk.supabase.co/functions/v1/refresh-deals',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SUPABASE_ANON_OR_FUNCTION_TOKEN'
    ),
    body := jsonb_build_object('source', 'cron', 'slot', '6am-la')
  );
  $$
);

select cron.schedule(
  'refresh-deals-daily-12pm-la',
  '0 19 * * *',
  $$
  select net.http_post(
    url := 'https://ptxdxepmggmjcndgukjk.supabase.co/functions/v1/refresh-deals',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SUPABASE_ANON_OR_FUNCTION_TOKEN'
    ),
    body := jsonb_build_object('source', 'cron', 'slot', '12pm-la')
  );
  $$
);
