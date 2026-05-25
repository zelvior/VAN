/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./views/Home";
import { VerifiedFeed } from "./views/VerifiedFeed";
import { AnimeDetails } from "./views/AnimeDetails";
import { About } from "./views/About";

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-[#050505] tech-grid text-zinc-100 flex flex-col font-sans transition-colors duration-200">
          
          {/* Global responsive glassheader */}
          <Navbar />

          {/* Main layout frame */}
          <main className="flex-grow">
            <Routes>
              {/* Core User space routes */}
              <Route path="/" element={<Home />} />
              <Route path="/verified" element={<VerifiedFeed />} />
              <Route path="/trending" element={<Home />} /> {/* Routed directly with custom trending highlights on Home */}
              <Route path="/news/:id" element={<AnimeDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/bookmarks" element={<About />} /> {/* Bookmarks reside on personal user space tab in About */}
              
              {/* Path safety redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global footer copyright with bento stats telemetry */}
          <footer className="border-t border-white/8 bg-[#050505]/80 py-6 text-center text-[10px] text-zinc-500 font-mono uppercase tracking-widest backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-4 italic opacity-60">
                <div>© 2026 VAN_INTEL_SYSTEM</div>
                <div>•</div>
                <div>LOC: TOKYO_DATA_HUB</div>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span>SYSTEM UPTIME: 99.9%</span>
                <span className="mx-2 opacity-30">|</span>
                <span>ENCRYPTION: AES-256</span>
              </div>
            </div>
          </footer>

        </div>
      </HashRouter>
    </AppProvider>
  );
}
