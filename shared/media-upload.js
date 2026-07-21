/* Shared image compression and authenticated R2 upload helper. */
(() => {
  const allowedKinds = ['posts','avatars','covers','merchant-logos','merchant-covers','text-covers','coupons','products'];
  const isDataImage = value => typeof value === 'string' && value.startsWith('data:image/');
  const mediaKind = kind => allowedKinds.includes(kind) ? kind : 'posts';

  const create = ({ apiUrl, getAccessToken, refreshAccessToken } = {}) => {
    const dataUrlToBlob = async dataUrl => {
      const source = await fetch(dataUrl);
      if(!source.ok) throw new Error('图片读取失败');
      return source.blob();
    };

    const createThumbnailDataUrl = async dataUrl => {
      const source = await dataUrlToBlob(dataUrl);
      const objectUrl = URL.createObjectURL(source);
      try {
        const image = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = objectUrl;
        });
        const scale = Math.min(1, 480 / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        let quality = 0.74;
        let value = canvas.toDataURL('image/jpeg', quality);
        while(value.length > 160000 && quality > 0.54){
          quality -= 0.05;
          value = canvas.toDataURL('image/jpeg', quality);
        }
        return value;
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    const uploadBlob = async (blob, kind) => {
      let token = getAccessToken?.();
      if(!token) throw new Error('请先登录后再上传图片');
      if(!blob || !blob.size) throw new Error('图片不能为空');
      if(blob.size > 5 * 1024 * 1024) throw new Error('图片压缩后仍超过 5MB，请换一张图片');
      const send = accessToken => fetch(`${apiUrl}/upload`, {
        method:'POST',
        headers:{ Authorization:`Bearer ${accessToken}`, 'Content-Type':blob.type || 'image/jpeg', 'x-media-kind':mediaKind(kind) },
        body:blob
      });
      let response = await send(token);
      if(response.status === 401 && await refreshAccessToken?.()){
        token = getAccessToken?.();
        if(token) response = await send(token);
      }
      const payload = await response.json().catch(() => ({}));
      if(!response.ok || !payload.url) throw new Error(payload.error || `图片上传失败（${response.status}）`);
      return payload.url;
    };

    const uploadDataUrl = async (value, kind) => {
      if(!isDataImage(value)) return value || null;
      return uploadBlob(await dataUrlToBlob(value), kind);
    };

    const uploadPostAssets = async (values, existingThumbnails=[]) => {
      const originals = [];
      const thumbnails = [];
      for(let index = 0; index < values.length; index += 1){
        const value = values[index];
        if(isDataImage(value)){
          const thumbnailData = await createThumbnailDataUrl(value);
          const [original, thumbnail] = await Promise.all([uploadDataUrl(value, 'posts'), uploadDataUrl(thumbnailData, 'posts')]);
          originals.push(original);
          thumbnails.push(thumbnail);
        } else {
          originals.push(value);
          thumbnails.push(existingThumbnails[index] || value);
        }
      }
      return { originals, thumbnails };
    };

    return { dataUrlToBlob, createThumbnailDataUrl, uploadBlob, uploadDataUrl, uploadPostAssets };
  };

  window.LeshenghuoMediaUpload = { create, isDataImage, mediaKind };
})();
