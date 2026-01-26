import { XMLParser } from "fast-xml-parser";

interface Env {
  // Add KV binding if you want caching
  // RSS_CACHE: KVNamespace;
}

type Category = "DEV" | "TECH" | "NEWS" | "TV";

interface FeedItem {
  category: Category;
  feed?: string;
  title?: string;
  href?: string;
  date?: string; // ISO string for JSON serialization
}

function getCategory(url?: string): Category {
  if (!url) return "NEWS";
  if (url.includes("smashingmagazine")) return "DEV";
  if (url.includes("mozilla")) return "DEV";
  if (url.includes("hnrss")) return "DEV";
  if (url.includes("techcrunch")) return "TECH";
  if (url.includes("theverge")) return "TECH";
  if (url.includes("macrumors")) return "TECH";
  if (url.includes("engadget")) return "TECH";
  if (url.includes("slashdot")) return "TECH";
  if (url.includes("wired.com")) return "TECH";
  if (url.includes("crunchyroll")) return "TV";
  return "NEWS";
}

const FEED_URLS = [
  "https://www.smashingmagazine.com/feed/",
  "https://developer.mozilla.org/en-US/blog/rss.xml",
  "https://hnrss.org/newest",
  "https://techcrunch.com/feed",
  "https://www.theverge.com/rss/index.xml",
  "https://feeds.macrumors.com/MacRumors-All",
  "http://feeds.feedburner.com/crunchyroll/rss/anime",
  "https://rss.slashdot.org/Slashdot/slashdotMain",
  "https://www.engadget.com/rss.xml",
  "https://www.wired.com/feed/rss",
];

async function parseFeed(url: string): Promise<FeedItem[]> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const xml = await response.text();
  const parsed = parser.parse(xml);

  // Handle both RSS and Atom feeds
  const channel = parsed.rss?.channel || parsed.feed;
  const feedTitle = channel?.title || "";
  
  let items: any[] = [];
  
  // RSS format
  if (parsed.rss?.channel?.item) {
    items = Array.isArray(parsed.rss.channel.item)
      ? parsed.rss.channel.item
      : [parsed.rss.channel.item];
  }
  // Atom format
  else if (parsed.feed?.entry) {
    items = Array.isArray(parsed.feed.entry)
      ? parsed.feed.entry
      : [parsed.feed.entry];
  }

  return items.map((item) => {
    // Handle both RSS and Atom date formats
    const pubDate = item.pubDate || item.published || item.updated;
    
    // Handle both RSS link and Atom link formats
    let link = item.link;
    if (typeof link === "object") {
      link = link["@_href"] || link.href || "";
    }

    return {
      category: getCategory(url),
      feed: typeof feedTitle === 'string' ? feedTitle : String(feedTitle),
      title: item.title || "Untitled",
      href: link,
      date: pubDate ? new Date(pubDate).toISOString() : undefined,
    };
  });
}

async function fetchFeeds(): Promise<FeedItem[]> {
  const week = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const results = await Promise.allSettled(
    FEED_URLS.map(async (url) => {
      try {
        return await parseFeed(url);
      } catch (error) {
        console.error("Error fetching feed: " + url, error);
        return null;
      }
    })
  );

  const items = results
    .filter((r) => r.status === "fulfilled" && r.value)
    .flatMap((r) => (r as PromiseFulfilledResult<any>).value)
    .filter((item): item is FeedItem => item !== null && item !== undefined)
    .filter((r) => (r.date ? new Date(r.date).getTime() >= week : true))
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (a.date && !b.date) {
        return -1;
      } else if (!a.date && b.date) {
        return 1;
      }
      return 0;
    });

  return items;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const cacheKey = new Request(request.url, request);
      const cache = caches.default;

      // Try to get from cache
      let response = await cache.match(cacheKey);

      if (!response) {
        // Cache miss - fetch fresh data
        console.log("Cache miss - fetching fresh feeds");
        const feeds = await fetchFeeds();

        response = new Response(JSON.stringify(feeds), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=43200, s-maxage=43200", // 12 hours
          },
        });

        // Store in cache
        await cache.put(cacheKey, response.clone());
      } else {
        console.log("Cache hit - serving cached feeds");
      }

      return response;
    } catch (error) {
      console.error("Error in worker:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch feeds" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
