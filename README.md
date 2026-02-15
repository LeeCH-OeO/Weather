# Weather Terminal (React + Vite)

A terminal-style weather dashboard with:
- Open-Meteo weather + air quality data
- City/location search
- Device geolocation
- Cloudflare-aware network default location (`/cdn-cgi/trace`)
- OpenStreetMap embedded map
- Motion-based UI animations

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Local Development (No Deploy)

Run app-only dev server:

```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

Notes:
- In plain Vite dev, Cloudflare `request.cf` is not available.
- The app will fallback from `/api/network-location` to public IP geolocation providers.

Run Worker-like local dev (closer to production):

```bash
npm run build
npx wrangler dev
```

## Deploy with Cloudflare Workers (Static Assets + API)

This repo is configured as a Worker that:
- serves static files from `dist/`
- exposes `/api/network-location` using Cloudflare `request.cf` geolocation

Deploy:

```bash
npm run build
npx wrangler deploy
```

`wrangler.jsonc` uses:
- `main: src/worker.js`
- `assets.directory: ./dist`
- `assets.binding: ASSETS`

## Data Sources

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Nominatim API](https://nominatim.org/)

## Current Dependencies

- `react`
- `react-dom`
- `axios`
- `motion`
- `vite` (dev)
- `@vitejs/plugin-react` (dev)
