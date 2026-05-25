/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { NewsCategory } from "../types";
import { NewsCard } from "../components/NewsCard";
import { TrendingSidebar } from "../components/TrendingSidebar";
import { NewsCardSkeleton } from "../components/Skeleton";
import { Radio, Heart, Filter, MessageSquareCode, ShieldAlert, Award, Star } from "lucide-react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  const { news, loading, searchQuery, selectedCategory, setSelectedCategory } = useApp();
  const [trustThreshold, setTrustThreshold] = useState<number>(0);

  // Filter Articles based on Category, Search Query, and Trust Score threshold
  const filteredNews = news.filter((article) => {
    // 1. Theme and category filter
    const matchesCategory = selectedCategory === "ALL" || article.category === selectedCategory;
    
    // 2. Search Query filter (matches title, summary, animeTitle or tags)
    const matchesSearch = 
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.animeTitle && article.animeTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (article.tags && article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    // 3. Trust score filter
    const matchesTrust = article.trustScore >= trustThreshold;

    return matchesCategory && matchesSearch && matchesTrust;
  });

  // Pick the top-vetted verified article for the Editorial Hero Banner
  const heroArticle = news.find(
    (a) => a.trustScore >= 95 && a.thumbnail
  ) || news[0];

  const categories = ["ALL", ...Object.values(NewsCategory)];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 page-fade-in">
      
      {/* 1. Hero Editorial Spotlight */}
      {heroArticle && !searchQuery && selectedCategory === "ALL" && (
        <section className="mb-8 overflow-hidden glass shadow-xl">
          <div className="relative flex flex-col lg:flex-row">
            {/* Image banner */}
            <div className="relative h-64 w-full shrink-0 lg:h-96 lg:w-[500px] xl:w-[600px]">
              <img
                src={heroArticle.thumbnail}
                alt={heroArticle.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#050505]/95"></div>
              
              <span className="absolute top-4 left-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-red-950/60 animate-pulse">
                FEATURED REPORT
              </span>
            </div>

            {/* Editorial writeup */}
            <div className="flex flex-1 flex-col justify-center p-6 lg:p-10 lg:pl-4 bg-[#050505]/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded bg-emerald-950/40 px-2.5 py-1 text-xs font-black text-emerald-400 border border-emerald-900/40 uppercase">
                  ✓ VERIFIED NEWS SOURCE
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  Trust Quality: {heroArticle.trustScore}%
                </span>
              </div>

              <h2 className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-3xl leading-snug">
                <Link to={`/news/${heroArticle.id}`} className="hover:text-red-500 transition-colors">
                  {heroArticle.title}
                </Link>
              </h2>

              <p className="mt-3 text-zinc-400 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                {heroArticle.summary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  to={`/news/${heroArticle.id}`}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-tight text-white hover:bg-red-700 transition-all shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                >
                  Read Verified Coverage
                </Link>
                <a
                  href={heroArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Source: {heroArticle.sourceName}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Main content split viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* News Feed left pane */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Filters shelf */}
          <div className="glass p-4 space-y-3 shadow-md">
            
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              <Filter className="h-4 w-4 shrink-0 text-zinc-500" />
              <div className="flex gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded px-2.5 py-1 text-xs uppercase font-mono tracking-tight font-medium transition-colors shrink-0 ${
                      selectedCategory === cat
                        ? "bg-red-600 text-white"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Threshold Filter slide */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-900 pt-3 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Filter by Verification Grade:</span>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="10"
                  value={trustThreshold}
                  onChange={(e) => setTrustThreshold(Number(e.target.value))}
                  className="h-1.5 w-32 cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-red-600 focus:outline-none"
                />
                <span className="font-mono font-bold text-red-500 uppercase">
                  {trustThreshold === 0 ? "No Min Score" : `Score >= ${trustThreshold}%`}
                </span>
                {trustThreshold > 0 && (
                  <button
                    onClick={() => setTrustThreshold(0)}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 underline font-mono uppercase"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Render feed */}
          {loading ? (
            <div className="space-y-4">
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="space-y-4">
              {filteredNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-800 py-16 text-center">
              <ShieldAlert className="mx-auto h-12 w-12 text-zinc-700 animate-bounce" />
              <h3 className="mt-4 text-sm font-bold tracking-tight text-white uppercase mono-label">
                No articles matching search
              </h3>
              <p className="mt-1 text-xs text-zinc-500 font-light max-w-sm mx-auto">
                No verified announcements found under this criterion. Try resetting your credit constraints or category filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setTrustThreshold(0);
                }}
                className="mt-4 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-1.5 text-xs text-red-400 uppercase font-mono"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>

        {/* Trending sidebar right pane */}
        <div className="lg:col-span-4">
          <TrendingSidebar />
        </div>

      </div>
    </div>
  );
};
