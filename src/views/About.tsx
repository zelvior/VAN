/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Trash2, 
  History, 
  Bookmark, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,
  Info
} from "lucide-react";

export const About: React.FC = () => {
  const { bookmarks, history, clearHistory, news } = useApp();

  // Map the bookmark IDs to actual news articles
  const bookmarkedArticles = news.filter((art) => bookmarks.includes(art.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 page-fade-in space-y-10">
      
      {/* 1. Brand Mission Statement */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 border-b border-zinc-900 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10 text-red-500 border border-red-900/40">
            <Info className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-white uppercase tracking-tight sm:text-2xl">
              About Verified Anime News
            </h1>
            <p className="text-[10px] text-zinc-550 font-mono tracking-wider">NO RUMORS. ONLY SOURCES.</p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 font-light leading-relaxed">
          The anime community is consistently plagued by unverified leaks, mistranslated interviews, and speculative blog rumors passed off as factual reporting. **VAN (Verified Anime News)** changes that. We operate as an elite curation system that parses RSS feeds, aggregates community press rooms, and cross-references Jikan (MAL) and AniList records.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="rounded-xl bg-zinc-900/40 p-4 border border-zinc-850">
            <h3 className="font-semibold text-xs text-white uppercase tracking-wide flex items-center gap-1.5 font-mono">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              Source-Quality Verification
            </h3>
            <p className="mt-2 text-xs text-zinc-405 leading-relaxed font-light">
              Articles submitted to VAN require direct source validation. Backends verify the publisher's origin domain (Crunchyroll, Natalie, or official studio PR accounts) before allocating quality percentages.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900/40 p-4 border border-zinc-850">
            <h3 className="font-semibold text-xs text-white uppercase tracking-wide flex items-center gap-1.5 font-mono">
              <CheckCircle className="h-4.5 w-4.5 text-cyan-400" />
              Client-First Performance
            </h3>
            <p className="mt-2 text-xs text-zinc-405 leading-relaxed font-light">
              We leverage Client-Side parsing, on-device caching, and standard Web Storage to load news dynamically, optimized for low-end mobile systems.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Personalized Panel Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bookmarks Display */}
        <section className="rounded-xl border border-zinc-805 bg-zinc-900/10 p-5 space-y-4">
          <h3 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2.5 font-mono">
            <span className="flex items-center gap-1.5">
              <Bookmark className="h-4 w-4 text-red-500" />
              Your Saved Coverage ({bookmarks.length})
            </span>
          </h3>

          {bookmarkedArticles.length > 0 ? (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {bookmarkedArticles.map((art) => (
                <Link
                  key={art.id}
                  to={`/news/${art.id}`}
                  className="group flex items-center justify-between rounded-lg bg-zinc-950 p-2.5 border border-zinc-900 hover:border-red-650/40 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="truncate block text-xs font-semibold text-zinc-200 group-hover:text-red-500 transition-colors">
                      {art.title}
                    </span>
                    <span className="text-[10px] text-zinc-550 font-mono">
                      Source: {art.sourceName} | Grade: {art.trustScore}%
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 shrink-0 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-xs text-zinc-500 font-light">
              No bookmarked coverage yet. Click the bookmark flag on any news card to save.
            </p>
          )}
        </section>

        {/* Reading History Display */}
        <section className="rounded-xl border border-zinc-805 bg-zinc-900/10 p-5 space-y-4">
          <h3 className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white border-b border-zinc-800 pb-2.5 font-mono">
            <span className="flex items-center gap-1.5">
              <History className="h-4 w-4 text-orange-400" />
              On-Device History ({history.length})
            </span>
            
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-zinc-500 hover:text-red-500 flex items-center gap-0.5 font-sans capitalize"
              >
                <Trash2 className="h-3 w-3" />
                ForgetTime
              </button>
            )}
          </h3>

          {history.length > 0 ? (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {history.map((hist) => (
                <Link
                  key={`${hist.id}-${hist.viewedAt}`}
                  to={`/news/${hist.id}`}
                  className="group flex items-center justify-between rounded-lg bg-zinc-950 p-2.5 border border-zinc-900 hover:border-red-650/40 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <span className="truncate block text-xs font-semibold text-zinc-200 group-hover:text-red-500 transition-colors">
                      {hist.title}
                    </span>
                    <span className="text-[10px] text-zinc-550 font-mono">
                      Viewed: {new Date(hist.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-xs text-zinc-500 font-light">
              Your recent readings will list here.
            </p>
          )}
        </section>

      </div>

    </div>
  );
};
