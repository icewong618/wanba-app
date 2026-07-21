(() => {
  const routeInAppShell = (route, payload={}) => {
    if(window.parent === window) return false;
    window.parent.postMessage({type:'leshenghuo-module-route',route,...payload}, window.location.origin);
    return true;
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('.module-bottom-nav a');
    if(!link || window.parent === window) return;
    const path = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
    const route = path === '/' ? 'home' : path === '/week' ? 'week' : path === '/deals' ? 'deals' : path === '/messages' ? 'message' : 'profile';
    event.preventDefault();
    routeInAppShell(route);
  });
  const SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_h3x-jnCW-N8Nx3P6t_D8rA_CS9dgkP-';
  const app = document.getElementById('weekApp');
  const state = { rows: [], filter: 'all' };
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const session = () => { try { return JSON.parse(localStorage.getItem('wanba_session') || 'null'); } catch(e) { return null; } };
  const request = async path => {
    const active = session();
    return fetch(`${SUPABASE_URL}${path}`, { headers:{ apikey:SUPABASE_KEY, Accept:'application/json', Authorization:`Bearer ${active?.access_token || SUPABASE_KEY}` } });
  };
  const ymdInLa = date => {
    const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
    const read = type => parts.find(part => part.type === type)?.value || '';
    return `${read('year')}-${read('month')}-${read('day')}`;
  };
  const dayFromYmd = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? new Date(`${value}T12:00:00Z`) : null;
  const formatYmd = date => date.toISOString().slice(0,10);
  const addDays = (date, amount) => { const next = new Date(date); next.setUTCDate(next.getUTCDate() + amount); return next; };
  const weekRange = () => {
    const today = dayFromYmd(ymdInLa(new Date()));
    const mondayOffset = (today.getUTCDay() + 6) % 7;
    const start = addDays(today, -mondayOffset);
    return { start, end:addDays(start, 6), today };
  };
  const eventFor = row => row?.event && typeof row.event === 'object' ? row.event : null;
  const periodFor = row => {
    const event = eventFor(row);
    const start = dayFromYmd(event?.start_date);
    const end = dayFromYmd(event?.end_date || event?.start_date);
    return start && end && end >= start ? {start,end} : null;
  };
  const textFor = row => [row?.title,row?.content,row?.excerpt,row?.category,row?.subcategory,...(Array.isArray(row?.tags) ? row.tags : [])].filter(Boolean).join(' ').toLowerCase();
  const legacyWeekTag = row => /本周活动|本周末活动/.test(textFor(row));
  const overlaps = (aStart,aEnd,bStart,bEnd) => aStart <= bEnd && aEnd >= bStart;
  const isInWeek = row => { const period = periodFor(row); const range = weekRange(); return period ? overlaps(period.start,period.end,range.start,range.end) : legacyWeekTag(row); };
  const isToday = row => { const period = periodFor(row); const {today} = weekRange(); return period ? overlaps(period.start,period.end,today,today) : legacyWeekTag(row); };
  const isWeekend = row => { const {end} = weekRange(); const saturday = addDays(end,-1); const period = periodFor(row); return period ? overlaps(period.start,period.end,saturday,end) : /本周末活动/.test(textFor(row)); };
  const dateLabel = row => { const period = periodFor(row); if(!period) return '本周活动'; const start = formatYmd(period.start).slice(5).replace('-','/'); const end = formatYmd(period.end).slice(5).replace('-','/'); return start === end ? start : `${start} - ${end}`; };
  const cover = row => row?.cover_image || row?.image || (Array.isArray(row?.images) ? row.images[0] : '') || '';
  const clean = value => String(value || '').replace(/\[\[.*?\]\]/g,'').trim();
  const rowMatchesFilter = row => state.filter === 'all' ? true : state.filter === 'today' ? isToday(row) : isWeekend(row);
  const filtered = () => state.rows.filter(isInWeek).filter(rowMatchesFilter).sort((a,b) => {
    const aStart = periodFor(a)?.start?.getTime() || Number.MAX_SAFE_INTEGER;
    const bStart = periodFor(b)?.start?.getTime() || Number.MAX_SAFE_INTEGER;
    return aStart - bStart || new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });
  const top = () => `<header class="module-top"><button onclick="WeekEvents.back()" aria-label="返回">‹</button><b>本周活动</b><span class="module-top-actions"><button class="module-language" onclick="window.LeshenghuoI18n&&window.LeshenghuoI18n.openPicker()" aria-label="语言" title="语言">文</button><button onclick="WeekEvents.refresh()" aria-label="刷新">↻</button></span></header>`;
  const card = row => {
    const image = cover(row); const tags = (Array.isArray(row.tags) ? row.tags : []).filter(Boolean).slice(0,2);
    const event = eventFor(row); const type = row.calendar_source_type === 'ticket' ? '票务' : (event?.registration_enabled || Number(event?.capacity || 0) > 0 ? '可报名' : '活动');
    return `<article class="event-card" onclick="WeekEvents.open('${esc(row.id)}')"><div class="event-cover">${image ? `<img src="${esc(image)}" alt="">` : ''}<span class="event-type">${type}</span></div><div class="event-content"><h2>${esc(row.title || '未命名活动')}</h2><div class="event-date">▣ ${esc(dateLabel(row))}</div>${row.location ? `<div class="event-location">⌖ ${esc(row.location)}</div>` : ''}<p class="event-desc">${esc(clean(row.excerpt || row.content) || '查看活动详情、时间与报名信息。')}</p>${tags.length ? `<div class="event-tags">${tags.map(tag => `<span>#${esc(tag)}</span>`).join('')}</div>` : ''}</div></article>`;
  };
  const render = () => {
    const range = weekRange(); const rows = filtered();
    app.innerHTML = `${top()}<section class="week-hero"><h1>本周活动</h1><p>活动笔记、报名活动与后续票务内容统一按时间进入本周。</p><span class="week-range">▣ ${formatYmd(range.start).slice(5).replace('-','/')} - ${formatYmd(range.end).slice(5).replace('-','/')} · 洛杉矶时间</span></section><div class="week-tabs"><button class="${state.filter==='all'?'active':''}" onclick="WeekEvents.filter('all')">全部</button><button class="${state.filter==='today'?'active':''}" onclick="WeekEvents.filter('today')">今天</button><button class="${state.filter==='weekend'?'active':''}" onclick="WeekEvents.filter('weekend')">本周末</button></div><div class="week-summary"><span>本周共 <b>${rows.length}</b> 个活动</span><span>按开始日期排序</span></div><section class="week-feed">${rows.length ? rows.map(card).join('') : '<div class="empty"><div class="empty-icon">▣</div><p>本周还没有活动<br>发布玩乐活动并填写开始、截止日期后，会自动显示在这里。</p></div>'}</section>`;
  };
  const load = async () => {
    app.innerHTML = `${top()}<div class="module-loading">正在读取本周活动...</div>`;
    const select = 'id,title,content,excerpt,category,subcategory,author,image,images,event,tags,user_id,visibility,pinned,created_at,location';
    try {
      const res = await request(`/rest/v1/posts?select=${select}&or=(visibility.eq.public,visibility.is.null)&order=created_at.desc,id.desc&limit=300`);
      if(!res.ok) throw new Error(await res.text());
      const postRows = await res.json();
      // 票务、报名等独立活动以后写入 activity_calendar_items；表尚未部署时仍保持帖子活动可用。
      let calendarRows = [];
      try {
        const calendarRes = await request('/rest/v1/activity_calendar_items?status=eq.published&select=id,source_type,source_id,source_url,title,summary,cover_image,start_date,end_date,all_day,location,capacity,registered,registration_enabled,created_at&order=start_date.asc&limit=300');
        if(calendarRes.ok){
          const sourceRows = await calendarRes.json();
          calendarRows = sourceRows.map(item => ({
            id: `calendar-${item.id}`,
            title: item.title,
            content: item.summary || '',
            excerpt: item.summary || '',
            image: item.cover_image || '',
            cover_image: item.cover_image || '',
            location: item.location || '',
            created_at: item.created_at,
            calendar_source_type: item.source_type,
            source_id: item.source_id,
            source_url: item.source_url,
            event: { start_date:item.start_date, end_date:item.end_date, all_day:item.all_day, capacity:item.capacity, registered:item.registered, registration_enabled:item.registration_enabled },
            tags: item.source_type === 'ticket' ? ['票务活动'] : ['报名活动']
          }));
        }
      } catch(e) { console.warn('独立活动读取跳过:', e.message); }
      state.rows = [...postRows, ...calendarRows];
      render();
    } catch(error) {
      console.warn('本周活动读取失败:', error.message);
      app.innerHTML = `${top()}<div class="empty"><div class="empty-icon">!</div><p>暂时无法读取活动内容<br>请稍后刷新再试。</p></div>`;
    }
  };
  window.WeekEvents = {
    back: () => routeInAppShell('home') || (history.length > 1 ? history.back() : location.assign('/')),
    refresh: load,
    filter: value => { state.filter = value; render(); },
    open: id => {
      const row = state.rows.find(item => String(item.id) === String(id));
      if(String(id).startsWith('calendar-')){
        if(row?.source_url) return location.assign(row.source_url);
        if(row?.source_id && /^\d+$/.test(String(row.source_id))) return routeInAppShell('post',{id:row.source_id}) || location.assign(`/?post=${encodeURIComponent(row.source_id)}`);
        return alert('该活动详情正在准备中，请稍后再试。');
      }
      routeInAppShell('post',{id}) || location.assign(`/?post=${encodeURIComponent(id)}`);
    }
  };
  load();
})();
