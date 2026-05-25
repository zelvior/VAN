/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  ShieldCheck, 
  Search, 
  Bookmark, 
  History, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut,
  Info,
  Flame,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Navbar: React.FC = () => {
  const { 
    user, 
    theme, 
    toggleTheme, 
    bookmarks, 
    searchQuery, 
    setSearchQuery,
    loginWithGoogle,
    logout 
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && location.hash === "#/") return true;
    return location.hash.startsWith(`#${path}`) || location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-display text-xl font-bold tracking-tighter text-white uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            V
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
              VAN
            </span>
            <span className="mono-label hidden text-[9px] uppercase tracking-widest text-zinc-400 sm:block">
              Verified Anime News
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:ml-6 md:flex md:items-center md:gap-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/") && !isActive("/verified") && !isActive("/trending")
                ? "bg-zinc-900 text-red-500"
                : "text-zinc-300 hover:bg-zinc-900/50 hover:text-white"
            }`}
          >
            <Clock className="h-4 w-4" />
            Latest
          </Link>
          <Link
            to="/verified"
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/verified")
                ? "bg-zinc-900 text-red-500"
                : "text-zinc-300 hover:bg-zinc-900/50 hover:text-white"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Verified
          </Link>
          <Link
            to="/trending"
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/trending")
                ? "bg-zinc-900 text-red-500"
                : "text-zinc-300 hover:bg-zinc-900/50 hover:text-white"
            }`}
          >
            <Flame className="h-4 w-4 text-orange-400" />
            Trending
          </Link>
          <Link
            to="/about"
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/about")
                ? "bg-zinc-900 text-red-500"
                : "text-zinc-300 hover:bg-zinc-900/50 hover:text-white"
            }`}
          >
            <Info className="h-4 w-4" />
            About VAN
          </Link>
        </nav>

        {/* Actions Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Search Input Trigger */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Vetted search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 xl:w-64 rounded-lg bg-zinc-900 py-1.5 pl-9 pr-4 text-xs text-white placeholder-zinc-500 border border-zinc-800 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all uppercase font-medium"
            />
          </form>

          {/* Mobile Search toggler */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 sm:hidden hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Bookmarks Counter */}
          <Link
            to="/bookmarks"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <Bookmark className="h-4 w-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 font-mono text-[9px] font-bold text-white uppercase animate-pulse">
                {bookmarks.length}
              </span>
            )}
          </Link>



          {/* Authentication State */}
          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.email}`}
                alt="user profile"
                className="h-8 w-8 rounded-full border border-zinc-700 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={logout}
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-red-500 hover:bg-zinc-800 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-tight text-white hover:bg-red-700 transition-all shadow-[0_4px_10px_rgba(239,68,68,0.2)] md:px-4 md:py-2"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 md:hidden hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Slide-down Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-zinc-900/90 border-t border-zinc-800/80 px-4 py-3 sm:hidden"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search vetted database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 py-2 pl-9 pr-4 text-xs text-white border border-zinc-800 focus:outline-none focus:border-red-600"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute left-0 right-0 z-40 border-b border-zinc-850 bg-zinc-950 px-4 pt-2 pb-6 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive("/") && !isActive("/verified") && !isActive("/trending") ? "bg-zinc-900 text-red-500" : "text-zinc-300"
                }`}
              >
                <Clock className="h-4 w-4" />
                Latest News Feed
              </Link>
              <Link
                to="/verified"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive("/verified") ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30" : "text-zinc-300"
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Verified News Desk
              </Link>
              <Link
                to="/trending"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive("/trending") ? "bg-orange-950/20 text-orange-400 border border-orange-900/20" : "text-zinc-300"
                }`}
              >
                <Flame className="h-4 w-4 text-orange-400" />
                Trending Intelligence
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive("/about") ? "bg-zinc-900 text-red-500" : "text-zinc-300"
                }`}
              >
                <Info className="h-4 w-4" />
                About VAN
              </Link>



              {user && (
                <div className="flex items-center justify-between border-t border-zinc-905 pt-4 mt-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.photoURL || ""}
                      alt="user"
                      className="h-8 w-8 rounded-full border border-zinc-700"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-white">{user.displayName}</span>
                      <span className="text-[10px] text-zinc-500">{user.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
