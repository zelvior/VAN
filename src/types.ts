/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum VerificationStatus {
  VERIFIED = "VERIFIED",
  TRUSTED = "TRUSTED",
  PENDING = "PENDING",
  UNCONFIRMED = "UNCONFIRMED"
}

export enum NewsCategory {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  TRAILER = "TRAILER",
  RELEASE = "RELEASE",
  STAFF_CAST = "STAFF_CAST",
  INDUSTRY = "INDUSTRY",
  RUMOR = "RUMOR"
}

export enum SourceType {
  OFFICIAL = "OFFICIAL",
  NEWS_OUTLET = "NEWS_OUTLET",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  FORUM = "FORUM",
  BLOG = "BLOG"
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  trustScore: number; // 0-100
  verificationStatus: VerificationStatus;
  publishDate: string; // ISO String or UTC epoch
  createdAt?: string; // ISO String
  sourceName: string;
  sourceUrl: string;
  animeId?: string; // MyAnimeList or Jikan ID
  animeTitle?: string;
  category: NewsCategory;
  originalAuthor?: string;
  isOfficial?: boolean;
  redditPostUrl?: string;
  anilistId?: number;
  tags?: string[];
  views?: number;
  bookmarksCount?: number;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  credibilityScore: number; // 0-100 score
  type: SourceType;
  isTrusted: boolean;
}

export interface Ad {
  id: string;
  imageUrl: string;
  title: string;
  targetUrl: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
}

export interface Report {
  id: string;
  articleId: string;
  articleTitle: string;
  reason: string;
  reportedBy: string; // User email or anonymous id
  createdAt: string;
  status: "PENDING" | "RESOLVED";
}

export interface Bookmark {
  id: string; // articleId
  createdAt: string;
}

export interface ReadingHistoryItem {
  id: string; // articleId
  title: string;
  viewedAt: string;
}
