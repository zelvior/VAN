/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NewsArticle, VerificationStatus, NewsCategory } from "../types";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";
const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";

// Simple local cache for API calls to prevent rate-limiting (e.g. Jikan MAL limits 3 reqs/sec)
const apiCache: Record<string, { data: any; expiry: number }> = {};

function getCachedData(key: string): any | null {
  const cached = apiCache[key];
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  const localVal = localStorage.getItem(`cache_${key}`);
  if (localVal) {
    try {
      const parsed = JSON.parse(localVal);
      if (parsed.expiry > Date.now()) {
        apiCache[key] = parsed;
        return parsed.data;
      }
    } catch (_) {
      // ignore parse error
    }
  }
  return null;
}

function setCachedData(key: string, data: any, ttlSec = 300) {
  const item = {
    data,
    expiry: Date.now() + ttlSec * 1000,
  };
  apiCache[key] = item;
  try {
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  } catch (_) {
    // quota exceeded or private mode
  }
}

/**
 * 1. Fetch search results from MAL via Jikan
 */
export async function searchAnimeOnMAL(query: string): Promise<any[]> {
  const cacheKey = `jikan_search_${query}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=8`);
    if (!res.ok) throw new Error("Jikan search error");
    const json = await res.json();
    const data = json.data || [];
    setCachedData(cacheKey, data, 600); // 10 mins cache
    return data;
  } catch (err) {
    console.warn("Jikan search fallback empty:", err);
    return [];
  }
}

/**
 * 2. Fetch specific MAL Anime core details
 */
export async function getAnimeMALDetails(id: string): Promise<any | null> {
  const cacheKey = `jikan_details_${id}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${JIKAN_BASE_URL}/anime/${id}`);
    if (!res.ok) throw new Error("Jikan details error");
    const json = await res.json();
    const data = json.data || null;
    setCachedData(cacheKey, data, 3600); // 1 hour cache
    return data;
  } catch (err) {
    console.error("Jikan detail fetch fault:", err);
    return null;
  }
}

/**
 * 3. Fetch details from AniList GraphQL API (gives beautiful banner images MAL doesn't support!)
 */
export async function getAniListAnimeDetails(title: string): Promise<any | null> {
  const cacheKey = `anilist_details_${title}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const graphqlQuery = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        bannerImage
        description
        genres
        season
        seasonYear
        episodes
        averageScore
        studios(isMain: true) {
          nodes {
            name
          }
        }
        siteUrl
      }
    }
  `;

  try {
    const res = await fetch(ANILIST_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { search: title },
      }),
    });

    if (!res.ok) throw new Error("AniList GraphQL API error");
    const json = await res.json();
    const data = json.data?.Media || null;
    if (data) {
      setCachedData(cacheKey, data, 3600); // 1 hour cache
    }
    return data;
  } catch (err) {
    console.warn("AniList detail GraphQL fallback:", err);
    return null;
  }
}

/**
 * 4. Fetch official news from Reddit (r/anime news flare)
 */
