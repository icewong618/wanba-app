# v5.165 文字配图资产统一版

- 文字配图仍在浏览器即时生成，预览与草稿无需等待网络。
- 新发布的纯文字笔记会把 JPEG 封面上传到 Supabase Storage 的 `post-assets` 桶。
- 帖子只保存公开图片链接，不再把新的文字封面以 Base64 写入 `image` 或 `images`。
- 旧笔记维持原样，不做强制迁移。
- `Supabase-post-assets-storage-5.165.sql` 已直接应用到生产数据库。
