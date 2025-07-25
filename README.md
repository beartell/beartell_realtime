# Beartell Realtime

This repository contains a minimal static prototype for the Beartell Realtime
website. The project provides placeholder pages for various Ultravox REST API
endpoints and a simple Node server that serves the static files and proxies
requests to the Ultravox API when network access is available.

## Usage

```
node server.js
```

The server listens on port 3000 by default. Navigate to `http://localhost:3000`
to access the site.

The implementation avoids external dependencies and does not include a working
Google OAuth flow due to the offline environment.
