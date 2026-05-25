/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NewsArticle, VerificationStatus, NewsCategory } from "../types";

export const DEFAULT_SOURCES = [
  {
    id: "source_crunchyroll",
    name: "Crunchyroll News",
    url: "https://www.crunchyroll.com/news",
    credibilityScore: 98,
    type: "OFFICIAL",
    isTrusted: true
  },
  {
    id: "source_ann",
    name: "Anime News Network",
    url: "https://www.animenewsnetwork.com",
    credibilityScore: 95,
    type: "NEWS_OUTLET",
    isTrusted: true
  },
  {
    id: "source_natalie",
    name: "Comic Natalie",
    url: "https://natalie.mu/comic",
    credibilityScore: 100,
    type: "OFFICIAL",
    isTrusted: true
  },
  {
    id: "source_ufotable",
    name: "ufotable Official X",
    url: "https://x.com/ufotable",
    credibilityScore: 100,
    type: "OFFICIAL",
    isTrusted: true
  },
  {
    id: "source_twitter_mappa",
    name: "MAPPA PR Account",
    url: "https://x.com/MAPPA_Info",
    credibilityScore: 98,
    type: "OFFICIAL",
    isTrusted: true
  }
];

export const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: "ann_cs_movie_reze",
    title: "Chainsaw Man Movie: Reze-hen Official Adaptation Announced by MAPPA",
    summary: "Studio MAPPA has formally announced that the sequel arc of the hit dark-fantasy anime will be adapted as a feature film, debuting worldwide soon with a brand new trailer.",
    content: `During the MAPPA Stage Event, the production committee officially unveiled **Chainsaw Man Movie: Reze-hen** (The Reze Arc / Bomb Girl Arc). This theatrical sequel will directly continue the story from the 12th episode of the television series.

The teaser trailer showcases Reze, a mysterious girl voiced by Reina Ueda, meeting Denji in a rainy phone booth. Studio MAPPA confirmed that Key Staff from Season 1, including action director Tatsuya Yoshihara, are returning for the movie.

### Production Authentication Details:
- **Production Studio:** MAPPA
- **Distribution Partner:** TOHO Animation / Crunchyroll
- **Core Cast:** Toya Kikunosuke (Denji), Reina Ueda (Reze)
- **Primary Source:** MAPPA Stage Webcast & Official PR Site.`,
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop", // anime wall mock art
    trustScore: 98,
    verificationStatus: VerificationStatus.VERIFIED,
    publishDate: "2026-05-25T12:00:00Z",
    sourceName: "Comic Natalie",
    sourceUrl: "https://natalie.mu/comic",
    animeId: "56133", // MAL ID for Chainsaw Man movie
    animeTitle: "Chainsaw Man Movie: Reze-hen",
    category: NewsCategory.TRAILER,
    isOfficial: true,
    tags: ["MAPPA", "Chainsaw Man", "Movie", "Reze-hen"],
    views: 1250,
    bookmarksCount: 220
  },
  {
    id: "cr_demon_slayer_trilogy",
    title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle Arc to Be Adapted as Movie Trilogy",
    summary: "ufotable and Aniplex confirm the final climatic battle against Muzan Kibutsuji will premiere globally in cinemas as a massive trilogy of feature films.",
    content: `Aniplex and Crunchyroll announced they have acquired the theatrical rights to the final arc of **Demon Slayer: Kimetsu no Yaiba**. Instead of a TV series broadcast, the **Infinity Castle Arc (Mugen Jo-hen)** will be adapted as a trilogy of theatrical movies.

According to ufotable, the three feature films will cover the entire final battles between the Hashira, Tanjiro's fellowship, and Muzan's remaining Upper Rank demons inside Nakime's shifting fortress space.

### Official Statements & Timelines:
Crunchyroll's CEO reported: *"Demon Slayer has been a monumental franchise, and we are ecstatic to deliver the climax as three epic cinematic blockbusters that fans can experience together."*

**Source Vetting Report:**
- **Source URL:** Aniplex America Newsroom and ufotable Tokyo Studio filings.
- **Vetting Grade:** 100/100 (Direct press release with simultaneous international localization).`,
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    trustScore: 100,
    verificationStatus: VerificationStatus.VERIFIED,
    publishDate: "2026-05-24T08:30:00Z",
    sourceName: "Aniplex Press Office",
    sourceUrl: "https://aniplex.com/news",
    animeId: "58933", // Infinity Castle MAL ID
    animeTitle: "Demon Slayer: Kimetsu no Yaiba - Infinity Castle Arc",
    category: NewsCategory.ANNOUNCEMENT,
    isOfficial: true,
    tags: ["ufotable", "Demon Slayer", "Infinity Castle", "Trilogy"],
    views: 3105,
    bookmarksCount: 654
  },
  {
    id: "ann_gundam_requiem",
    title: "Mobile Suit Gundam: Requiem for Vengeance Worldwide Premiere Date Locked",
    summary: "Sunrise and Netflix reveal the official final trailer and verified release date of the completely CGI-animated Gundam series set during the One Year War era.",
    content: `Netflix and Bandai Namco Filmworks (Sunrise) have released a gorgeous widescreen cinematic trailer for **Mobile Suit Gundam: Requiem for Vengeance**, lock-scheduling the international release on Netflix.

The series is entirely built inside Unreal Engine 5, directed by Erasmus Brosdau (The Lord Inquisitor), and written by Gavin Hignight (Tekken: Bloodline). It tells a gritty story from the perspective of Zeon's soldiers during the battle of Northern Europe.

### Technical & Casting Specifications:
- **Engine Platform:** Unreal Engine 5 (UE5)
- **Principal Actor:** Celia Massingham as Iria Solari
- **Producer:** Sunrise / Safehouse Co.`,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop",
    trustScore: 92,
    verificationStatus: VerificationStatus.VERIFIED,
    publishDate: "2026-05-20T14:45:00Z",
    sourceName: "Anime News Network",
    sourceUrl: "https://www.animenewsnetwork.com",
    animeId: "54952",
    animeTitle: "Mobile Suit Gundam: Requiem for Vengeance",
    category: NewsCategory.RELEASE,
    isOfficial: true,
    tags: ["Sunrise", "Gundam", "Netflix", "CGI"],
    views: 840,
    bookmarksCount: 95
  },
  {
    id: "rumor_one_piece_remake_episode",
    title: "WIT Studio One Piece Remake 'The One Piece' Rumored to Cover East Blue in 25 Episodes",
    summary: "Unverified leaks circulating among Chinese social media suggest the collaborative project between WIT Studio and Netflix is pacing around 25 episodes for the East Blue Arc.",
    content: `An unconfirmed leak published on Weibo and echoed by anime news bloggers suggests that Netflix's highly anticipated remake **The One Piece**, produced by **WIT Studio**, will be structured into a single 25-episode season to adapt the entire East Blue Arc with enhanced story pacing.

### Rumor Vetting Analysis:
- **Alleged Source:** Chinese weibo account with historical 50% leak accuracy.
- **Corroborating Links:** None. Both Shueisha, WIT Studio, and Netflix have refused to provide comments.
- **VAN Vetting Verdict:** **UNCONFIRMED / RUMOR**. 
Users are strictly advised that episode pacing calculations are speculative. At VAN, we do not post speculation as fact.`,
    thumbnail: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=600&auto=format&fit=crop",
    trustScore: 35,
    verificationStatus: VerificationStatus.UNCONFIRMED,
    publishDate: "2026-05-25T21:10:00Z",
    sourceName: "Weibo Anime Leaks",
    sourceUrl: "https://weibo.com",
    animeId: "57512", // The One Piece Remake MAL
    animeTitle: "The One Piece (Remake)",
    category: NewsCategory.RUMOR,
    isOfficial: false,
    tags: ["WIT Studio", "One Piece", "Rumor", "Leaks"],
    views: 520,
    bookmarksCount: 15
  }
];
