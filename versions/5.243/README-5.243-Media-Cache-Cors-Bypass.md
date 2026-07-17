# v5.243 Media Cache CORS Bypass

R2 CORS is configured correctly, but cached media responses created before that configuration may remain at the edge without CORS headers. This release moves device media caching to a versioned cache key and requests R2 media with `media_cache_v=2`, bypassing those stale responses immediately.
