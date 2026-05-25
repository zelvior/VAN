/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { ShieldCheck, Flame, BookOpen, AlertTriangle, BadgeCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const TrendingSidebar: React.FC = () => {
  const { sources } = useApp();
  const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Fetch top anime from Jikan mal database directly
  useEffect(() => {
    let active = true;
    const fetchTrending = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/top/anime?limit=5");
        if (res.ok) {
          const json = await res.json();
          if (active && json.data) {
            setTrendingAnime(json.data.slice(0, 5));
          }
        }
      } catch (err) {
        console.warn("Could not fetch top anime from Jikan for sidebar:", err);
      } finally {
        if (active) setLoadingTrending(false);
      }
    };
    fetchTrending();
    return () => { active = false; };
  }, []);

  return (
    <aside className="space-y-6">
      
      {/* 1. VAN Credibility Mission */}
      <div className="glass p-5 shadow-sm">
        <div className="flex items-center gap-2 text-brand-red mb-3">
          <BadgeCheck className="h-5 w-5" />
          <h3 className="font-display text-sm font-bold tracking-tight uppercase text-white">
            Anti-Rumor Integrity
          </h3>
        </div>
        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
          VAN is an elite anime intelligence platform that aggregates news while rejecting speculative hearsay. Trust Scores are procedurally generated based on official producer signatures, committee press filing verification, and established media reports.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="rounded bg-[#050505]/60 p-2 border border-white/8">
            <span className="block font-bold text-emerald-400">90 - 100</span>
            <span className="text-zinc-500 uppercase">VERIFIED</span>
          </div>
          <div className="rounded bg-[#050505]/60 p-2 border border-white/8">
            <span className="block font-bold text-cyan-400">70 - 89</span>
            <span className="text-zinc-500 uppercase">TRUSTED</span>
          </div>
        </div>
      </div>

      {/* 2. Trending Anime (Jikan Live Integration) */}
      <div className="glass p-5 shadow-sm">
        <div className="flex items-center gap-2 text-orange-400 mb-3.5">
          <Flame className="h-4 w-4" />
          <h3 className="font-display text-sm font-bold tracking-tight uppercase text-white">
            Trending Anime Index
          </h3>
        </div>

        {loadingTrending ? (
          <div className="flex items-center justify-center py-6 text-zinc-550 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Connecting MAL database...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {trendingAnime.map((anime: any, index: number) => (
              <a
                key={anime.mal_id}
                href={anime.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-lg p-1.5 hover:bg-white/[0.04] transition-colors"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded bg-zinc-800">
                  <img
                    src={anime.images?.jpg?.image_url}
                    alt={anime.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute top-0 left-0 flex h-4 w-4 items-center justify-center bg-zinc-950 text-[10px] font-bold text-red-500">
                    {index + 1}
                  </span>
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="truncate text-xs font-semibold text-zinc-200 group-hover:text-red-500 transition-colors">
                    {anime.title_english || anime.title}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Score: {anime.score} | Vol: {anime.members?.toLocaleString()}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* 3. Publisher Vetting Scorecard */}
      <div className="glass p-5 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-400 mb-3.5 border-b border-zinc-805 pb-2">
          <ShieldCheck className="h-4 w-4" />
          <h3 className="font-display text-sm font-bold tracking-tight uppercase text-white">
            Verified Source Scores
          </h3>
        </div>
        
        <div className="space-y-3">
          {sources.slice(0, 6).map((s) => (
            <div key={s.id} className="flex items-center justify-between text-xs">
              <a 
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-zinc-300 hover:text-red-400 truncate pr-2 max-w-[150px]"
              >
                {s.name}
              </a>
              <div className="flex items-center gap-2">
                <span className="text-[10px] rounded bg-zinc-950 px-1 font-mono uppercase text-zinc-500">
                  {s.type}
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {s.credibilityScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </aside>
  );
};
