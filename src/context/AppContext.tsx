/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  addDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { db, auth, OperationType, handleFirestoreError } from "../lib/firebase";
import { NewsArticle, NewsSource, Ad, Report } from "../types";
import { DEFAULT_NEWS, DEFAULT_SOURCES } from "../data/defaultNews";

interface AppContextType {
  news: NewsArticle[];
  sources: NewsSource[];
  ads: Ad[];
  user: User | null;
  loading: boolean;
  theme: "dark" | "light";
  bookmarks: string[]; // List of article IDs
  history: { id: string; title: string; viewedAt: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  // Custom functions
  toggleTheme: () => void;
  toggleBookmark: (articleId: string) => void;
  addToHistory: (articleId: string, title: string) => void;
  clearHistory: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  createMisinformationReport: (articleId: string, articleTitle: string, reason: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [history, setHistory] = useState<{ id: string; title: string; viewedAt: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Load local state configurations (Theme, Bookmarks, History)
  useEffect(() => {
    const savedTheme = localStorage.getItem("van_theme") as "dark" | "light";
    if (savedTheme) setTheme(savedTheme);
    
    const savedBookmarks = localStorage.getItem("van_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (_) {}
    }

    const savedHistory = localStorage.getItem("van_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (_) {}
    }
  }, []);

  // Set visual class on HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  // Auth synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // 1. Core database subscription/listeners & Database Bootstrapping
  useEffect(() => {
    // Check if news collection is empty and seed default news if so
    const bootstrapDatabaseIfEmpty = async () => {
      const newsCollectionPath = "news";
      try {
        const querySnapshot = await getDocs(collection(db, newsCollectionPath));
        if (querySnapshot.empty) {
          console.log("VAN DB: News collection is empty. Bootstrapping mock data...");
          // Seed news
          for (const item of DEFAULT_NEWS) {
            await setDoc(doc(db, "news", item.id), item);
          }
          // Seed sources
          for (const s of DEFAULT_SOURCES) {
            await setDoc(doc(db, "sources", s.id), s);
          }
          console.log("VAN DB: Successfully bootstrapped core data into Firestore!");
        }
      } catch (err) {
        console.warn("Could not check/seed databases. Likely missing Firestore layout rules or client is offline:", err);
      }
    };

    bootstrapDatabaseIfEmpty();

    // Set up real-time sync listeners
    const newsUnsub = onSnapshot(collection(db, "news"), (snapshot) => {
      const articlesList: NewsArticle[] = [];
      snapshot.forEach((doc) => {
        articlesList.push({ id: doc.id, ...doc.data() } as NewsArticle);
      });
      // Sort in descending order of publishDate
      articlesList.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
      setNews(articlesList);
      setLoading(false);
    }, (error) => {
      console.warn("Reading news subscription restricted:", error);
      // Fallback to offline defaults so application works instantly without Firebase latency
      setNews(DEFAULT_NEWS);
      setLoading(false);
    });

    const sourcesUnsub = onSnapshot(collection(db, "sources"), (snapshot) => {
      const list: NewsSource[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as NewsSource);
      });
      setSources(list.length ? list : DEFAULT_SOURCES as NewsSource[]);
    }, (error) => {
      setSources(DEFAULT_SOURCES as NewsSource[]);
    });

    const adsUnsub = onSnapshot(collection(db, "ads"), (snapshot) => {
      const list: Ad[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Ad);
      });
      setAds(list);
    }, () => {});

    return () => {
      newsUnsub();
      sourcesUnsub();
      adsUnsub();
    };
  }, []);



  // Utility Actions
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("van_theme", nextTheme);
  };

  const toggleBookmark = (articleId: string) => {
    const isBookmarked = bookmarks.includes(articleId);
    let nextBookmarks: string[];
    if (isBookmarked) {
      nextBookmarks = bookmarks.filter((id) => id !== articleId);
    } else {
      nextBookmarks = [...bookmarks, articleId];
    }
    setBookmarks(nextBookmarks);
    localStorage.setItem("van_bookmarks", JSON.stringify(nextBookmarks));

    // Update bookmark count in Firestore if possible
    try {
      const article = news.find(n => n.id === articleId);
      if (article) {
        const articleRef = doc(db, "news", articleId);
        const count = Math.max(0, (article.bookmarksCount || 0) + (isBookmarked ? -1 : 1));
        updateDoc(articleRef, { bookmarksCount: count }).catch(() => {});
      }
    } catch (_) {}
  };

  const addToHistory = (articleId: string, title: string) => {
    const nextItem = { id: articleId, title, viewedAt: new Date().toISOString() };
    const filteredHistory = history.filter((h) => h.id !== articleId);
    const nextHistory = [nextItem, ...filteredHistory].slice(0, 50); // CAP at 50 history entries
    setHistory(nextHistory);
    localStorage.setItem("van_history", JSON.stringify(nextHistory));

    // Increments view count in Firestore
    try {
      const article = news.find(n => n.id === articleId);
      if (article) {
        const articleRef = doc(db, "news", articleId);
        updateDoc(articleRef, { views: (article.views || 0) + 1 }).catch(() => {});
      }
    } catch (_) {}
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("van_history");
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Popup credentials error:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };



  const createMisinformationReport = async (articleId: string, articleTitle: string, reason: string) => {
    const reportId = `report_${Date.now()}`;
    const cleanReport: Report = {
      id: reportId,
      articleId,
      articleTitle,
      reason,
      reportedBy: user?.email || "Anonymous user",
      createdAt: new Date().toISOString(),
      status: "PENDING",
    };

    try {
      await setDoc(doc(db, "reports", reportId), cleanReport);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `reports/${reportId}`);
    }
  };



  return (
    <AppContext.Provider
      value={{
        news,
        sources,
        ads,
        user,
        loading,
        theme,
        bookmarks,
        history,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toggleTheme,
        toggleBookmark,
        addToHistory,
        clearHistory,
        loginWithGoogle,
        logout,
        createMisinformationReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside an AppProvider context scope.");
  return context;
};
