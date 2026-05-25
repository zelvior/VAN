/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getAnimeMALDetails, getAniListAnimeDetails } from "../services/api";
import { NewsArticle } from "../types";
import { 
  ArrowLeft, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  Star, 
  Tv, 
  Award, 
  AlertTriangle,
  Bookmark,
  Activity,
  User,
  Heart,
  Share2,
  BookmarkCheck,
  Loader2
} from "lucide-react";

export const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { news, bookmarks, toggleBookmark, addToHistory } = useApp();
  
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [malDetails, setMalDetails] = useState<any | null>(null);
  const [anilistDetails, setAnilistDetails] = useState<any | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isBookmarked = article ? bookmarks.includes(article.id) : false;

  // 1. Locate current news article and add to history
  useEffect(() => {
    if (id) {
      const match = news.find((n) => n.id === id);
      if (match) {
        setArticle(match);
        addToHistory(match.id, match.title);
      }
    }
  }, [id, news]);

  // 2. Query MyAnimeList (Jikan) + AniList GraphQL when the news is loaded
  useEffect(() => {
    if (!article) return;

    const fetchAssociatedMedia = async () => {
      setLoadingMedia(true);
      
      // Attempt MAL fetch by id
      if (article.animeId) {
        try {
          const malData = await getAnimeMALDetails(article.animeId);
          if (malData) setMalDetails(malData);
        } catch (e) {
          console.error("Failed loading MAL details:", e);
        }
      }

      // Attempt AniList GraphQL fetch by Title
      const queryTitle = article.animeTitle || article.title.split(":")[0] || "";
      if (queryTitle) {
        try {
          const aniData = await getAniListAnimeDetails(queryTitle);
          if (aniData) setAnilistDetails(aniData);
        } catch (e) {
          console.error("Failed loading AniList Details:", e);
        }
      }
      
      setLoadingMedia(false);
    };

    fetchAssociatedMedia();
  }, [article]);

  const copyShareLink = () => {
    if (!article) return;
    const url = `${window.location.origin}${window.location.pathname}#/news/${article.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!article) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-zinc-400">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-red-650 mb-3" />
        <p className="font-mono text-xs">Locating verified news report...</p>
      </div>
    );
  }

  // Cover image preference mapping (AniList extra large, large, then MAL, then default)
  const coverImage = anilistDetails?.coverImage?.extraLarge || 
                     anilistDetails?.coverImage?.large || 
                     malDetails?.images?.jpg?.large_image_url || 
                     article.thumbnail;

  const getStatusColor = (status: string) => {
    if (status === "VERIFIED") return "text-emerald-400 border-emerald-900 bg-emerald-950/35";
    if (status === "TRUSTED") return "text-cyan-400 border-cyan-900 bg-cyan-950/35";
    return "text-amber-400 border-amber-900 bg-amber-950/35";
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 page-fade-in relative">
      
      {/* Back to feed navigation trigger */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-tight text-zinc-400 hover:text-red-500 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Vetted Feed
      </Link>

      {/* Hero Banner display (Prefer AniList banner image) */}
      <div className="relative h-48 sm:h-72 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <img
          src={anilistDetails?.bannerImage || article.thumbnail}
          alt={article.title}
          className="h-full w-full object-cover opacity-35"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
        
        {/* Banner Overlaid Quick Details */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide font-mono ${getStatusColor(article.verificationStatus)}`}>
              ✓ {article.verificationStatus} REPORT
            </span>
            <h1 className="font-display text-lg font-black text-white sm:text-2xl lg:text-3xl leading-snug drop-shadow-md">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main detail split */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* News Article coverage left column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Article Header Metadata panel */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-850 pb-4 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-zinc-650" />
                Published: {new Date(article.publishDate).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Source:
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-zinc-300 hover:text-red-500 inline-flex items-center gap-0.5"
                >
                  {article.sourceName}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyShareLink}
                className="flex items-center gap-1.5 rounded bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-805"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
              <button
                onClick={() => toggleBookmark(article.id)}
                className={`flex items-center gap-1.5 rounded border px-3 py-1.5 font-bold uppercase transition-colors ${
                  isBookmarked
                    ? "bg-red-950/30 text-red-500 border-red-900/40"
                    : "bg-zinc-900 hover:bg-zinc-805 text-zinc-300 border-zinc-800"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                {isBookmarked ? "Vetted Bookmarked" : "Bookmark"}
              </button>
            </div>
          </div>

          {/* Article formatted content */}
          <section className="text-zinc-300 text-sm leading-relaxed space-y-4 font-light select-text">
            {article.content.split("\n\n").map((para, i) => {
              if (para.startsWith("###")) {
                const title = para.replace("###", "").trim();
                return <h3 key={i} className="text-sm font-bold tracking-tight text-white uppercase font-mono mt-6 mb-2 border-l-2 border-red-650 pl-2">{title}</h3>;
              }
              if (para.startsWith("-") || para.startsWith("*")) {
                const items = para.split("\n");
                return (
                  <ul key={i} className="list-disc pl-5 py-1.5 space-y-1 text-zinc-450 text-xs">
                    {items.map((item, idx) => (
                      <li key={idx}>{item.replace(/^[-*]\s*/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{para}</p>;
            })}
          </section>

          {/* Verification Audit Statement block */}
          <div className="rounded-xl border border-dashed border-zinc-805 bg-zinc-950 p-5 mt-8 space-y-2.5">
            <h4 className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono">
              <Award className="h-4.5 w-4.5 text-emerald-400" />
              Information Accuracy Audit Report
            </h4>
            <div className="text-xs text-zinc-450 space-y-2 leading-relaxed font-light">
              <p>
                Our system verified this file automatically against official indices. This report enjoys a **{article.trustScore}% Vetting Quality Grade**, placing it in the <span className="text-emerald-400 font-bold font-mono uppercase">{article.verificationStatus}</span> segment of our platform.
              </p>
              <p>
                To avoid rumors, we enforce strict compliance. If you believe this article links to unconfirmed spoilers or mistranslated claims, flag this card above to schedule live moderator analysis.
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic MAL + AniList Metadata Sidebar right column */}
        <div className="space-y-6">
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 shadow-sm space-y-4">
            
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2 font-mono">
              <Activity className="h-4.5 w-4.5 text-red-500 animate-pulse" />
              Anime Intelligence Node
            </h3>

            {loadingMedia ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-500 text-xs">
                <Loader2 className="h-5 w-5 animate-spin text-red-650" />
                <span>Interrogating Jikan & AniList...</span>
              </div>
            ) : coverImage ? (
              <div className="space-y-4">
                
                {/* Visual poster preview */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-zinc-800 border border-zinc-850">
                  <img
                    src={coverImage}
                    alt={article.animeTitle || article.title}
                    className="h-full w-full object-cover"
                  />
                  {anilistDetails?.averageScore && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-zinc-950/80 px-2 py-1 text-xs font-bold text-amber-400 font-mono">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {anilistDetails.averageScore}%
                    </div>
                  )}
                </div>

                {/* Metadata specifications */}
                <div className="space-y-2.5 text-xs font-medium">
                  <div>
                    <span className="block text-[10px] text-zinc-550 uppercase tracking-widest font-mono">NAME:</span>
                    <span className="text-zinc-200 font-bold">{article.animeTitle || anilistDetails?.title?.english || malDetails?.title_english || "Unspecified Anime"}</span>
                  </div>

                  {anilistDetails?.studios?.nodes?.length > 0 && (
                    <div>
                      <span className="block text-[10px] text-zinc-550 uppercase tracking-widest font-mono">STUDIO:</span>
                      <span className="text-zinc-300">{anilistDetails.studios.nodes[0].name}</span>
                    </div>
                  )}

                  {malDetails?.episodes && (
                    <div>
                      <span className="block text-[10px] text-zinc-550 uppercase tracking-widest font-mono">FORMAT / LENGTH:</span>
                      <span className="text-zinc-400">{malDetails.type || "TV"} — {malDetails.episodes} episodes</span>
                    </div>
                  )}

                  {malDetails?.status && (
                    <div>
                      <span className="block text-[10px] text-zinc-550 uppercase tracking-widest font-mono">MAL RUN STATUS:</span>
                      <span className="text-zinc-400 font-mono uppercase text-[11px]">{malDetails.status}</span>
                    </div>
                  )}

                  {anilistDetails?.genres && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {anilistDetails.genres.slice(0, 3).map((g: string) => (
                        <span key={g} className="rounded bg-zinc-950 border border-zinc-900 px-1.5 py-0.5 text-[9px] text-zinc-400 uppercase font-mono">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct MAL External Redirect Link */}
                {malDetails?.url && (
                  <a
                    href={malDetails.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-xs text-zinc-200 py-2 transition-all uppercase font-semibold"
                  >
                    View MAL Profile
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

              </div>
            ) : (
              <div className="text-center py-8 text-zinc-550 text-xs">
                <p>No associated MAL metadata linked.</p>
              </div>
            )}

          </div>

        </div>

      </div>

      {copiedLink && (
        <span className="fixed bottom-4 right-4 bg-zinc-900 text-red-500 text-xs font-mono font-bold px-3 py-1.5 rounded border border-red-500/30 shadow-2xl select-none uppercase transition-all">
          Vetted share link copied successfully
        </span>
      )}

    </div>
  );
};
