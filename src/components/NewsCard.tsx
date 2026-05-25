/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { NewsArticle, VerificationStatus } from "../types";
import { ShieldCheck, ShieldAlert, Shield, Bookmark, AlertTriangle, ExternalLink, Calendar, Eye, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { bookmarks, toggleBookmark, createMisinformationReport, user } = useApp();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportedSuccessfully, setReportedSuccessfully] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isBookmarked = bookmarks.includes(article.id);

  // Status Badge configurations
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-950/40 px-2 py-1 text-xs font-bold text-emerald-400 border border-emerald-900/40">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            VERIFIED
          </span>
        );
      case VerificationStatus.TRUSTED:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-cyan-950/40 px-2 py-1 text-xs font-bold text-cyan-400 border border-cyan-900/40">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
            TRUSTED
          </span>
        );
      case VerificationStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-950/30 px-2 py-1 text-xs font-bold text-amber-500 border border-amber-900/30">
            <Shield className="h-3.5 w-3.5 text-amber-500" />
            PENDING
          </span>
        );
      case VerificationStatus.UNCONFIRMED:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-red-950/40 px-2 py-1 text-xs font-bold text-red-500 border border-red-900/40">
            <ShieldAlert className="h-3.5 w-3.5 text-red-500 animate-pulse" />
            RUMOR / UNCONFIRMED
          </span>
        );
    }
  };

  // Color coordinate based on Trust Scores
  const getTrustColorClass = (score: number) => {
    if (score >= 90) return "text-emerald-500 bg-emerald-950/30 border-emerald-800/40";
    if (score >= 70) return "text-cyan-500 bg-cyan-950/30 border-cyan-800/40";
    if (score >= 40) return "text-amber-500 bg-amber-950/30 border-amber-800/30";
    return "text-red-500 bg-red-950/30 border-red-800/40";
  };

  // Human date display
  const formatPublishDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (_) {
      return "Recent News";
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    try {
      await createMisinformationReport(article.id, article.title, reportReason);
      setReportedSuccessfully(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportedSuccessfully(false);
        setReportReason("");
      }, 2000);
    } catch (err) {
      console.error("Report process failed:", err);
    }
  };

  const shareLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const hashLink = `${window.location.origin}${window.location.pathname}#/news/${article.id}`;
    navigator.clipboard.writeText(hashLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article className="group relative flex flex-col md:flex-row gap-5 glass p-4 transition-all glow-card page-fade-in">
      
      {/* Article thumbnail */}
      <div className="relative w-full md:w-48 lg:w-56 h-36 shrink-0 overflow-hidden rounded-lg bg-zinc-800/50 border border-zinc-850">
        <img
          src={article.thumbnail || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop"}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        
        {/* News Category tag */}
        <span className="absolute bottom-2 left-2 rounded bg-zinc-950/80 border border-white/8 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-500 mono-label">
          {article.category}
        </span>
      </div>

      {/* Article Content Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Header metadata row */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-805 pb-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(article.verificationStatus)}
              <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-tight border ${getTrustColorClass(article.trustScore)}`}>
                Trust: {article.trustScore}%
              </div>
            </div>
            
            {/* Quick Bookmark Toggle & Share Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmark(article.id);
                }}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                  isBookmarked
                    ? "bg-red-950/30 text-red-500 border-red-900/40"
                    : "bg-zinc-950/55 text-zinc-400 border-zinc-800/50 hover:text-white"
                }`}
                title="Bookmark article"
              >
                <Bookmark className="h-3.5 w-3.5" fill={isBookmarked ? "currentColor" : "none"} />
              </button>
              
              <button
                onClick={shareLink}
                className="flex h-7 w-7 items-center justify-center rounded-lg border bg-zinc-950/55 text-zinc-400 border-zinc-800/50 hover:text-white transition-colors"
                title="Copy shareable link"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setReportModalOpen(true);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg border bg-zinc-950/55 text-zinc-400 border-zinc-800/50 hover:text-red-500 hover:border-red-900/30 transition-colors"
                title="Report rumor/misinformation"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Title with link */}
          <Link
            to={`/news/${article.id}`}
            className="block text-base font-bold tracking-tight text-white line-clamp-2 hover:text-red-500 transition-colors sm:text-lg"
          >
            {article.title}
          </Link>

          {/* Summary */}
          <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light">
            {article.summary}
          </p>

          {/* Bento Trust indicator */}
          <div className="mt-3.5 space-y-1">
            <div className="trust-bar">
              <div
                className={`trust-fill ${
                  article.trustScore >= 90
                    ? "bg-[#ff3e3e]"
                    : article.trustScore >= 70
                    ? "bg-cyan-500"
                    : article.trustScore >= 45
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${article.trustScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono opacity-50 uppercase tracking-wider">
              <span>TRUST INDEX</span>
              <span className="font-bold">{article.trustScore}/100</span>
            </div>
          </div>
        </div>

        {/* Footer info row */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-zinc-805/40 pt-2.5 text-[11px] text-zinc-500 font-medium">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-zinc-600" />
              {formatPublishDate(article.publishDate)}
            </span>
            <span className="text-zinc-700 font-light">|</span>
            <span className="flex items-center gap-1">
              Source:
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 font-bold text-zinc-300 hover:text-red-500"
              >
                {article.sourceName}
                <ExternalLink className="h-2.5 w-2.5 text-zinc-500" />
              </a>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {article.animeTitle && (
              <span className="rounded bg-zinc-850 px-1.5 py-0.5 text-[10px] text-zinc-300 border border-zinc-800">
                🏷️ {article.animeTitle}
              </span>
            )}
            <span className="flex items-center gap-0.5 text-zinc-600">
              <Eye className="h-3 w-3" />
              {article.views || 0}
            </span>
          </div>
        </div>
      </div>

      {copiedLink && (
        <span className="absolute top-2 right-2 bg-zinc-900 text-red-500 text-[10px] font-mono font-bold px-2 py-1 rounded border border-red-500/30 shadow-lg select-none">
          LINK COPIED
        </span>
      )}

      {/* Flag / Report Misinformation Dialog */}
      <AnimatePresence>
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-bold tracking-tight text-white uppercase mono-label">
                  Flag Information Accuracy
                </h3>
              </div>

              {reportedSuccessfully ? (
                <div className="text-center py-6">
                  <p className="text-sm font-bold text-emerald-400">
                    ✓ Rumor Flag Received Successfully!
                  </p>
                  <p className="mt-1 text-xs text-zinc-400 font-light">
                    Our platform administrators are reviewing this source link. Thank you for weeding out misinformation!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <span className="text-xs text-zinc-500">ARTICLE:</span>
                    <p className="text-xs font-semibold text-zinc-300 line-clamp-1">{article.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wider font-mono">
                      Reason for Report:
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Please clarify: does this cite rumors? Are source claims mistranslated? Is the publisher untrusted?"
                      className="w-full rounded-lg bg-zinc-950 p-2.5 text-xs text-zinc-200 border border-zinc-800 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReportModalOpen(false)}
                      className="rounded bg-zinc-800 px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-red-600 hover:bg-red-700 px-4 py-1.5 text-xs font-bold uppercase text-white shadow-lg"
                    >
                      Flag Article
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </article>
  );
};
