# v5.221 Session Startup Fix

The app now refreshes a saved login session before rendering authenticated UI or making profile, feedback, and administrator requests. This prevents the first page load from logging avoidable 401 responses while the access token is being renewed.
