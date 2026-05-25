/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-5 rounded-xl border border-zinc-800/40 bg-zinc-900/10 p-4 animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="w-full md:w-48 lg:w-56 h-36 shrink-0 rounded-lg bg-zinc-800/60"></div>

      {/* Main body placeholder */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="space-y-3">
          {/* Tag row */}
          <div className="flex gap-2">
            <div className="h-5 w-20 rounded bg-zinc-800/60"></div>
            <div className="h-5 w-16 rounded bg-zinc-800/60"></div>
          </div>
          {/* Title line */}
          <div className="h-5 w-3/4 rounded bg-zinc-800/80"></div>
          <div className="h-4 w-1/2 rounded bg-zinc-800/40"></div>
        </div>

        {/* Footer info row */}
        <div className="flex items-center justify-between gap-2.5 border-t border-zinc-805/40 pt-2.5 mt-4">
          <div className="h-4 w-32 rounded bg-zinc-800/30"></div>
          <div className="h-4 w-12 rounded bg-zinc-800/30"></div>
        </div>
      </div>
    </div>
  );
};

export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 animate-pulse">
      <div className="h-5 w-32 rounded bg-zinc-800/80"></div>
      <div className="space-y-3 pt-2">
        <div className="h-4 w-full rounded bg-zinc-800/50"></div>
        <div className="h-4 w-5/6 rounded bg-zinc-800/40"></div>
        <div className="h-4 w-2/3 rounded bg-zinc-800/30"></div>
      </div>
    </div>
  );
};
