(() => {
  const routeInAppShell = (route, payload={}) => window.LeshenghuoModuleBridge?.route(route, payload) || false;
  const { esc, session, request } = window.LeshenghuoModuleRuntime;
  const app = document.getElementById('messagesApp');
  const state = { me:null, posts:[], comments:[], likes:[], favorites:[], follows:[], messages:[], profiles:{}, loading:null };
  const cacheKey = () => `leshenghuo_messages_module_cache_v1_${state.me?.id || 'guest'}`;
  const cacheTtl = 90 * 1000;
  const readCache = () => { try { const value=JSON.parse(localStorage.getItem(cacheKey())||'null'); return value?.meId===state.me?.id ? value : null; } catch(e) { return null; } };
  const writeCache = () => { try { localStorage.setItem(cacheKey(),JSON.stringify({at:Date.now(),meId:state.me?.id,posts:state.posts,comments:state.comments,likes:state.likes,favorites:state.favorites,follows:state.follows,messages:state.messages,profiles:state.profiles})); } catch(e) {} };
  const readKey = () => `leshenghuo_message_read_${state.me?.id || 'guest'}`;
  const readMap = () => { try { return JSON.parse(localStorage.getItem(readKey()) || '{}'); } catch(e) { return {}; } };
  const markRead = key => { const values=readMap(); values[key]=new Date().toISOString(); localStorage.setItem(readKey(),JSON.stringify(values)); };
  const list = async path => { try { const res=await request(path); return res.ok ? await res.json() : []; } catch(e) { return []; } };
  const fmt = value => { try{return new Date(value).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){return '';} };
  const initial = name => String(name||'乐').trim().slice(0,1).toUpperCase();
  const profile = (id, name='') => state.profiles[id] || {user_id:id,name:name||'乐生活用户',avatar:''};
  const avatar = (id,name,size=44) => { const p=profile(id,name); return `<span class="avatar" onclick="event.stopPropagation();Messages.openUser('${esc(id)}')" style="width:${size}px;height:${size}px;cursor:pointer;">${p.avatar?`<img src="${esc(p.avatar)}" alt="">`:esc(initial(p.name||name))}</span>`; };
  const postMap = () => new Map(state.posts.map(row=>[String(row.id),row]));
  const myPostSet = () => new Set(state.posts.map(row=>String(row.id)));
  const nick = () => state.profiles[state.me?.id]?.name || state.me?.user_metadata?.name || state.me?.email?.split('@')[0] || '乐生活用户';
  const comments = () => { const ids=myPostSet(); return state.comments.filter(row=>row.user_id!==state.me.id && (ids.has(String(row.post_id)) || row.reply_to_user_id===state.me.id || (row.text||'').includes(`@${nick()}`))).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))); };
  const likesAndSaves = () => { const ids=myPostSet(); return [...state.likes.filter(row=>ids.has(String(row.post_id))&&row.user_id!==state.me.id).map(row=>({...row,kind:'like'})),...state.favorites.filter(row=>ids.has(String(row.post_id))&&row.user_id!==state.me.id).map(row=>({...row,kind:'save'}))].sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))); };
  const fans = () => state.follows.filter(row=>row.followee_id===state.me.id).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
  const conversations = () => {
    const grouped={}; state.messages.forEach(row=>{const other=row.from_id===state.me.id?row.to_id:row.from_id;if(!other)return;(grouped[other]??=[]).push(row);});
    return Object.entries(grouped).map(([id,rows])=>({id,rows:rows.sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at))),last:rows.sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at))).at(-1)})).sort((a,b)=>String(b.last?.created_at).localeCompare(String(a.last?.created_at)));
  };
  const unread = key => { const value=readMap()[key]; const items=key==='cmt'?comments():key==='fans'?fans():key==='lf'?likesAndSaves():state.messages.filter(row=>row.to_id===state.me.id); return items.filter(row=>!value||String(row.created_at)>value).length; };
  const icon = type => ({cmt:'<svg viewBox="0 0 24 24"><path d="M4 5h16v11a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>',fan:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 19a5 5 0 0 1 7 0"/></svg>',like:'<svg viewBox="0 0 24 24"><path d="M20.5 8.5c0 5-8.5 10.5-8.5 10.5S3.5 13.5 3.5 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.5 2.5z"/></svg>'}[type]);
  const top = () => `<header class="module-top"><button onclick="Messages.back()" aria-label="返回">‹</button><b>消息</b><span class="module-top-actions"><button class="module-language" onclick="window.LeshenghuoI18n&&window.LeshenghuoI18n.openPicker()" aria-label="语言">文</button><button onclick="Messages.refresh()" aria-label="刷新">↻</button></span></header>`;
  const category = (key,label,klass) => `<button class="message-category" onclick="Messages.category('${key}')"><span class="message-icon ${klass}">${icon(klass)}</span><span>${label}</span>${unread(key)?'<i class="msg-dot"></i>':''}</button>`;
  const renderHome = () => {
    const convs=conversations();
    app.innerHTML=`${top()}<section class="message-categories">${category('cmt','评论和@','cmt')}${category('fans','新增关注','fan')}${category('lf','赞和收藏','like')}</section><div class="section-label">私信${unread('dm')?` · ${unread('dm')} 条新消息`:''}</div>${convs.length?convs.map(conversationHtml).join(''):'<div class="empty">暂无私信 · 在笔记或用户主页可发私信</div>'}`;
  };
  const conversationHtml = item => { const last=item.last||{}; const other=last.from_id===state.me.id?last.to_id:last.from_id; const p=profile(other,last.from_id===state.me.id?'对方':last.from_name); return `<article class="conversation" onclick="Messages.thread('${esc(other)}')">${avatar(other,p.name)}<div class="conversation-main"><div class="conversation-title">${esc(p.name)}</div><div class="conversation-preview">${last.from_id===state.me.id?'我：':''}${esc(last.text||'')}</div></div><span class="row-time">${esc(fmt(last.created_at))}</span></article>`; };
  const detailShell = (title, content) => `${top()}<div class="detail-head"><button onclick="Messages.home()">‹</button><b>${title}</b></div>${content}`;
  const renderCategory = key => {
    markRead(key);
    if(key==='cmt'){
      const rows=comments();
      const content=rows.length?rows.map(row=>{const p=profile(row.user_id,row.name);const post=postMap().get(String(row.post_id));const relation=row.reply_to_user_id===state.me.id?'回复了你的评论':(String(row.text||'').includes(`@${nick()}`)?'@了你':'评论了你的笔记');return `<article class="notice-row" onclick="Messages.openPost('${esc(row.post_id)}')">${avatar(row.user_id,p.name,40)}<div class="notice-main"><div class="notice-title">${esc(p.name)} ${relation}</div><div class="notice-desc">${esc(row.text||'')}</div><div class="notice-desc">${post?`《${esc(post.title||'笔记')}》 · `:''}${esc(fmt(row.created_at))}</div></div></article>`;}).join(''):'<div class="empty">还没有评论或 @</div>';
      app.innerHTML=detailShell('评论和@',content); return;
    }
    if(key==='fans'){
      const rows=fans(); const content=rows.length?rows.map(row=>{const p=profile(row.follower_id,row.follower_name);const following=state.follows.some(item=>item.follower_id===state.me.id&&item.followee_id===row.follower_id&&item.active);return `<article class="notice-row" onclick="Messages.openUser('${esc(row.follower_id)}')">${avatar(row.follower_id,p.name,40)}<div class="notice-main"><div class="notice-title">${esc(p.name)}</div><div class="notice-desc">${row.active?'关注了你':'曾关注过你'} · ${esc(fmt(row.created_at))}</div></div><button class="follow-action ${following?'followed':''}" onclick="event.stopPropagation();Messages.follow('${esc(row.follower_id)}')">${following?'已关注':'回关'}</button></article>`;}).join(''):'<div class="empty">还没有新增关注</div>';
      app.innerHTML=detailShell('新增关注',content); return;
    }
    const rows=likesAndSaves(); const content=rows.length?rows.map(row=>{const p=profile(row.user_id,row.name);const post=postMap().get(String(row.post_id));return `<article class="notice-row" onclick="Messages.openPost('${esc(row.post_id)}')">${avatar(row.user_id,p.name,40)}<div class="notice-main"><div class="notice-title">${esc(p.name)} ${row.kind==='like'?'赞了':'收藏了'}你的笔记</div><div class="notice-desc">${post?`《${esc(post.title||'笔记')}》 · `:''}${esc(fmt(row.created_at))}</div></div><button class="notice-action" onclick="event.stopPropagation();Messages.openPost('${esc(row.post_id)}')">查看</button></article>`;}).join(''):'<div class="empty">还没有赞和收藏</div>';
    app.innerHTML=detailShell('赞和收藏',content);
  };
  const renderThread = (otherId, fallback='') => {
    markRead('dm'); const rows=state.messages.filter(row=>row.from_id===otherId||row.to_id===otherId).sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at))); const p=profile(otherId,fallback||rows.find(row=>row.from_id===otherId)?.from_name); app.innerHTML=`${top()}<div class="detail-head"><button onclick="Messages.home()">‹</button>${avatar(otherId,p.name,30)}<b>${esc(p.name)}</b></div><section class="thread"><div id="threadList" class="thread-list">${rows.map(row=>`<div class="bubble ${row.from_id===state.me.id?'mine':''}">${esc(row.text||'')}</div>`).join('')||'<div class="empty">开始和对方聊天吧</div>'}</div><div class="thread-compose"><input id="threadInput" placeholder="回复 ${esc(p.name)}…" maxlength="500"><button onclick="Messages.send('${esc(otherId)}','${esc(p.name)}')">发送</button></div></section>`;document.getElementById('threadList')?.scrollTo(0,999999);
  };
  const loadProfiles = async ids => { const unique=[...new Set(ids.filter(Boolean))];if(!unique.length)return;const rows=await list(`/rest/v1/profiles?user_id=in.(${unique.join(',')})&select=user_id,name,avatar`);rows.forEach(row=>{state.profiles[row.user_id]=row;}); };
  const load = async (force=false) => {
    const active=session(); state.me=active?.user||null;
    if(!state.me){app.innerHTML=`${top()}<section class="login-empty"><h2>登录后查看消息</h2><p>评论、关注、赞和收藏，以及私信都会在这里。</p><button onclick="location.assign('/?tab=profile')">去登录</button></section>`;return;}
    const cached=readCache();
    if(cached){ Object.assign(state,cached); renderHome(); if(!force && Date.now()-Number(cached.at||0)<cacheTtl) return; }
    if(state.loading) return state.loading;
    if(!cached) app.innerHTML=`${top()}<div class="module-loading">正在读取消息...</div>`;
    state.loading=(async()=>{
    const me=encodeURIComponent(state.me.id);
    const [posts,commentsRows,likes,favorites,follows,messages]=await Promise.all([
      list(`/rest/v1/posts?user_id=eq.${me}&select=id,title&order=created_at.desc&limit=120`),
      list('/rest/v1/comments?select=post_id,user_id,name,text,created_at,parent_id,reply_to_user_id,reply_to_name&order=created_at.desc&limit=180'),
      list('/rest/v1/likes?select=post_id,user_id,name,created_at&order=created_at.desc&limit=180'),
      list('/rest/v1/favorites?select=post_id,user_id,name,created_at&order=created_at.desc&limit=180'),
      list(`/rest/v1/follows?or=(followee_id.eq.${me},follower_id.eq.${me})&select=*&order=created_at.desc&limit=180`),
      list(`/rest/v1/messages?or=(to_id.eq.${me},from_id.eq.${me})&select=*&order=created_at.asc&limit=180`)
    ]);
    state.posts=posts;state.comments=commentsRows;state.likes=likes;state.favorites=favorites;state.follows=follows;state.messages=messages;
    const ids=[state.me.id,...commentsRows.map(row=>row.user_id),...likes.map(row=>row.user_id),...favorites.map(row=>row.user_id),...follows.map(row=>row.follower_id),...messages.flatMap(row=>[row.from_id,row.to_id])];
    await loadProfiles(ids);
    writeCache();
    const params=new URLSearchParams(location.search);const to=params.get('to');if(to){renderThread(to,params.get('name')||'');}else renderHome();
    })();
    try { return await state.loading; } finally { state.loading=null; }
  };
  const follow = async id => { const current=state.follows.find(row=>row.follower_id===state.me.id&&row.followee_id===id);const active=!current?.active;try{let res;if(current){res=await request(`/rest/v1/follows?id=eq.${current.id}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({active})});const rows=res.ok?await res.json():[];if(rows[0])Object.assign(current,rows[0]);}else{res=await request('/rest/v1/follows',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({follower_id:state.me.id,follower_name:nick(),followee_id:id,active:true})});const rows=res.ok?await res.json():[];if(rows[0])state.follows.push(rows[0]);}if(!res.ok)throw new Error();renderCategory('fans');}catch(e){toast('关注操作失败，请稍后重试');}};
  const send = async (toId,toName) => {const input=document.getElementById('threadInput');const text=input?.value.trim();if(!text)return;try{const res=await request('/rest/v1/messages',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({from_id:state.me.id,from_name:nick(),to_id:toId,text})});if(!res.ok)throw new Error();const rows=await res.json();if(rows[0])state.messages.push(rows[0]);renderThread(toId,toName);}catch(e){toast('发送失败，请稍后重试');}};
  const toast = value => {document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.textContent=value;document.body.appendChild(el);setTimeout(()=>el.remove(),2200);};
  window.Messages={back:()=>window.LeshenghuoModuleBridge?.back('/') || (history.length>1?history.back():location.assign('/')),refresh:()=>load(true),home:renderHome,category:renderCategory,thread:(id)=>renderThread(id),follow,send,openPost:id=>routeInAppShell('post',{id}) || location.assign(`/?post=${encodeURIComponent(id)}`),openUser:id=>routeInAppShell('user',{id}) || location.assign(`/?user=${encodeURIComponent(id)}`)};
  load();
})();
