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

## Deploy to Cloudflare Pages

1. Push this repo to GitHub/GitLab.
2. In Cloudflare Dashboard: `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
3. Use these build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `20`
4. Deploy.

## Data Sources

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
- [OpenStreetMap](https://www.openstreetmap.org/)

## Current Dependencies

- `react`
- `react-dom`
- `axios`
- `motion`
- `vite` (dev)
- `@vitejs/plugin-react` (dev)
