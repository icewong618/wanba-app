/* Feedback screenshot storage access for 乐生活. */
(() => {
  const create = ({ supabaseUrl = '', request = (...args) => fetch(...args) } = {}) => {
    const objectPath = path => String(path || '').split('/').map(encodeURIComponent).join('/');
    const groupByFeedback = rows => {
      const map = new Map();
      (rows || []).forEach(row => {
        const key = String(row.feedback_id);
        if(!map.has(key)) map.set(key, []);
        map.get(key).push(row);
      });
      map.forEach(list => list.sort((a, b) => Number(a.slot) - Number(b.slot)));
      return map;
    };
    const listForFeedbackRows = async feedbackRows => {
      const ids = [...new Set((feedbackRows || []).map(row => Number(row.id)).filter(Number.isFinite))];
      if(!ids.length) return new Map();
      const url = `${supabaseUrl}/rest/v1/user_feedback_attachments?feedback_id=in.(${ids.join(',')})&select=id,feedback_id,slot,storage_path,file_name,content_type,byte_size,created_at&order=feedback_id.asc,slot.asc`;
      const response = await request(url, { method:'GET' });
      if(!response.ok) throw new Error(`截图列表读取失败 ${response.status}: ${(await response.text()).slice(0, 120)}`);
      return groupByFeedback(await response.json());
    };
    const upload = async ({ userId, feedbackId, file, slot, bucket }) => {
      const token = globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
        ? globalThis.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const path = `${userId}/${feedbackId}/${token}.jpg`;
      const objectUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath(path)}`;
      const uploaded = await request(objectUrl, {
        method:'POST',
        headers:{ 'Content-Type':file.type, 'x-upsert':'false' },
        body:file
      });
      if(!uploaded.ok) throw new Error(`截图上传失败（${uploaded.status}）`);
      const metadata = { feedback_id:feedbackId, user_id:userId, slot, storage_path:path, file_name:file.name, content_type:file.type, byte_size:file.size };
      const saved = await request(`${supabaseUrl}/rest/v1/user_feedback_attachments`, { method:'POST', body:JSON.stringify(metadata) });
      if(!saved.ok){
        await request(objectUrl, { method:'DELETE' });
        throw new Error(`截图记录失败（${saved.status}）`);
      }
      return (await saved.json())[0] || null;
    };
    const loadObjectUrl = async ({ bucket, storagePath, contentType }) => {
      const response = await request(`${supabaseUrl}/storage/v1/object/authenticated/${bucket}/${objectPath(storagePath)}`, {
        method:'GET', headers:{ Accept:contentType || 'image/*' }
      });
      if(!response.ok) throw new Error(`截图读取失败（${response.status}）`);
      return URL.createObjectURL(await response.blob());
    };
    const compressImage = (file, { maxBytes = 4 * 1024 * 1024, maxSide = 1600, quality = 0.82 } = {}) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('图片读取失败'));
      reader.onload = event => {
        const image = new Image();
        image.onerror = () => reject(new Error('图片格式暂不支持，请换成 JPG、PNG 或 WebP'));
        image.onload = () => {
          const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext('2d');
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            if(!blob) return reject(new Error('图片压缩失败'));
            if(blob.size > maxBytes) return reject(new Error('压缩后图片仍超过 4MB，请换一张截图'));
            resolve(new File([blob], `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`, { type:'image/jpeg' }));
          }, 'image/jpeg', quality);
        };
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
    return { objectPath, groupByFeedback, listForFeedbackRows, upload, loadObjectUrl, compressImage };
  };
  window.LeshenghuoFeedbackAttachmentsApi = { create };
})();
