/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { VerificationStatus } from "../types";
import { NewsCard } from "../components/NewsCard";
import { ShieldCheck, CheckCircle2, Award, BadgeAlert, Sparkles } from "lucide-react";

export const VerifiedFeed: React.FC = () => {
  const { news, loading } = useApp();

  // Filter to show only high-confidence "VERIFIED" or "TRUSTED" articles
  const verifiedNews = news.filter(
    (a) =>
      a.verificationStatus === VerificationStatus.VERIFIED ||
      a.verificationStatus === VerificationStatus.TRUSTED
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 page-fade-in">
      
      {/* Editorial Header Mission */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 mb-8 relative overflow-hidden">
        {/* Abstract futuristic geometry design overlay */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-650/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-red-650/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-white uppercase tracking-tight sm:text-3xl">
                Verified News Desk
              </h1>
              <p className="text-xs text-zinc-500 font-mono mt-0.5 tracking-tight">
                PROVEN ANNOUNCEMENTS & COMMITTEE FILINGS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded bg-emerald-950/20 px-3 py-1.5 text-xs text-emerald-400 border border-emerald-900/30 font-mono uppercase">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Curated Strict Channel
          </div>
        </div>

        {/* Informative Vetting Guidelines list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 font-bold text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              Official Press Vetting
            </span>
            <p className="text-zinc-550 font-light leading-relaxed">
              Every card linked here originates from official production committees, verified directors, or studio PR accounts.
            </p>
          </div>
          
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 font-bold text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              Double Source Corroboration
            </span>
            <p className="text-zinc-550 font-light leading-relaxed">
              We mandate overlapping verification parameters across multiple trusted publication networks prior to flag clearance.
            </p>
          </div>

          <div className="space-y-1">
            <span className="flex items-center gap-1.5 font-bold text-zinc-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              Zero Rumor Threshold
            </span>
            <p className="text-zinc-550 font-light leading-relaxed">
              Gossip, social media leaks, un-vetted translations, or fan speculation are block-filtered to combat clutter.
            </p>
          </div>
        </div>

      </div>

      {/* Verified Feed List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-32 rounded bg-zinc-900 animate-pulse"></div>
            <div className="h-32 rounded bg-zinc-900 animate-pulse"></div>
          </div>
        ) : verifiedNews.length > 0 ? (
          <div className="space-y-4">
            {verifiedNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-850 py-16 text-center">
            <BadgeAlert className="mx-auto h-12 w-12 text-zinc-700 animate-bounce" />
            <h3 className="mt-4 text-sm font-bold tracking-tight text-white uppercase mono-label">
              No authenticated news items found
            </h3>
            <p className="mt-1 text-xs text-zinc-500 font-light">
              We are currently vetting live press channels. Connect in a few moments to view new cleared items.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
