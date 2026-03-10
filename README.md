# Weather Station

Personal weather dashboard powered by Ambient Weather, hosted on Cloudflare Pages.

## Setup

### 1. Push to GitHub
Push this repo to a new GitHub repository.

### 2. Connect to Cloudflare Pages
1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Click **Create a project** → **Connect to Git**
3. Select your repo
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (root)

### 3. Add Environment Variables
In Cloudflare Pages → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `AMBIENT_API_KEY` | your API key |
| `AMBIENT_APP_KEY` | your application key |
| `AMBIENT_MAC` | your device MAC address |

> ⚠️ Never commit your API keys to the repo. Always use environment variables.

### 4. Deploy
Cloudflare will auto-deploy on every push to `main`.

## File Structure

```
├── index.html              # Frontend dashboard
├── functions/
│   └── api/
│       └── weather.js      # Cloudflare Pages Function (API proxy)
├── _redirects              # Route config
└── README.md
```

## How it works
The Cloudflare Pages Function (`functions/api/weather.js`) acts as a secure proxy — your API keys stay server-side and are never exposed to the browser.
