# RSS Worker

Cloudflare Worker that fetches and aggregates RSS feeds using native `fetch` API and `fast-xml-parser`.

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Login to Cloudflare:**
   ```bash
   pnpm wrangler login
   ```

3. **Test locally:**
   ```bash
   pnpm dev
   ```
   This starts a local server at `http://localhost:8787`

4. **Deploy to Cloudflare:**
   ```bash
   pnpm deploy
   ```
   After deployment, you'll get a URL like: `https://rss-worker.YOUR-SUBDOMAIN.workers.dev`

5. **Update the frontend:**
   Edit `src/pages/index.astro` and replace the `WORKER_URL` constant with your deployed worker URL:
   ```typescript
   const WORKER_URL = "https://rss-worker.YOUR-SUBDOMAIN.workers.dev";
   ```

## Features

- Fetches 10 RSS feeds from tech/dev/news sources
- Filters to show only items from the last 7 days
- Returns JSON sorted by date (newest first)
- CORS enabled for browser access
- 5-minute cache headers

## API

**Endpoint:** `GET /`

**Response:**
```json
[
  {
    "category": "TECH",
    "feed": "TechCrunch",
    "title": "Article Title",
    "href": "https://...",
    "date": "2025-01-26T12:00:00.000Z"
  }
]
```

## Adding New Feeds

Edit `src/index.ts` and add URLs to the `FEED_URLS` array. Update the `getCategory()` function to categorize new feeds correctly.

## Optional: KV Caching

To add caching with Cloudflare KV (reduces RSS fetch frequency):

1. Create a KV namespace:
   ```bash
   pnpm wrangler kv:namespace create RSS_CACHE
   ```

2. Update `wrangler.toml` with the namespace ID

3. Modify `src/index.ts` to use the KV cache for storing feed results