export async function fetchRedditAnimeNews(): Promise<Partial<NewsArticle>[]> {
  const cacheKey = "reddit_anime_news";
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // Fetch top news flare search from r/anime
    const searchUrl = "https://www.reddit.com/r/anime/search.json?q=flair%3A%22News%22&restrict_sr=1&sort=new&limit=15";
    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error("Reddit endpoint reached exception");
    const json = await res.json();
    const children = json.data?.children || [];

    const articles: Partial<NewsArticle>[] = children.map((item: any) => {
      const p = item.data;
      // Calculate trust score based on official sources mentioned in reddit title
      let title = p.title || "";
      let sourceName = "Reddit News Link";
      let sourceUrl = p.url || `https://reddit.com${p.permalink}`;
      let trust = 60; // base for anime subreddit news tag
      let verification = VerificationStatus.TRUSTED;

      // Extract original news source domains if they exist in reddit post domain
      if (p.domain && !p.domain.startsWith("self.") && !p.domain.includes("reddit.com")) {
        sourceName = p.domain;
        if (p.domain.includes("crunchyroll.com")) {
          trust = 95;
          verification = VerificationStatus.VERIFIED;
        } else if (p.domain.includes("animenewsnetwork.com")) {
          trust = 92;
          verification = VerificationStatus.VERIFIED;
        } else if (p.domain.includes("natalie.mu")) {
          trust = 98;
          verification = VerificationStatus.VERIFIED;
        } else if (p.domain.includes("twitter.com") || p.domain.includes("x.com")) {
          trust = 85; // Official Twitter account links
          verification = VerificationStatus.VERIFIED;
        }
      }

      // Detect rumors
      let category = NewsCategory.ANNOUNCEMENT;
      if (title.toUpperCase().includes("RUMOR") || title.toUpperCase().includes("LEAK")) {
        category = NewsCategory.RUMOR;
        trust = Math.max(15, trust - 40);
        verification = VerificationStatus.UNCONFIRMED;
      } else if (title.toUpperCase().includes("TRAILER") || title.toUpperCase().includes("PV")) {
        category = NewsCategory.TRAILER;
      } else if (title.toUpperCase().includes("CAST") || title.toUpperCase().includes("STAFF")) {
        category = NewsCategory.STAFF_CAST;
      }

      return {
        id: `reddit_${p.id}`,
        title: title,
        summary: p.selftext ? p.selftext.slice(0, 180) + "..." : `Aggregated discussion thread on r/anime around the news announcement. Source domain: ${sourceName}.`,
        content: p.selftext || `Original news article is linked directly to ${sourceName}. Keep updated only with official accounts to avoid rumor contamination.`,
        thumbnail: p.thumbnail && p.thumbnail.startsWith("http") ? p.thumbnail : "",
        trustScore: trust,
        verificationStatus: verification,
        publishDate: new Date(p.created_utc * 1000).toISOString(),
        sourceName: sourceName,
        sourceUrl: sourceUrl,
        category: category,
        redditPostUrl: `https://reddit.com${p.permalink}`,
        originalAuthor: p.author,
        tags: ["reddit", "r/anime"],
        views: Math.floor(Math.random() * 200) + 50,
        bookmarksCount: 0,
      };
    });

    setCachedData(cacheKey, articles, 600); // cache for 10 mins
    return articles;
  } catch (err) {
    console.warn("Reddit API failed, returning empty:", err);
    return [];
  }
}

/**
 * 5. Calculate News Article Trust Score using weighted values
 * 0 - 100 range
 */
export function calculateTrustScore(article: {
  sourceName: string;
  category: NewsCategory;
  isOfficial?: boolean;
}): { score: number; status: VerificationStatus } {
  let score = 50; // base score

  const name = article.sourceName.toLowerCase();
  // Standard trusted publisher lists
  if (name.includes("crunchyroll")) {
    score += 45;
  } else if (name.includes("animenewsnetwork") || name.includes("anime news network")) {
    score += 42;
  } else if (name.includes("natalie.mu") || name.includes("comic natalie")) {
    score += 48;
  } else if (name.includes("famitsu") || name.includes("shonen jump")) {
    score += 45;
  } else if (article.isOfficial || name.includes("official pv") || name.includes("production committee")) {
    score += 45;
  } else if (name.includes("twitter.com") || name.includes("x.com")) {
    score += 25; // High confidence if signed properly
  } else if (name.includes("reddit") || name.includes("r/anime")) {
    score += 15;
  } else if (name.includes("blog") || name.includes("leaks") || name.includes("rumor")) {
    score -= 35;
  }

  // Factor the genre/category
  if (article.category === NewsCategory.RUMOR) {
    score = Math.max(10, score - 45); // highly penalize rumors
  } else if (article.category === NewsCategory.TRAILER || article.category === NewsCategory.RELEASE) {
    score += 10;
  }

  // clamp 0-100
  score = Math.min(100, Math.max(0, score));

  // assign verification badges
  let status = VerificationStatus.PENDING;
  if (score >= 90) {
    status = VerificationStatus.VERIFIED;
  } else if (score >= 70) {
    status = VerificationStatus.TRUSTED;
  } else if (score >= 40) {
    status = VerificationStatus.PENDING;
  } else {
    status = VerificationStatus.UNCONFIRMED;
  }

  return { score, status };
}

/**
 * 6. Duplicate detection routine using simplified title Jaccard word intersection
 */
export function isDuplicateArticle(newTitle: string, existingTitles: string[]): boolean {
  const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const wordsNew = new Set(normalize(newTitle));

  if (wordsNew.size === 0) return false;

  for (const matchTitle of existingTitles) {
    const wordsExisting = normalize(matchTitle);
    let intersection = 0;
    for (const w of wordsExisting) {
      if (wordsNew.has(w)) {
        intersection++;
      }
    }
    const union = wordsNew.size + wordsExisting.length - intersection;
    const jaccard = intersection / union;
    if (jaccard > 0.65) {
      // Over 65% overlap in distinct words indicates highly probable redundant duplicates!
      return true;
    }
  }
  return false;
}
