# v5.242 Media Cache and Startup Fix

## Included

- Raised the application media-cache upper limit from 500 MB to 3 GB.
- Configured R2 CORS for `https://escoopcity.com`, `capacitor://localhost`, and local development so media can enter the device cache.
- Removed the duplicate first-home initialization request so authenticated data waits for token refresh.

## Cache Policy

- The 3 GB value is an upper limit. Actual capacity remains subject to browser and operating-system storage quotas.
- Cached media is an acceleration layer only; R2 remains the source of truth.
- A future Settings entry must let users view and clear the application media cache.
