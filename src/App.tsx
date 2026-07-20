/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Tv, Film, Sparkles, Check, X, ChevronDown, ChevronUp, Globe, 
  Smartphone, Monitor, HelpCircle, Send, MessageCircle, MapPin, 
  Lock, Award, Search, Zap, Play, Star, Wifi, ShieldCheck, 
  ArrowRight, ThumbsUp, RefreshCw, Layers, Cpu
} from 'lucide-react';
// @ts-ignore
import heroBg from './assets/images/hero_tv_streaming_1784211384492.jpg';
import BlogHub from './components/BlogHub';
import VSeeBoxReview from './components/VSeeBoxReview';
import AISmartHub from './components/AISmartHub';
import { BLOG_POSTS } from './blogData';
import { SEO_LOCATIONS, SEO_DEVICES, SEO_CONTENT_STREAMS, formatKeyword, generateSEOContent } from './seoData';

// 1. Types & Data Configurations
interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  rate: number; // multiplier
  highlightSport: string;
  highlightLeague: string;
  latency: string;
}

const COUNTRIES: CountryConfig[] = [
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: '£', rate: 1.0, highlightSport: 'Premier League', highlightLeague: 'Sky Sports & TNT', latency: '18ms' },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: '$', rate: 1.2, highlightSport: 'NFL & NBA Live', highlightLeague: 'ESPN+ & Peacock', latency: '24ms' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'C$', rate: 1.5, highlightSport: 'NHL Center Ice', highlightLeague: 'TSN & Sportsnet', latency: '28ms' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: '€', rate: 1.1, highlightSport: 'Bundesliga', highlightLeague: 'DAZN & Sky Sport', latency: '15ms' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'A$', rate: 1.7, highlightSport: 'AFL & Cricket', highlightLeague: 'Kayo & Optus Sport', latency: '32ms' }
];

interface Movie {
  title: string;
  genre: string;
  rating: string;
  year: number;
  badge: string;
  accent: string;
  synopsis: string;
  image: string;
}

const FEATURED_MOVIES: Movie[] = [
  { title: 'Dune: Part Two', genre: 'Sci-Fi, Adventure', rating: '8.8', year: 2024, badge: '4K UHD', accent: 'from-amber-600 to-red-600', synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', image: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=400&h=600&q=80' },
  { title: 'Furiosa: A Mad Max Saga', genre: 'Action, Sci-Fi', rating: '8.2', year: 2024, badge: 'HDR', accent: 'from-blue-600 to-indigo-600', synopsis: 'The origin story of renegade warrior Furiosa before her encounter and alliance with Mad Max.', image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&h=600&q=80' },
  { title: 'Ghostbusters: Frozen Empire', genre: 'Adventure, Comedy', rating: '7.8', year: 2024, badge: '4K UHD', accent: 'from-emerald-600 to-teal-600', synopsis: 'When the discovery of an ancient artifact unleashes an evil force, Ghostbusters new and old must join forces to protect their home and save the world from a second Ice Age.', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=400&h=600&q=80' },
  { title: 'Godzilla x Kong: The New Empire', genre: 'Action, Adventure', rating: '8.0', year: 2024, badge: '4K UHD', accent: 'from-purple-600 to-pink-600', synopsis: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island mysteries.', image: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=400&h=600&q=80' },
  { title: 'Guardians of the Galaxy Volume 3', genre: 'Action, Sci-Fi', rating: '8.4', year: 2023, badge: 'IMAX', accent: 'from-rose-600 to-orange-600', synopsis: 'Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own - a mission that could mean the end of the Guardians if not successful.', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&h=600&q=80' }
];

const NEW_ARRIVALS: Movie[] = [
  { title: 'The Beekeeper', genre: 'Action, Thriller', rating: '7.9', year: 2024, badge: '8K UHD', accent: 'from-violet-600 to-purple-800', synopsis: 'One man\'s brutal campaign for vengeance takes on national stakes after he is revealed to be a former operative of a powerful and clandestine organization known as Beekeepers.', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&h=600&q=80' },
  { title: 'The Fall Guy', genre: 'Action, Comedy', rating: '8.1', year: 2024, badge: '4K HDR', accent: 'from-red-500 to-blue-600', synopsis: 'A battered stuntman springs back into action when the star of a mega-budget studio movie goes missing.', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&h=600&q=80' },
  { title: 'The Garfield Movie', genre: 'Animation, Family', rating: '7.5', year: 2024, badge: '4K UHD', accent: 'from-amber-500 to-yellow-600', synopsis: 'After an unexpected reunion with his long-lost father, Garfield and his canine friend Odie are forced into joining a high-stakes heist.', image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&h=600&q=80' },
  { title: 'Kung Fu Panda 4', genre: 'Animation, Family', rating: '8.0', year: 2024, badge: 'HDR', accent: 'from-sky-400 to-indigo-500', synopsis: 'After Po is tapped to become the Spiritual Leader of the Valley of Peace, he needs to find and train a new Dragon Warrior.', image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=400&h=600&q=80' },
  { title: 'Now You See Me 3', genre: 'Thriller, Mystery', rating: '8.5', year: 2026, badge: '4K UHD', accent: 'from-blue-600 to-cyan-500', synopsis: 'The Four Horsemen return for their most daring heist yet, pushing the boundaries of illusion and deception on a global stage.', image: '/images/now_you_see_me_3.png' }
];

const CHANNEL_LOGOS = [
  { name: 'Prime Video', bg: 'bg-[#00a8e1]/10 text-[#00a8e1]', image: '/images/logo_prime_video.webp' },
  { name: 'F1 Live', bg: 'bg-[#e10600]/10 text-[#e10600]', image: '/images/logo_f1_live.webp' },
  { name: 'HBO Max', bg: 'bg-[#512da8]/10 text-[#9b51e0]', image: '/images/logo_hbo_max.webp' },
  { name: 'Discovery', bg: 'bg-[#002f6c]/10 text-[#29b6f6]', image: '/images/logo_discovery.webp' },
  { name: 'Apple TV', bg: 'bg-white/10 text-white', image: '/images/logo_apple_tv.webp' },
  { name: 'BeIN Sports', bg: 'bg-[#4d0026]/10 text-[#ff007f]', image: '/images/logo_bein_sports.webp' },
  { name: 'Sky Sports', bg: 'bg-[#e10032]/10 text-[#ff1744]', image: '/images/logo_sky_sports.webp' },
  { name: 'Netflix', bg: 'bg-[#e50914]/10 text-[#e50914]', image: '/images/logo_netflix.webp' },
  { name: 'Hulu', bg: 'bg-[#1ce783]/10 text-[#1ce783]', image: '/images/logo_hulu.webp' },
  { name: 'Disney+', bg: 'bg-[#113ccf]/10 text-[#40c4ff]', image: '/images/logo_disney_plus.webp' }
];

const LEAGUE_LOGOS = [
  { name: 'Premier League', flag: '🇬🇧' },
  { name: 'LaLiga', flag: '🇪🇸' },
  { name: 'Champions League', flag: '🇪🇺' },
  { name: 'Bundesliga', flag: '🇩🇪' },
  { name: 'Serie A', flag: '🇮🇹' },
  { name: 'Ligue 1', flag: '🇫🇷' },
  { name: 'Eredivisie', flag: '🇳🇱' },
  { name: 'MLS / NHL', flag: '🇺🇸' }
];

interface SportsEvent {
  name: string;
  category: string;
  badge: string;
  image: string;
}

const SPORTS_EVENTS: SportsEvent[] = [
  { name: 'Premier League', category: 'Football / Soccer', badge: 'Live & Replays', image: '/images/premier_league.webp' },
  { name: 'UEFA Champions League', category: 'Football / Europe', badge: 'Ultra HD 4K', image: '/images/champions_league.webp' },
  { name: 'La Liga', category: 'Football / Spain', badge: 'UHD 60fps', image: '/images/laliga.webp' },
  { name: 'Serie A', category: 'Football / Italy', badge: 'Live in 4K', image: '/images/seriea.jpeg' },
  { name: 'NBA Superstars', category: 'Basketball / NBA', badge: 'US Sports Network', image: '/images/nba.jpeg' },
  { name: 'ATP Tour Masters', category: 'Tennis / Global', badge: 'All Live Matches', image: '/images/atptour.webp' },
  { name: 'UEFA Europa League', category: 'Football / Europe', badge: 'Live Stream', image: '/images/europa_league.jpeg' },
  { name: 'NBA Playoffs', category: 'Basketball / NBA', badge: 'Live & On-Demand', image: '/images/nba.jpeg' },
  { name: 'FIFA World Cup', category: 'Football / Global', badge: 'Archive VOD', image: '/images/football.webp' }
];

const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  type: 'movie' | 'sports' | 'logo' | 'device' | 'user',
  label: string
) => {
  const target = e.currentTarget;
  const encodedLabel = encodeURIComponent(label);
  let fallback = '';

  switch (type) {
    case 'movie':
      fallback = `https://placehold.co/300x450/1c1130/ffffff?text=${encodedLabel}`;
      break;
    case 'sports':
      fallback = `https://placehold.co/300x450/110722/f59e0b?text=${encodedLabel}`;
      break;
    case 'logo':
      fallback = `https://placehold.co/120x40/120a21/f59e0b?text=${encodedLabel}`;
      break;
    case 'device':
      fallback = `https://placehold.co/80x80/1c1130/f59e0b?text=${encodedLabel}`;
      break;
    case 'user':
      fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodedLabel}`;
      break;
    default:
      fallback = `https://placehold.co/300x200/110722/ffffff?text=${encodedLabel}`;
  }

  if (target.src !== fallback) {
    target.src = fallback;
  }
};

export default function App() {
  // Client-Side Geotargeting State
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Client-Side pSEO Path Router State
  const [currentPath, setCurrentPath] = useState('');

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      setCurrentPath(path);
    };
    
    // Initial load
    const initialPath = window.location.pathname.toLowerCase().replace(/\/$/, "");
    setCurrentPath(initialPath);

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Dynamic Title & Meta Tags (Canonical, Open Graph, Twitter Cards) update for 100% SEO capability
  useEffect(() => {
    let title = "HappyStreamz™ - Best IPTV Service Provider 2026 | Live TV, Movies & Sports";
    let desc = "Experience premium entertainment with HappyStreamz, the #1 IPTV service worldwide. Enjoy 30,000+ live TV channels, 150,000+ movies & series in crystal clear 4K UHD. Instant activation, anti-freeze technology, 24/7 support.";
    
    // Blog logic check
    if (currentPath === '/reviews/vseebox-review') {
      title = "VSeeBox V6 Plus Review (2026) | We Tested It So You Don't Have To";
      desc = "Our expert team spent 300+ hours hands-on testing the VSeeBox V6 Plus. See the real benchmark scores, hidden flaws, and why HappyStreamz is the ultimate alternative.";
    } else if (currentPath === '/blog') {
      title = "IPTV Free Trial & Streaming Guides | HappyStreamz™ Blog Hub";
      desc = "Get the ultimate IPTV setup tutorials, live sports streaming lists, VPN security tips, and test account guides. Explore 100+ professional streaming articles.";
    } else if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace(/^\/blog\//, '');
      const activePost = BLOG_POSTS.find(p => p.slug === slug);
      if (activePost) {
        title = `${activePost.title} | HappyStreamz™ Guide`;
        desc = activePost.excerpt;
      }
    } else if (currentPath === '/happystreamz') {
      title = "HappyStreamz™ Official - Premium IPTV Service Provider 2026";
      desc = "Get HappyStreamz IPTV premium service with over 30,000 live channels and 150,000 movie titles. Activate your subscription in 5 minutes with anti-freeze stream tech.";
    } else if (currentPath === '/iptv-free-trial' || currentPath === '/free-iptv-trial') {
      title = "HappyStreamz™ IPTV Free Trial - 24H & 72H Test Accounts";
      desc = "Claim your HappyStreamz IPTV free trial today. Experience crystal-clear 4K channels and stable live streaming. Zero buffers, fast activation, 100% free test accounts.";
    } else if (currentPath === '/iptv-72-hour-free-trial' || currentPath === '/72-hour-trial') {
      title = "HappyStreamz™ 72-Hour IPTV Free Trial - Premium Test Account";
      desc = "Activate a premium 72-hour IPTV free trial with HappyStreamz. Get full access to 30,000+ live television feeds, sports networks, and video on demand.";
    } else if (currentPath) {
      // Dynamic pSEO page formatting (e.g. /iptv-in-sweden, /iptv-on-firestick, etc.) using modular helpers
      const formatted = formatKeyword(currentPath);
      title = `${formatted} | HappyStreamz™ Official 2026`;
      const seoContent = generateSEOContent(currentPath);
      desc = seoContent.intro || `Get the official ${formatted} configuration guides with HappyStreamz. Access over 30,000 live feeds and high-speed VOD in crystal-clear 4K resolution today!`;
    }

    // 1. Title
    document.title = title;

    // 2. Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }

    // 3. Canonical URL
    const canonicalLink = document.querySelector('#canonical-link');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `https://happystreamz.ai.studio${currentPath}`);
    }

    // 4. Open Graph Tags
    const ogTitle = document.querySelector('#og-title');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('#og-description');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const ogUrl = document.querySelector('#og-url');
    if (ogUrl) ogUrl.setAttribute('content', `https://happystreamz.ai.studio${currentPath}`);

    // 5. Twitter Card Tags
    const twitterTitle = document.querySelector('#twitter-title');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDesc = document.querySelector('#twitter-description');
    if (twitterDesc) twitterDesc.setAttribute('content', desc);
  }, [currentPath]);

  // Client-side navigation helper
  const navigateTo = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (currentPath !== '') {
      e.preventDefault();
      window.history.pushState({}, '', `/${targetId}`);
      setCurrentPath('');
      setTimeout(() => {
        const el = document.getElementById(targetId.replace('#', ''));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Programmatic SEO content definitions
  const seoConfig = {
    '/free-iptv-trial': {
      badge: '🎁 CLAIM YOUR FREE TEST ACCOUNT',
      headline: 'HappyStreamz™ IPTV Free Trial',
      subhead: 'Instant Activation',
      desc: 'Experience crystal-clear 4K channels, premium sports networks, and 150,000+ movies & series without paying a single cent. Activate your HappyStreamz IPTV 24-hour free trial now!',
      btnText: 'Claim Free Trial Now',
      promoCode: 'FREE24'
    },
    '/iptv-free-trial': {
      badge: '🎁 CLAIM YOUR FREE TEST ACCOUNT',
      headline: 'HappyStreamz™ IPTV Free Trial',
      subhead: 'Instant Activation',
      desc: 'Experience crystal-clear 4K channels, premium sports networks, and 150,000+ movies & series without paying a single cent. Activate your HappyStreamz IPTV 24-hour free trial now!',
      btnText: 'Claim Free Trial Now',
      promoCode: 'FREE24'
    },
    '/iptv-72-hour-free-trial': {
      badge: '🔥 EXCLUSIVE 3-DAY TRIAL OFFER',
      headline: '72-Hour IPTV Free Trial',
      subhead: 'Premium Test Account',
      desc: 'Unlock ultimate global streaming. Get 72 hours of uninterrupted premium live television, high-speed CDN anti-freeze technology, and custom playlists-now live on HappyStreamz.',
      btnText: 'Activate 72H Trial',
      promoCode: 'FREE72'
    },
    '/happystreamz': {
      badge: '🚀 OFFICIAL HAPPYSTREAMZ PORTAL',
      headline: 'HappyStreamz™ Premium IPTV',
      subhead: '2026 Streaming Voted #1',
      desc: 'Welcome to the official home of HappyStreamz. Access our state-of-the-art server networks with 30,000+ live television feeds and premium 4K UHD coverage with zero buffering.',
      btnText: 'Order Premium Plan',
      promoCode: 'HAPPY_GOLD_10'
    }
  };

  const defaultSEO = {
    badge: 'TRUSTED BY 50,000+ CUSTOMERS WORLDWIDE',
    headline: 'Best IPTV Service 2026',
    subhead: 'For Infinite Entertainment',
    desc: 'Unleash the ultimate live television, movies, and worldwide sports streaming solution with HappyStreamz. Get instant deployment of over 30,000 live channels and 150,000 movies & series in crystal clear UHD resolution.',
    btnText: 'Get Instant Access',
    promoCode: 'HAPPY_GOLD_10'
  };

  const isPSEORoute = (path: string) => {
    return path && (path.startsWith('/iptv-in-') || path.startsWith('/iptv-on-') || (path.endsWith('-iptv') && path !== '/'));
  };

  const getActiveSEO = () => {
    const config = seoConfig[currentPath as keyof typeof seoConfig];
    if (config) return config;

    if (isPSEORoute(currentPath)) {
      const formatted = formatKeyword(currentPath);
      const seoContent = generateSEOContent(currentPath);
      return {
        badge: `🌐 GEOGRAPHICALLY OPTIMIZED PORTAL`,
        headline: `${formatted} Setup`,
        subhead: `Premium IPTV Server Node`,
        desc: seoContent.intro,
        btnText: 'Claim Free Trial Now',
        promoCode: 'HAPPY_GOLD_10'
      };
    }

    return defaultSEO;
  };

  const activeSEO = getActiveSEO();

  // Auto-detect country simulation on load (e.g. based on timezone/locale)
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Europe/Berlin') || tz.includes('Europe/Paris') || tz.includes('Europe/Rome')) {
        setSelectedCountry(COUNTRIES.find(c => c.code === 'DE') || COUNTRIES[0]);
      } else if (tz.includes('America/New_York') || tz.includes('America/Chicago') || tz.includes('America/Los_Angeles')) {
        setSelectedCountry(COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0]);
      } else if (tz.includes('America/Toronto') || tz.includes('America/Vancouver')) {
        setSelectedCountry(COUNTRIES.find(c => c.code === 'CA') || COUNTRIES[0]);
      } else if (tz.includes('Australia/Sydney') || tz.includes('Australia/Melbourne')) {
        setSelectedCountry(COUNTRIES.find(c => c.code === 'AU') || COUNTRIES[0]);
      }
    } catch (e) {
      // Fallback is UK
    }
  }, []);

  // Multi-Device pricing multiplier state for each package (1 to 5 devices)
  const [devicesPlan1, setDevicesPlan1] = useState(1);
  const [devicesPlan2, setDevicesPlan2] = useState(1);
  const [devicesPlan3, setDevicesPlan3] = useState(1);
  const [devicesPlan4, setDevicesPlan4] = useState(1);

  // Active FAQ index
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Movie Trailer Overlay state
  const [activeTrailer, setActiveTrailer] = useState<Movie | null>(null);

  // pSEO Custom Dynamic Guide Modal state
  const [pSEOGuide, setPSEOGuide] = useState<{ title: string; content: string } | null>(null);

  // Interactive Plan Analyzer State
  const [analyzerScreens, setAnalyzerScreens] = useState<number>(1);
  const [analyzerPref, setAnalyzerPref] = useState<string>('all'); // 'sports' | 'movies' | 'all'
  const [analyzerDuration, setAnalyzerDuration] = useState<number>(12); // 3 | 6 | 12 | 24
  const [analyzing, setAnalyzing] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<{
    name: string;
    price: string;
    duration: number;
    screens: number;
    whatsappText: string;
    description: string;
  } | null>(null);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setRecommendationResult(null);
    setTimeout(() => {
      let basePrice = 79.99;
      let planName = '12 Months Plan';
      let description = 'Based on your preference for high-quality and long-term value, this is our absolutely best plan incorporating +3 Months Free Access and 24/7 VIP helpline support.';
      let code = '12M_ORDER';

      if (analyzerDuration === 3) {
        basePrice = 35.99;
        planName = '3 Months Plan';
        description = 'Great for a short-term trial or seasonal sport event streaming. Fully loaded with 30K+ channels and 150K+ movies.';
        code = '3M_ORDER';
      } else if (analyzerDuration === 6) {
        basePrice = 49.99;
        planName = '6 Months Plan';
        description = 'Ideal choice for medium-term premium coverage. Fast activation and zero lag servers with priority routing.';
        code = '6M_ORDER';
      } else if (analyzerDuration === 24) {
        basePrice = 129.99;
        planName = '24 Months Plan';
        description = 'The ultimate saving subscription! Gets you full access to all future premium sports feeds with our maximum cluster performance and free IPTV player lifetime license.';
        code = '24M_ORDER';
      }

      if (analyzerPref === 'sports') {
        description += ' Fully optimized for live UHD sports streaming with high-frequency buffers and low latency feeds.';
      } else if (analyzerPref === 'movies') {
        description += ' Fully optimized for cinematic movie nights with seamless surround sound feeds and instant VOD catalog loading.';
      }

      const finalPriceStr = calculatePrice(basePrice, analyzerScreens);
      const whatsappText = `Hello, the AI Plan Analyzer recommended the ${planName} for ${analyzerScreens} screen(s) (${selectedCountry.currency}${finalPriceStr}) on HappyStreamz. Code: ${code}`;

      setRecommendationResult({
        name: planName,
        price: finalPriceStr,
        duration: analyzerDuration,
        screens: analyzerScreens,
        whatsappText,
        description
      });
      setAnalyzing(false);
    }, 850);
  };

  // Dynamic price calculating formula: basePrice * countryMultiplier * (1 + (devices - 1) * 0.15)
  const calculatePrice = (base: number, devices: number) => {
    const raw = base * selectedCountry.rate * (1 + (devices - 1) * 0.15);
    return raw.toFixed(2);
  };

  // Structured Data (JSON-LD) for SEO and SAI
  const getJsonLdData = () => {
    if (currentPath === '/reviews/vseebox-review') {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "VSeeBox V6 Plus",
        "description": "The latest Android TV box for streaming live sports and VOD.",
        "brand": {
          "@type": "Brand",
          "name": "VSeeBox"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://happystreamz.ai.studio/reviews/vseebox-review/",
          "priceCurrency": "USD",
          "price": "299.00",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "HappyStreamz Certified Partners"
          }
        },
        "review": {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "4.9",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Michael T. - Senior Streaming Hardware Analyst"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "2145"
        }
      };
    }
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "HappyStreamz",
          "url": "https://happystreamz.ai.studio/",
          "logo": "https://happystreamz.ai.studio/apple-touch-icon.png",
          "description": "HappyStreamz is the premium IPTV service provider of 2026. Claim your IPTV free trial or free try iptv test account. Experience our best iptv 72 hour trial for ultimate buffer-free sports and entertainment streaming.",
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "freeiptvstream@gmail.com",
            "contactType": "customer service",
            "availableLanguage": "English"
          },
          "sameAs": [
            "https://happystreamz.ai.studio/blog"
          ]
        },
        {
          "@type": "Product",
          "@id": "https://happystreamz.ai.studio/#service",
          "name": "HappyStreamz IPTV Service",
          "brand": {
            "@type": "Brand",
            "name": "HappyStreamz"
          },
          "provider": {
            "@type": "Organization",
            "name": "HappyStreamz Ltd",
            "url": "https://happystreamz.ai.studio/"
          },
          "description": "Experience premium global entertainment with HappyStreamz. Claim your IPTV free trial or free try iptv test account. Enjoy 30,000+ live TV channels and 150,000+ movies & series in crystal clear 4K UHD with anti-freeze stream support.",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "1240",
            "bestRating": "5",
            "worstRating": "1"
          }
        },
        {
          "@type": "HowTo",
          "name": "How to Setup HappyStreamz IPTV Subscription",
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Select Your Plan",
              "text": "Choose from our 3, 6, 12, or 24-month plans, configure active screens, and checkout."
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Receive Login Details",
              "text": "We immediately generate your custom M3U Playlist & Xtream Codes login credentials and email them to you."
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Connect and Stream",
              "text": "Install our optimized IPTV application on your device, log in, and enjoy crystal-clear 4K streams."
            }
          ]
        }
      ]
    };
  };

  // pSEO links helper click handler
  const openPSEOGuide = (title: string, category: 'country' | 'device' | 'content') => {
    let content = "";
    if (category === 'country') {
      content = `Our state-of-the-art server hubs are fully optimized in ${title}. HappyStreamz routes local television grids directly to avoid latency. You get full access to national regional affiliates, regional sports networks, local news stations, and localized video-on-demand libraries with subtitles. Includes premium sports leagues, news networks, and premium movie channels tailored for ${title} viewers.`;
    } else if (category === 'device') {
      content = `Setting up HappyStreamz on your ${title} is extremely easy:\n\n1. Search for and install 'Downloader' or 'IPTV Smarters' in the official app store.\n2. Open the application and choose 'Login with Xtream Codes API'.\n3. Input the Portal URL, username, and password provided in your activation email.\n4. Click 'Login' and let the application compile the 30,000+ live channels and VOD library.\n\nNo root or complex sideloading required! For advanced configurations, speak to our 24/7 technical desk.`;
    } else {
      content = `Access elite ${title} playlists containing worldwide coverages. Stream games in up to 4K resolution at 60 FPS without server buffering, fully backed by our proprietary Anti-Freeze v4.2 CDN networks. Catch-up features (EPG) are included automatically so you never miss an event.`;
    }
    setPSEOGuide({ title, content });
  };

  return (
    <div id="landing-container" className="min-h-screen bg-[#0f071a] text-white selection:bg-[#f59e0b] selection:text-black">
      {/* JSON-LD Script injection */}
      <script type="application/ld+json">
        {JSON.stringify(getJsonLdData())}
      </script>

      {/* Top Notification Ticker Banner */}
      <div id="promo-banner" className="bg-gradient-to-r from-amber-600 via-purple-700 to-indigo-800 text-center py-2 px-4 text-xs font-bold tracking-wider relative z-30 flex justify-center items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
        {currentPath ? (
          <span className="flex items-center gap-2 flex-wrap justify-center">
            <span>Special Offer Active: <span className="text-yellow-300 uppercase font-black">"{currentPath.replace(/^\//, '').replace(/-/g, ' ')}"</span> Landing Portal</span>
            <a href="/" onClick={(e) => navigateTo(e, '/')} className="bg-black/30 hover:bg-black/60 text-white border border-white/20 text-[9px] uppercase px-2 py-0.5 rounded ml-2 transition-all">Go back to General Portal ×</a>
          </span>
        ) : (
          <span>FLASH SALE: 50% SAVINGS APPLIED! NEW SUBSCRIPTIONS GET 10% EXTRA DISCOUNT CODE: <span className="underline decoration-yellow-300 font-extrabold text-white">HAPPY_GOLD_10</span></span>
        )}
        <span className="hidden md:inline-block bg-black/30 text-[10px] uppercase px-2 py-0.5 rounded ml-2">24H Left</span>
      </div>

      {/* Navigation Header */}
      <header id="main-header" className="sticky top-0 bg-[#0f071a]/90 backdrop-blur-md border-b border-white/10 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Navigation Group to keep precise spacing */}
          <div className="flex items-center gap-10 md:gap-[120px] lg:gap-[150px]">
            {/* Logo */}
            <a href="/" onClick={(e) => navigateTo(e, '/')} className="flex items-center group" aria-label="Go to 4KTVZ homepage">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 p-[2px] shadow-lg shadow-[#f59e0b]/10 group-hover:shadow-[#f59e0b]/20 transition-all flex items-center justify-center">
                <div className="w-full h-full bg-[#0f071a] rounded-full flex items-center justify-center">
                  <span className="font-extrabold text-[#f59e0b] text-base tracking-tighter">4K</span>
                  <span className="font-black text-white text-xs">TVZ</span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-gray-300" aria-label="Desktop Navigation">
              <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="hover:text-[#f59e0b] transition-colors" aria-label="Go to Home section">Home</a>
              <a href="#featured" onClick={(e) => handleNavClick(e, '#featured')} className="hover:text-[#f59e0b] transition-colors" aria-label="View VOD Library">VOD Library</a>
              <a href="#compare" onClick={(e) => handleNavClick(e, '#compare')} className="hover:text-[#f59e0b] transition-colors" aria-label="Why Choose HappyStreamz">Why HappyStreamz</a>
              <a href="#analyzer" onClick={(e) => handleNavClick(e, '#analyzer')} className="hover:text-[#f59e0b] transition-colors flex items-center gap-1" aria-label="Analyze your ideal subscription plan"><Sparkles className="w-3 h-3 text-[#f59e0b]" /> Plan Analyzer</a>
              <a href="#pricing" onClick={(e) => handleNavClick(e, '#pricing')} className="hover:text-[#f59e0b] transition-colors" aria-label="View pricing plans">Pricing</a>
              <a href="#devices" onClick={(e) => handleNavClick(e, '#devices')} className="hover:text-[#f59e0b] transition-colors" aria-label="Supported devices list">Devices</a>
              <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-[#f59e0b] transition-colors" aria-label="Frequently Asked Questions and Support">Support</a>
              <a 
                href="/blog" 
                onClick={(e) => navigateTo(e, '/blog')} 
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  currentPath.startsWith('/blog') 
                    ? 'border-[#f59e0b] text-[#f59e0b] font-extrabold bg-[#f59e0b]/10 animate-pulse' 
                    : 'border-white/10 hover:border-[#f59e0b] hover:text-[#f59e0b]'
                }`}
                aria-label="HappyStreamz Blog and IPTV Guides"
              >
                Blog & Guides
              </a>
            </nav>
          </div>

          {/* Action Header Items */}
          <div className="flex items-center gap-4">
            {/* Geo-targeting Selector */}
            <div className="relative">
              <button 
                id="geo-toggle"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:border-[#f59e0b]/50 transition-all"
                aria-label="Select your target country/region"
                aria-expanded={showCountryDropdown}
              >
                <span className="text-sm" aria-hidden="true">{selectedCountry.flag}</span>
                <span className="hidden sm:inline-block text-gray-200">{selectedCountry.name}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" aria-hidden="true" />
              </button>

              {showCountryDropdown && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#1c1130] border border-white/10 shadow-2xl p-2 z-50">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-3 py-1.5 border-b border-white/5">
                    Select Your Region
                  </div>
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowCountryDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-white/5 transition-colors ${selectedCountry.code === country.code ? 'text-[#f59e0b] bg-white/5 font-bold' : 'text-gray-300'}`}
                      aria-label={`Switch region to ${country.name}`}
                    >
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">{country.flag}</span>
                        <span>{country.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">({country.currency})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a 
              href="https://freetrialiptv.cc/"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-black text-xs font-extrabold uppercase rounded-full tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
              aria-label="Order your HappyStreamz subscription premium plan now"
            >
              Order Now
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {currentPath.startsWith('/blog') ? (
        <BlogHub currentPath={currentPath} navigateTo={navigateTo} />
      ) : currentPath === '/reviews/vseebox-review' ? (
        <VSeeBoxReview navigateTo={navigateTo} />
      ) : (
        <>
          <section 
            id="hero" 
            className="relative min-h-[85vh] flex items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(to right, #0f071a 30%, rgba(15, 7, 26, 0.9) 60%, rgba(15, 7, 26, 0.5) 100%), url(${heroBg})` }}
          >
        {/* Dynamic particles or ambient light shapes */}
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-[#f59e0b]/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-[#f59e0b]/20">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
              <span>{activeSEO.badge}</span>
            </div>

            {/* Title / Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
              {activeSEO.headline.split(' ').map((word, i) => {
                if (word.replace(/[™]/g, '').toUpperCase() === 'IPTV' || word.replace(/[™]/g, '').toUpperCase() === 'HAPPYSTREAMZ') {
                  return <span key={i} className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">{word} </span>;
                }
                return word + ' ';
              })}
              <br/>
              <span className="text-[#f59e0b] text-2xl sm:text-4xl font-extrabold mt-2 block">{activeSEO.subhead}</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-xl">
              {activeSEO.desc}
            </p>

            {/* Highlights Geo-targeted Info */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 max-w-lg">
              <MapPin className="w-6 h-6 text-[#f59e0b] flex-shrink-0 animate-bounce" />
              <div className="text-xs sm:text-sm">
                <span className="font-extrabold text-[#f59e0b]">Geo-Optimized Connection:</span> Active in <span className="underline font-bold text-white">{selectedCountry.name}</span>. Catch the latest <span className="font-bold text-white">{selectedCountry.highlightSport}</span> feeds instantly via <span className="font-bold text-white">{selectedCountry.highlightLeague}</span> nodes (Latency: <span className="font-mono text-green-400 font-bold">{selectedCountry.latency}</span>).
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="https://freetrialiptv.cc/" 
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-black font-extrabold rounded-full tracking-wider hover:shadow-2xl hover:shadow-[#f59e0b]/20 hover:brightness-110 active:scale-95 transition-all text-sm uppercase flex items-center gap-2"
              >
                <span>{activeSEO.btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="https://freetrialiptv.cc/"
                className="px-8 py-4 bg-[#25183d] border border-[#f59e0b]/30 hover:bg-[#25183d]/80 text-[#f59e0b] font-black rounded-full text-sm uppercase transition-all flex items-center gap-2 text-center justify-center shadow-lg"
              >
                <span>CLAIM FREE TEST ACCOUNT</span>
              </a>
            </div>

            {/* THE AGGRESSIVE HOMEPAGE HIJACK */}
            <div className="bg-[#1c1130] p-8 mt-10 relative border border-emerald-500/30 rounded-3xl shadow-xl shadow-emerald-500/5">
              <span className="absolute -top-4 right-6 text-[10px] sm:text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wide bg-emerald-500 text-black">🔥 2026 Exclusive Partner</span>
              <h2 className="font-sans font-black text-2xl sm:text-3xl mb-4 text-white leading-tight">Unlock The Ultimate VSeeBox V6 Plus Experience</h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Stop paying $300+ for hardware that buffers. HappyStreamz is the #1 recommended premium IPTV server officially tested and optimized for VSeeBox, Superbox, and Firestick devices.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 p-4 rounded-xl flex items-center gap-3 border border-white/5">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="font-bold text-sm text-white">4.9/5 Rating</div>
                    <div className="text-xs text-slate-400">Based on 14,205 VSeeBox Users</div>
                  </div>
                </div>
                <div className="bg-black/40 p-4 rounded-xl flex items-center gap-3 border border-white/5">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-sm text-white">Zero Freeze Tech</div>
                    <div className="text-xs text-slate-400">Hardware-accelerated uncompressed 4K</div>
                  </div>
                </div>
              </div>
              <a 
                href="/reviews/vseebox-review" 
                onClick={(e) => navigateTo(e, '/reviews/vseebox-review')}
                className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/20 transition-all text-center"
              >
                Read Our Hands-On VSeeBox Review →
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-md border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#f59e0b]">30K+</div>
                <div className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Live Channels</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#f59e0b]">150K+</div>
                <div className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Movies & Shows</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#f59e0b]">4K/8K</div>
                <div className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Ultra HD Quality</div>
              </div>
            </div>
          </div>

          {/* Right Side Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md bg-[#1c1130] rounded-3xl border border-white/10 p-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl"></div>
              
              {/* Device Frame Display Mockup */}
              <div className="relative aspect-[16/10] bg-black rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-cover bg-center filter brightness-90 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url(${heroBg})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE
                    </span>
                    <span className="text-[10px] font-mono text-gray-200">UK Server Node #03</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white drop-shadow">PREMIER LEAGUE: Manchester United vs Man City</h3>
                    <p className="text-[10px] text-gray-300">Live in Ultra-HD 60fps • HappyStreamz Dedicated Channel</p>
                  </div>
                </div>
                {/* Simulated player buttons overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center text-black">
                    <Play className="w-6 h-6 fill-black ml-1" />
                  </div>
                </div>
              </div>

              {/* Quality Badges */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-gray-300">EPG / Catch-Up</span>
                <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-gray-300">Anti-Freeze v4.2</span>
                <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-gray-300">Dual Audio</span>
              </div>

              {/* Simulated Customer review overlap widget */}
              <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-[#f59e0b] flex items-center justify-center font-bold text-xs">A</div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                    <span className="text-[10px] text-gray-400 ml-1 font-mono">10m ago</span>
                  </div>
                  <p className="text-[11px] text-gray-200 font-medium">"The latency is extremely low. Best stream for live sports."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Text Bar */}
      <div className="bg-black/80 py-4 border-y border-white/10 overflow-hidden relative">
        <div className="flex gap-12 text-sm font-extrabold uppercase tracking-widest text-[#f59e0b] whitespace-nowrap animate-marquee">
          <span>📺 150,000+ MOVIES & SHOWS — UPDATED DAILY ✨</span>
          <span>⚽ LIVE SPORTS INSTANT ACCESS 🏆</span>
          <span>🔥 30,000+ GLOBAL CHANNELS — STREAM ANYTIME 🌐</span>
          <span>⚡ ANTI-FREEZE SERVER STABILITY 99.9% 🚀</span>
          <span>📺 150,000+ MOVIES & SHOWS — UPDATED DAILY ✨</span>
          <span>⚽ LIVE SPORTS INSTANT ACCESS 🏆</span>
        </div>
      </div>

      {/* Movie Showcase Sections */}
      <section id="featured" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        
        {/* Featured Collections */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-black text-[#f59e0b] uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Featured Collections
              </div>
              <h2 className="text-3xl font-black">Trending Blockbusters & Series</h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Updated hourly. Watch all top premium releases in your preferred resolution with native multi-language subtitles.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {FEATURED_MOVIES.map((movie) => (
              <div 
                key={movie.title}
                onClick={() => setActiveTrailer(movie)}
                className="bg-[#1c1130] rounded-2xl border border-white/10 overflow-hidden group hover:border-[#f59e0b] cursor-pointer transition-all hover:-translate-y-2 shadow-xl"
              >
                {/* Poster Image with fallback and beautiful overlays */}
                <div className="aspect-[2/3] relative overflow-hidden bg-black/40">
                  <img 
                    src={movie.image} 
                    alt={`Watch ${movie.title} on 4KTVZ IPTV - Free Trial`}
                    width={300}
                    height={450}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, 'movie', movie.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{movie.badge}</span>
                    <span className="bg-[#f59e0b] text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      ★ {movie.rating}
                    </span>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center text-black shadow-lg shadow-[#f59e0b]/30">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 z-10 text-[10px] text-gray-300 font-mono font-bold">
                    RELEASE: {movie.year}
                  </div>
                </div>

                <div className="p-4 space-y-1 bg-[#1c1130]">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{movie.genre}</div>
                  <h3 className="font-extrabold text-sm line-clamp-1 group-hover:text-[#f59e0b] transition-colors">{movie.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Arrivals */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-black text-[#f59e0b] uppercase tracking-widest mb-1 flex items-center gap-1">
                <Film className="w-3.5 h-3.5" /> New Arrivals
              </div>
              <h2 className="text-3xl font-black">Just Added on HappyStreamz</h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Fresh additions straight from cinemas and major networks added to the platform daily.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {NEW_ARRIVALS.map((movie) => (
              <div 
                key={movie.title}
                onClick={() => setActiveTrailer(movie)}
                className="bg-[#1c1130] rounded-2xl border border-white/10 overflow-hidden group hover:border-[#f59e0b] cursor-pointer transition-all hover:-translate-y-2 shadow-xl"
              >
                {/* Poster Image with fallback and beautiful overlays */}
                <div className="aspect-[2/3] relative overflow-hidden bg-black/40">
                  <img 
                    src={movie.image} 
                    alt={`Watch ${movie.title} on 4KTVZ IPTV - Free Trial`}
                    width={300}
                    height={450}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, 'movie', movie.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">{movie.badge}</span>
                    <span className="bg-[#f59e0b] text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      ★ {movie.rating}
                    </span>
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center text-black shadow-lg shadow-[#f59e0b]/30">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 z-10 text-[10px] text-gray-300 font-mono font-bold">
                    RELEASE: {movie.year}
                  </div>
                </div>

                <div className="p-4 space-y-1 bg-[#1c1130]">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">{movie.genre}</div>
                  <h3 className="font-extrabold text-sm line-clamp-1 group-hover:text-[#f59e0b] transition-colors">{movie.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Logos Grid Section */}
      <section className="py-16 bg-[#120a21] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">Global Channels</span>
            <h3 className="text-2xl font-black">All Networks in One Smart App</h3>
          </div>
          
          {/* Channel Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {CHANNEL_LOGOS.map((logo) => (
              <div 
                key={logo.name}
                onClick={() => openPSEOGuide(logo.name, 'content')}
                className="h-16 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center p-2 cursor-pointer hover:scale-105 active:scale-95 transition-all hover:border-[#f59e0b]/30 overflow-hidden relative group"
              >
                <img 
                  src={logo.image} 
                  alt={`Stream ${logo.name} Live - Best IPTV Service`}
                  width={120}
                  height={40}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, 'logo', logo.name)}
                  className="max-h-10 w-auto object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-10">
            <div className="text-center space-y-2 mb-6">
              <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">Every League, Every Match</span>
              <h2 className="text-2xl sm:text-3xl font-black">Stream Worldwide Sports Events Live</h2>
            </div>
            
            {/* Sports Events Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
              {SPORTS_EVENTS.map((event) => (
                <div 
                  key={event.name}
                  onClick={() => openPSEOGuide(event.name, 'content')}
                  className="bg-[#1c1130] rounded-2xl border border-white/10 overflow-hidden group hover:border-[#f59e0b] cursor-pointer transition-all hover:-translate-y-2 shadow-xl"
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-black/40">
                    <img 
                      src={event.image} 
                      alt={`Stream ${event.name} Live - Best IPTV Service`}
                      width={300}
                      height={450}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, 'sports', event.name)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#e10032] text-white text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">{event.badge}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-[#1c1130] space-y-1">
                    <span className="text-[10px] text-[#f59e0b] font-bold uppercase tracking-wider">{event.category}</span>
                    <h4 className="font-extrabold text-sm line-clamp-1 group-hover:text-[#f59e0b] transition-colors">{event.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Provider Comparison Section */}
      <section id="compare" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">Quality Comparison</span>
          <h2 className="text-3xl sm:text-4xl font-black">How HappyStreamz Compares</h2>
          <p className="text-gray-400 text-sm">
            Don't waste money on unstable buffers. Discover why HappyStreamz continues to be voted the number one worldwide IPTV solution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Other Providers */}
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-400">Other Competitors</h3>
              <p className="text-xs text-gray-500">Standard market offerings</p>
            </div>
            <ul className="space-y-4 text-sm font-semibold">
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-400"><span>Live Channels</span> <span className="text-white">~8,000</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-400"><span>Movies & VODs</span> <span className="text-white">~30,000</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-400"><span>Anti-Freeze Tech</span> <span className="text-red-500 flex items-center gap-1"><X className="w-4 h-4"/> None</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-400"><span>Uptime SLA</span> <span className="text-white">95.0% (Frequent Outages)</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-400"><span>EPG Guide</span> <span className="text-white">Incomplete</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-400"><span>VIP Support</span> <span className="text-white">Email Only (Slow)</span></li>
            </ul>
            <div className="pt-4 text-center">
              <span className="text-xs text-gray-500">Unreliable feeds, buffering & high costs</span>
            </div>
          </div>

          {/* HappyStreamz */}
          <div className="bg-[#25183d] border-2 border-[#f59e0b] shadow-2xl shadow-[#f59e0b]/5 rounded-3xl p-8 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#f59e0b] text-black text-[9px] font-black uppercase px-4 py-1.5 rounded-bl-xl tracking-wider">
              Premium Choice
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#f59e0b]">HAPPYSTREAMZ PREMIUM</h3>
              <p className="text-xs text-amber-300/80 font-bold uppercase tracking-wider">Ultimate high-speed cluster</p>
            </div>
            <ul className="space-y-4 text-sm font-bold">
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-200"><span>Live Channels</span> <span className="text-[#f59e0b] font-extrabold">30,000+</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-200"><span>Movies & VODs</span> <span className="text-[#f59e0b] font-extrabold">150,000+</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-200"><span>Anti-Freeze Tech</span> <span className="text-green-400 flex items-center gap-1"><Check className="w-4 h-4"/> Version 4.2 CDN</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-200"><span>Uptime SLA</span> <span className="text-green-400">99.9% (Guaranteed)</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-200"><span>EPG Guide</span> <span className="text-green-400">Advanced / Auto-Sync</span></li>
              <li className="flex justify-between pb-3 border-b border-white/5 text-gray-200"><span>VIP Support</span> <span className="text-[#f59e0b] font-extrabold">24/7/365 (WhatsApp & Chat)</span></li>
            </ul>
            <div className="pt-4">
              <a 
                href="https://freetrialiptv.cc/"
                className="w-full block text-center py-3 bg-[#f59e0b] hover:bg-amber-500 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Switch to HappyStreamz Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered PLAN ANALYZER Section */}
      <section id="analyzer" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="bg-gradient-to-br from-[#1c1130] to-[#120a21] border border-[#f59e0b]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
          {/* Futuristic ambient lines */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]"></span>
                </span>
                <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Engine Active
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">AI-Powered PLAN ANALYZER</h2>
              <p className="text-gray-400 text-xs sm:text-sm max-w-xl">
                Not sure which plan matches your streaming setup? Answer 3 quick questions and let our analyzer recommend the perfect subscription model with optimized route configuration.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-2xl">
              <Cpu className="w-8 h-8 text-[#f59e0b] animate-pulse" />
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-mono font-bold">Model Stream Version</div>
                <div className="text-xs text-white font-extrabold font-mono">QuantumStream-v4.2</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
            {/* Questionnaire Side */}
            <div className="lg:col-span-7 space-y-6">
              {/* Question 1: Screens */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center text-xs">1</span>
                  How many devices (screens) will stream simultaneously?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setAnalyzerScreens(num);
                        setRecommendationResult(null);
                      }}
                      className={`py-3 rounded-xl border text-center font-mono font-bold transition-all text-xs ${analyzerScreens === num ? 'bg-[#f59e0b] text-black border-[#f59e0b] shadow-lg shadow-[#f59e0b]/10' : 'bg-black/30 border-white/10 text-gray-300 hover:border-white/20'}`}
                    >
                      {num} {num === 1 ? 'Screen' : 'Screens'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 font-medium">Each extra screen uses a dedicated concurrent server slot at 85% discount.</p>
              </div>

              {/* Question 2: Preference */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center text-xs">2</span>
                  What is your primary streaming content focus?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'All-In-One TV & VOD', icon: Tv },
                    { id: 'sports', label: 'Live Premium Sports', icon: Zap },
                    { id: 'movies', label: 'Movies & VOD Series', icon: Film }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setAnalyzerPref(item.id);
                          setRecommendationResult(null);
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-center transition-all ${analyzerPref === item.id ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]' : 'bg-black/30 border-white/10 text-gray-300 hover:border-white/20'}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wide leading-tight">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 3: Subscription length preferred */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-extrabold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center text-xs">3</span>
                  What is your preferred subscription model?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 3, label: '3 Months (Standard)', desc: 'Short-term seasonal pass' },
                    { id: 12, label: '12 Months (Best Value)', desc: 'Plus 3 Months FREE' },
                    { id: 24, label: '24 Months (Ultimate)', desc: 'Save up to 60% total' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setAnalyzerDuration(item.id);
                        setRecommendationResult(null);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${analyzerDuration === item.id ? 'bg-[#f59e0b]/10 border-[#f59e0b] text-[#f59e0b]' : 'bg-black/30 border-white/10 text-gray-300 hover:border-white/20'}`}
                    >
                      <span className="text-xs font-extrabold uppercase tracking-wider">{item.label}</span>
                      <span className="text-[8px] text-gray-500 font-bold mt-1 leading-tight">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://freetrialiptv.cc/"
                  className="w-full block text-center py-4 bg-gradient-to-r from-[#f59e0b] via-amber-500 to-orange-600 hover:brightness-110 active:scale-[0.98] text-black font-black text-xs sm:text-sm uppercase rounded-2xl tracking-widest shadow-xl shadow-[#f59e0b]/10 transition-all flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-black" />
                  <span>ANALYZE NOW & DEFINE ROUTE</span>
                </a>
              </div>
            </div>

            {/* Recommendation Result Display Side */}
            <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between min-h-[350px]">
              {analyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-amber-500/10 border-t-[#f59e0b] animate-spin"></div>
                    <Cpu className="w-6 h-6 text-[#f59e0b] absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-xs text-white font-extrabold font-mono uppercase tracking-wider animate-pulse">Running Diagnostic AI...</div>
                    <div className="text-[10px] text-gray-400 font-mono">Calibrating Anti-Freeze Cluster Routing...</div>
                  </div>
                </div>
              ) : recommendationResult ? (
                <div className="flex-1 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#f59e0b] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">Recommended Plan</span>
                      <span className="text-gray-400 text-xs font-mono">Score: 99.8% Match</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-white">{recommendationResult.name}</h3>
                      <p className="text-xs text-gray-300 font-medium leading-relaxed">{recommendationResult.description}</p>
                    </div>

                    <div className="bg-[#1c1130] p-4 rounded-xl border border-white/5 space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-300">
                        <span>Configured for:</span>
                        <span className="text-white font-extrabold">{recommendationResult.screens} screen{recommendationResult.screens > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-300">
                        <span>Route Priority:</span>
                        <span className="text-green-400 font-extrabold uppercase">VIP Ultra-Low Latency</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-300">
                        <span>Uptime Guarantee:</span>
                        <span className="text-[#f59e0b] font-extrabold">99.9% Active SLA</span>
                      </div>
                      <div className="border-t border-white/5 pt-3 flex justify-between items-end">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Route Cost</span>
                        <div className="text-right">
                          <span className="text-3xl font-black text-[#f59e0b]">{selectedCountry.currency}{recommendationResult.price}</span>
                          <span className="text-[9px] text-gray-500 block uppercase font-mono">Local Tax Included</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="https://freetrialiptv.cc/"
                      className="w-full block text-center py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs uppercase rounded-xl tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      ⚡ INSTANTLY CONNECT & STREAM
                    </a>
                    <div className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-wider">
                      🔒 30-Day Money-Back Guarantee
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                    <Cpu className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Waiting for Inputs</h4>
                    <p className="text-xs text-gray-400 max-w-xs">
                      Adjust the screens, content preference, and model length on the left, then click <strong>ANALYZE NOW</strong> to get your optimized server configuration recommendation.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#120a21] px-4 sm:px-6 lg:px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">Simple Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-black">Choose Your IPTV Plan</h2>
            <p className="text-gray-400 text-sm">
              All plans include complete 4K/UHD channel availability, VOD directory updates, and anti-freeze connection routing.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            
            {/* Plan 1 */}
            <div className="bg-[#1c1130] rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-colors shadow-xl">
              <div className="space-y-4">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Short-Term Access</div>
                <h3 className="text-xl font-extrabold">3 Months Plan</h3>
                
                {/* Dynamic Price Calculation */}
                <div className="space-y-1">
                  <div className="text-4xl font-black text-[#f59e0b]">
                    {selectedCountry.currency}{calculatePrice(35.99, devicesPlan1)}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">
                    Total for {devicesPlan1} screen{devicesPlan1 > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Device Selector Counter */}
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-300">
                    <span>SELECT ACTIVE DEVICES</span>
                    <span className="text-[#f59e0b] font-mono">{devicesPlan1}/5 Screens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setDevicesPlan1(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-black hover:bg-white/15"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-mono font-bold text-xs bg-black/60 py-1.5 rounded">
                      {devicesPlan1} Screen{devicesPlan1 > 1 ? 's' : ''}
                    </div>
                    <button 
                      onClick={() => setDevicesPlan1(prev => Math.min(5, prev + 1))}
                      className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-black hover:bg-white/15"
                    >
                      +
                    </button>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-white/5">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 30,000+ Live Channels</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 150,000+ Movies & Series</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> UHD | 4K | 8K Feeds</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 99.9% Active Uptime</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> EPG / TV Guide</li>
                </ul>
              </div>

              <div className="pt-6 space-y-3">
                <a 
                  href="https://freetrialiptv.cc/"
                  className="w-full block text-center py-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 text-white font-extrabold text-xs uppercase rounded-xl tracking-wider transition-colors"
                >
                  ⚡ INSTANTLY CONNECT
                </a>
                <div className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-wider">
                  🔒 30-Day Money-Back Guarantee
                </div>
              </div>
            </div>

            {/* Plan 2 */}
            <div className="bg-[#1c1130] rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-colors shadow-xl">
              <div className="space-y-4">
                <div className="text-xs text-[#f59e0b] font-bold uppercase tracking-widest">Popular Short Term</div>
                <h3 className="text-xl font-extrabold">6 Months Plan</h3>
                
                <div className="space-y-1">
                  <div className="text-4xl font-black text-[#f59e0b]">
                    {selectedCountry.currency}{calculatePrice(49.99, devicesPlan2)}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">
                    Total for {devicesPlan2} screen{devicesPlan2 > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-300">
                    <span>SELECT ACTIVE DEVICES</span>
                    <span className="text-[#f59e0b] font-mono">{devicesPlan2}/5 Screens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setDevicesPlan2(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-black hover:bg-white/15"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-mono font-bold text-xs bg-black/60 py-1.5 rounded">
                      {devicesPlan2} Screen{devicesPlan2 > 1 ? 's' : ''}
                    </div>
                    <button 
                      onClick={() => setDevicesPlan2(prev => Math.min(5, prev + 1))}
                      className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-black hover:bg-white/15"
                    >
                      +
                    </button>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-white/5">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 30,000+ Live Channels</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 150,000+ Movies & Series</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> UHD | 4K | 8K Feeds</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 99.9% Active Uptime</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> Advanced Support Channels</li>
                </ul>
              </div>

              <div className="pt-6 space-y-3">
                <a 
                  href="https://freetrialiptv.cc/"
                  className="w-full block text-center py-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 text-white font-extrabold text-xs uppercase rounded-xl tracking-wider transition-colors"
                >
                  ⚡ INSTANTLY CONNECT
                </a>
                <div className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-wider">
                  🔒 30-Day Money-Back Guarantee
                </div>
              </div>
            </div>

            {/* Plan 3 - Highlighted */}
            <div className="bg-[#25183d] rounded-3xl border-2 border-[#f59e0b] p-6 flex flex-col justify-between relative shadow-2xl shadow-[#f59e0b]/5">
              <div className="absolute top-0 right-0 bg-[#f59e0b] text-black text-[9px] font-black uppercase px-4 py-1 rounded-bl-xl tracking-widest">
                BEST VALUE
              </div>
              <div className="space-y-4">
                <div className="text-xs text-[#f59e0b] font-bold uppercase tracking-widest">Recommended Choice</div>
                <h3 className="text-xl font-extrabold">12 Months Plan</h3>
                
                <div className="space-y-1">
                  <div className="text-5xl font-black text-[#f59e0b]">
                    {selectedCountry.currency}{calculatePrice(79.99, devicesPlan3)}
                  </div>
                  <div className="text-[10px] text-amber-300 font-bold uppercase font-mono">
                    Includes +3 Months Free Access!
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-300">
                    <span>SELECT ACTIVE DEVICES</span>
                    <span className="text-[#f59e0b] font-mono">{devicesPlan3}/5 Screens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setDevicesPlan3(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center font-black hover:bg-[#f59e0b]/30"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-mono font-bold text-xs bg-black/60 py-1.5 rounded">
                      {devicesPlan3} Screen{devicesPlan3 > 1 ? 's' : ''}
                    </div>
                    <button 
                      onClick={() => setDevicesPlan3(prev => Math.min(5, prev + 1))}
                      className="w-8 h-8 rounded bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center font-black hover:bg-[#f59e0b]/30"
                    >
                      +
                    </button>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-200 pt-4 border-t border-white/5">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> Free 24H Activation</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 30,000+ Live Channels</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 150,000+ Movies & Series</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> Ultra-HD 4K & 8K Support</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 24/7 Priority VIP Helpline</li>
                </ul>
              </div>

              <div className="pt-6 space-y-3">
                <a 
                  href="https://freetrialiptv.cc/"
                  className="w-full block text-center py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-black font-extrabold text-xs uppercase rounded-xl tracking-wider shadow-lg transition-all"
                >
                  ⚡ INSTANTLY CONNECT & STREAM
                </a>
                <div className="text-[10px] text-amber-300 text-center uppercase font-bold tracking-wider">
                  🔒 30-Day Money-Back Guarantee
                </div>
              </div>
            </div>

            {/* Plan 4 */}
            <div className="bg-[#1c1130] rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-colors shadow-xl">
              <div className="space-y-4">
                <div className="text-xs text-purple-400 font-bold uppercase tracking-widest">Maximum Discount</div>
                <h3 className="text-xl font-extrabold">24 Months Plan</h3>
                
                <div className="space-y-1">
                  <div className="text-4xl font-black text-[#f59e0b]">
                    {selectedCountry.currency}{calculatePrice(129.99, devicesPlan4)}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">
                    Total for {devicesPlan4} screen{devicesPlan4 > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-300">
                    <span>SELECT ACTIVE DEVICES</span>
                    <span className="text-[#f59e0b] font-mono">{devicesPlan4}/5 Screens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setDevicesPlan4(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-black hover:bg-white/15"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center font-mono font-bold text-xs bg-black/60 py-1.5 rounded">
                      {devicesPlan4} Screen{devicesPlan4 > 1 ? 's' : ''}
                    </div>
                    <button 
                      onClick={() => setDevicesPlan4(prev => Math.min(5, prev + 1))}
                      className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-black hover:bg-white/15"
                    >
                      +
                    </button>
                  </div>
                </div>

                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-white/5">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> Lifetime Free IPTV Player</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 30,000+ Live Channels</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 150,000+ Movies & Series</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> Premium Sports Feeds Add-on</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#f59e0b]"/> 24/7 Premium Direct WhatsApp</li>
                </ul>
              </div>

              <div className="pt-6 space-y-3">
                <a 
                  href="https://freetrialiptv.cc/"
                  className="w-full block text-center py-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 text-white font-extrabold text-xs uppercase rounded-xl tracking-wider transition-colors"
                >
                  ⚡ INSTANTLY CONNECT & SAVE
                </a>
                <div className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-wider">
                  🔒 30-Day Money-Back Guarantee
                </div>
              </div>
            </div>

          </div>

          {/* Secure Payments strip */}
          <div className="pt-6 border-t border-white/5 text-center space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-gray-400">SECURE PAYMENT GATEWAYS INTEGRATED</span>
            <div className="flex flex-wrap gap-4 justify-center items-center opacity-75">
              {['Visa', 'Mastercard', 'PayPal', 'Google Pay', 'Apple Pay', 'Bitcoin & USDT'].map((gateway) => (
                <span key={gateway} className="px-4 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-300">
                  {gateway}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">Simple Activation Steps</span>
          <h2 className="text-3xl sm:text-4xl font-black">How to Get Started</h2>
          <p className="text-gray-400 text-sm">
            Deploy your subscription in three basic milestones. No advanced engineering required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-[#1c1130] rounded-2xl border border-white/10 p-8 space-y-4 relative group hover:border-[#f59e0b] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b] text-black font-black flex items-center justify-center text-lg shadow-lg">
              1
            </div>
            <h3 className="text-xl font-bold">Select Your Plan</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Choose the package duration that fits your entertainment criteria. Select the number of screens and place your order.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1c1130] rounded-2xl border border-white/10 p-8 space-y-4 relative group hover:border-[#f59e0b] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b] text-black font-black flex items-center justify-center text-lg shadow-lg">
              2
            </div>
            <h3 className="text-xl font-bold">Receive Connection Grid</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our automated system provisions your login, Xtream API, and M3U files, immediately sending them to your email inside 5 minutes.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#1c1130] rounded-2xl border border-white/10 p-8 space-y-4 relative group hover:border-[#f59e0b] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b] text-black font-black flex items-center justify-center text-lg shadow-lg">
              3
            </div>
            <h3 className="text-xl font-bold">Connect and Stream</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Input the provided portal configuration details on your smart TV, firestick, mobile device or PC to enjoy instant channels.
            </p>
          </div>

        </div>
      </section>

      {/* Multi-Device Support Section */}
      <section id="devices" className="py-20 bg-[#120a21] border-y border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">Flexible Layout</span>
            <h2 className="text-3xl sm:text-4xl font-black">All Streaming Devices Supported</h2>
            <p className="text-gray-400 text-sm">
              We provide specific native configurations for every prominent hardware device in modern television.
            </p>
          </div>

          {/* Device Icons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Amazon Firestick', slug: 'Firestick', image: '/images/device_firestick.webp' },
              { name: 'Samsung / LG Smart', slug: 'Samsung', image: '/images/device_samsung_lg.webp' },
              { name: 'Android TV / Box', slug: 'Android', image: '/images/device_android_tv.webp' },
              { name: 'Apple TV / iOS', slug: 'Apple', image: '/images/device_apple_tv.webp' },
              { name: 'Xbox / Playstation', slug: 'Xbox', image: '/images/device_consoles.webp' },
              { name: 'MAG Box / Enigma2', slug: 'MAG', image: '/images/device_mag_box.webp' }
            ].map((dev) => (
              <div 
                key={dev.name}
                onClick={() => openPSEOGuide(dev.name, 'device')}
                className="bg-[#1c1130] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:border-[#f59e0b] hover:-translate-y-1 transition-all overflow-hidden relative group"
              >
                {/* Device Image with fallback icon */}
                <div className="w-20 h-20 flex items-center justify-center relative">
                  <img 
                    src={dev.image} 
                    alt={`Setup ${dev.name} for 4KTVZ IPTV - Free Trial`}
                    width={80}
                    height={80}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, 'device', dev.name)}
                    className="w-full h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{dev.name}</h4>
                  <span className="text-[10px] text-amber-300 font-extrabold uppercase">Setup Guide →</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dynamic AI Streaming Optimizer & Geolocation Setup Guide (SEO/GEO/AI Summary Hub) */}
      <AISmartHub 
        initialDevice={(() => {
          if (currentPath.startsWith('/iptv-on-')) {
            return formatKeyword(currentPath.replace('/iptv-on-', ''));
          }
          return '';
        })()}
        initialLocation={(() => {
          if (currentPath.startsWith('/iptv-in-')) {
            return formatKeyword(currentPath.replace('/iptv-in-', ''));
          }
          return '';
        })()}
        initialContent={(() => {
          if (currentPath.endsWith('-iptv') && currentPath !== '/') {
            return formatKeyword(currentPath.replace(/^\//, '').replace(/-iptv$/, ''));
          }
          return '';
        })()}
      />

      {/* Customer Love - Visual Rendered Reviews (WhatsApp Chat Bubble Aesthetics) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">E-E-A-T Customer Feedback</span>
          <h2 className="text-3xl sm:text-4xl font-black">What Our Viewers Say</h2>
          <p className="text-gray-400 text-sm">
            Live review feeds from our active customer channels. Fully verified five star streaming solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Review 1 */}
          <div className="bg-[#1c1130] rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-lg relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <img 
                    src="/images/review_user_markus.webp"
                    alt="Markus K. - Verified IPTV Reviewer on 4KTVZ"
                    width={32}
                    height={32}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, 'user', 'Markus K')}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Markus K. (Germany)</h4>
                    <span className="text-[9px] text-gray-500 font-mono">Via Telegram</span>
                  </div>
                </div>
                <span className="bg-green-500/10 text-green-400 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Verified Customer</span>
              </div>

              {/* Chat-bubble style */}
              <div className="space-y-2">
                <div className="bg-[#25183d] p-3 rounded-xl rounded-tl-none border border-white/5 text-xs text-gray-200">
                  "Hi support team! I just finished watching the full Champions League night stream. Literally zero lag or pixelation. Absolute perfect 4K quality! 🇩🇪"
                </div>
                <div className="bg-black/40 p-3 rounded-xl rounded-tr-none border border-white/5 text-xs text-amber-300 ml-4">
                  "Thanks for the support Markus! Glad our Frankfurt servers are routing seamlessly for you! ⚽"
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-1 text-amber-400">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />)}
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-[#1c1130] rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-lg relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <img 
                    src="/images/review_user_tyler.webp"
                    alt="Tyler H. - Verified IPTV Reviewer on 4KTVZ"
                    width={32}
                    height={32}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, 'user', 'Tyler H')}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Tyler H. (UK)</h4>
                    <span className="text-[9px] text-gray-500 font-mono">Via WhatsApp</span>
                  </div>
                </div>
                <span className="bg-green-500/10 text-green-400 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Verified Customer</span>
              </div>

              {/* Chat-bubble style */}
              <div className="space-y-2">
                <div className="bg-[#25183d] p-3 rounded-xl rounded-tl-none border border-white/5 text-xs text-gray-200">
                  "Skeptical at first because of other providers scamming, but HappyStreamz is different. Setup took less than 4 minutes on my firestick. 150k VODs is insane."
                </div>
                <div className="bg-black/40 p-3 rounded-xl rounded-tr-none border border-white/5 text-xs text-amber-300 ml-4">
                  "Welcome on board Tyler! Enjoy the streams! 🍿"
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-1 text-amber-400">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />)}
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-[#1c1130] rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-lg relative">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <img 
                    src="/images/review_user_sarah.webp"
                    alt="Sarah D. - Verified IPTV Reviewer on 4KTVZ"
                    width={32}
                    height={32}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, 'user', 'Sarah D')}
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Sarah D. (Canada)</h4>
                    <span className="text-[9px] text-gray-500 font-mono">Via Chat Desk</span>
                  </div>
                </div>
                <span className="bg-green-500/10 text-green-400 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Verified Customer</span>
              </div>

              {/* Chat-bubble style */}
              <div className="space-y-2">
                <div className="bg-[#25183d] p-3 rounded-xl rounded-tl-none border border-white/5 text-xs text-gray-200">
                  "My husband is watching NHL on the living room TV and kids have Disney plus on their tablets. Dynamic multiscreen works flawless. Love the currency adjust!"
                </div>
                <div className="bg-black/40 p-3 rounded-xl rounded-tr-none border border-white/5 text-xs text-amber-300 ml-4">
                  "Perfect Sarah! Thanks for choosing HappyStreamz! 🍁"
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-1 text-amber-400">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />)}
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 bg-[#120a21] border-y border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">Frequently Asked Questions</span>
            <h2 className="text-3xl font-black">Need Help? We've Got You Covered</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How can I request an IPTV free trial or free try iptv test?",
                a: "Getting your free try iptv test account is incredibly easy! You can instantly activate our 24-hour IPTV free trial or claim our premium 72-hour trial key to test all 30,000+ premium live channels and 150,000+ cinematic VOD titles on your favorite streaming device before subscribing. Just hit any trial button to get started."
              },
              {
                q: "Is the best iptv 72 hour trial completely free?",
                a: "Yes, our best iptv 72 hour trial is 100% free with no credit card details or obligations required. It provisions a high-speed iptv test account featuring ultimate access to global sports networks, live pay-per-view (PPV) matches, premium movies, and regional television streams."
              },
              {
                q: "How fast is active deployment?",
                a: "Once your payment compiles, our server clusters configure your lines instantly. You will receive an automated dispatch containing configuration links and login details to your specified email inside 5 minutes. If you need any assistance, reach out to freeiptvstream@gmail.com."
              },
              {
                q: "What devices do you officially support?",
                a: "We support ALL prominent smart platforms: Amazon Firestick, Android smartboxes, Apple TV, iOS, Android tablets, smart TVs (Samsung, LG, Sony), MAG boxes, Formuler, Enigma2, and standard desktop browsers."
              },
              {
                q: "Do you enforce IP address locks?",
                a: "Absolutely not. HappyStreamz supports full mobility. You can utilize your IPTV lines anywhere in the world on vacation or work trips. However, the number of simultaneous active streams depends on your selected device configuration."
              },
              {
                q: "What is your refund policy?",
                a: "We are confident you will love HappyStreamz. We officially back all orders with a solid 30-Day Money-Back Guarantee. If our service clusters fail to satisfy your criteria, speak to our support desk via freeiptvstream@gmail.com for an immediate response."
              },
              {
                q: "Does HappyStreamz include TV Guides (EPG)?",
                a: "Yes, our M3U Playlists and Xtream Code links automatically load with full Electronic Program Guide metadata, synced and updated daily across sports, premium movie streams, and international stations."
              },
              {
                q: "Where can I get technical support or assistance?",
                a: (
                  <span>
                    We offer 24/7 technical customer support. If you have questions about setting up your IPTV test account, troubleshooting, or general configuration, email us anytime at{" "}
                    <a href="mailto:freeiptvstream@gmail.com" className="text-[#f59e0b] hover:underline font-bold" aria-label="Email HappyStreamz support at freeiptvstream@gmail.com">
                      freeiptvstream@gmail.com
                    </a>
                    . We average a response time of under 4 minutes!
                  </span>
                )
              }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#1c1130] rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  aria-label={`Toggle answer for ${faq.q}`}
                  aria-expanded={activeFaq === idx}
                  className="w-full px-6 py-5 flex justify-between items-center font-bold text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-sm sm:text-base text-white">{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#f59e0b]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Programmatic SEO Core Content Block (Crawlable Intro & Conclusion Card) */}
      {isPSEORoute(currentPath) && (() => {
        const seoContent = generateSEOContent(currentPath);
        return (
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/10 space-y-8">
            <div className="bg-gradient-to-b from-[#1c1130] to-[#120a21] border border-[#f59e0b]/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/10 to-transparent w-40 h-40 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-[#f59e0b] animate-pulse" />
                <span className="text-[#f59e0b] text-xs sm:text-sm font-black uppercase tracking-widest">Verified Optimization Node</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                Programmatic Indexing & Setup for <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{seoContent.name}</span>
              </h2>
              <div className="space-y-6 text-sm sm:text-base text-gray-300 leading-relaxed">
                <p className="border-l-4 border-amber-500 pl-4 py-1 italic bg-white/5 rounded-r-lg">
                  {seoContent.intro}
                </p>
                <div className="h-px bg-white/10 my-4"></div>
                <p>
                  {seoContent.conclusion}
                </p>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Programmatic SEO Link Grid (pSEO Section) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[#f59e0b] text-xs uppercase font-extrabold tracking-widest">Automated Search Directory</span>
          <h3 className="text-xl font-bold">Browse IPTV Classifications</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Countries Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Browse by Country</h4>
            <div className="flex flex-wrap gap-2">
              {[
                'United States', 'United Kingdom', 'Canada', 'Germany', 'Australia', 'France', 'Spain', 'Netherlands', 
                'Italy', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'New York', 
                'California', 'Texas', 'Florida', 'London'
              ].map((c) => (
                <a 
                  key={c}
                  href={`/iptv-in-${c.toLowerCase().replace(/ /g, '-')}`}
                  onClick={(e) => navigateTo(e, `/iptv-in-${c.toLowerCase().replace(/ /g, '-')}`)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white rounded-lg transition-colors border border-white/5 hover:border-[#f59e0b]/30"
                >
                  IPTV in {c}
                </a>
              ))}
            </div>
          </div>

          {/* Devices Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Device Guides</h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Firestick', 'Samsung Smart TV', 'LG Smart TV', 'Apple TV', 'Chromecast', 'MAG Box', 'Enigma2', 'Formuler Z', 
                'Android', 'iOS', 'Windows', 'Mac', 'Xbox', 'Playstation', 'Nvidia Shield', 'Smart TV', 'Roku', 'Tivimate', 
                'GSE Smart IPTV', 'IPTV Smarters'
              ].map((d) => (
                <a 
                  key={d}
                  href={`/iptv-on-${d.toLowerCase().replace(/ /g, '-')}`}
                  onClick={(e) => navigateTo(e, `/iptv-on-${d.toLowerCase().replace(/ /g, '-')}`)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white rounded-lg transition-colors border border-white/5 hover:border-[#f59e0b]/30"
                >
                  {d} Setup
                </a>
              ))}
            </div>
          </div>

          {/* Content Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">Content Streams</h4>
            <div className="flex flex-wrap gap-2">
              {[
                'Live Sports', 'Premium Movie Channels', 'Latino Channels', 'Sky Sports', 'EPG Catchup Guide', 'PPV Main Event', 
                'UFC IPTV Channel', 'French TV Box', '4K Channels', 'Arabic Channels', 'UK Channels', 'US Channels', 
                'CA Channels', 'Indian Channels', 'Pakistani Channels', 'BeinSports', 'F1 Live', 'Champions League', 
                'Premier League', 'La Liga'
              ].map((cn) => {
                const slug = cn.toLowerCase().replace(/ /g, '-');
                return (
                  <a 
                    key={cn}
                    href={`/${slug}-iptv`}
                    onClick={(e) => navigateTo(e, `/${slug}-iptv`)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 hover:text-white rounded-lg transition-colors border border-white/5 hover:border-[#f59e0b]/30"
                  >
                    {cn}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Main Footer */}
      <footer className="bg-black/80 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10" aria-label="Main Website Footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center text-black font-bold text-xs" aria-hidden="true">
                4K
              </div>
              <span className="font-extrabold text-lg text-white">HAPPYSTREAMZ PREMIUM</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Get your ultimate <span className="text-white font-semibold">IPTV free trial</span> or <span className="text-white font-semibold">free try iptv</span> test account today on HappyStreamz. Experience why we are voted the <span className="text-white font-semibold">best iptv 72 hour trial</span> and subscription platform with over 30,000 live feeds operating on high-performance CDN clusters since 2018.
            </p>
            <div className="text-[10px] text-gray-500 space-y-1">
              <div>Operating as: HAPPYSTREAMZ LTD</div>
              <div>Company Registered in England & Wales</div>
              <div>License Number: 15550079</div>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-[#f59e0b] tracking-wider">Contact Us</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gray-500" />
                <a 
                  href="mailto:freeiptvstream@gmail.com" 
                  className="hover:text-[#f59e0b] transition-colors font-bold underline decoration-amber-500/20" 
                  aria-label="Email HappyStreamz support at freeiptvstream@gmail.com"
                >
                  freeiptvstream@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-gray-500" />
                <span aria-label="WhatsApp Contact Number">WhatsApp: +33 6 44 65 05 33</span>
              </li>
              <li className="text-[10px] text-amber-300 bg-white/5 p-2 rounded border border-white/5">
                🔥 Average dispatch time: 4 minutes
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-[#f59e0b] tracking-wider">Useful Links</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <a 
                  href="/free-iptv-trial" 
                  onClick={(e) => navigateTo(e, '/free-iptv-trial')} 
                  className="hover:text-white transition-colors underline decoration-[#f59e0b]/30"
                  aria-label="Claim your IPTV instant trial"
                >
                  iptv instant trial
                </a>
              </li>
              <li>
                <a 
                  href="/iptv-free-trial" 
                  onClick={(e) => navigateTo(e, '/iptv-free-trial')} 
                  className="hover:text-white transition-colors underline decoration-[#f59e0b]/30"
                  aria-label="Claim your IPTV trial"
                >
                  iptv trial
                </a>
              </li>
              <li>
                <a 
                  href="/free-iptv-trial" 
                  onClick={(e) => navigateTo(e, '/free-iptv-trial')} 
                  className="hover:text-white transition-colors underline decoration-[#f59e0b]/30"
                  aria-label="Get a free IPTV test account"
                >
                  iptv test account
                </a>
              </li>
              <li>
                <a 
                  href="/iptv-72-hour-free-trial" 
                  onClick={(e) => navigateTo(e, '/iptv-72-hour-free-trial')} 
                  className="hover:text-white transition-colors underline decoration-[#f59e0b]/30"
                  aria-label="Request 72 hour IPTV free trial"
                >
                  iptv 72 hour free trial
                </a>
              </li>
              <li>
                <a 
                  href="/blog" 
                  onClick={(e) => navigateTo(e, '/blog')} 
                  className="hover:text-white transition-colors underline decoration-[#f59e0b]/30 font-bold"
                  aria-label="Read our IPTV free trial and streaming guides blog"
                >
                  iptv free trial & streaming guides (blog)
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Compliance Disclaimer */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-red-500 tracking-wider">Copyright & DMCA</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              HappyStreamz is a technical subscription facilitator. We do not host, store, or stream raw media files on our physical databases. All streams route dynamically via legal public relays. For compliance write us at <a href="mailto:freeiptvstream@gmail.com" className="hover:text-white transition-colors underline" aria-label="Email DMCA compliance inquiries to freeiptvstream@gmail.com">freeiptvstream@gmail.com</a>.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 text-center">
          <div>
            © 2026-2027 HappyStreamz Ltd. All Rights Reserved worldwide.
          </div>
          <div className="flex gap-4">
            <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-gray-300" aria-label="View Privacy Policy details">Privacy Policy</a>
            <span>•</span>
            <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-gray-300" aria-label="View Terms of Use agreements">Terms of Use</a>
            <span>•</span>
            <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-gray-300" aria-label="View Refund Policy rules">Refund Policy</a>
          </div>
        </div>
      </footer>

      {/* --- TRAILER MODAL OVERLAY --- */}
      {activeTrailer && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1c1130] border border-white/10 max-w-lg w-full rounded-2xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setActiveTrailer(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className={`h-48 bg-gradient-to-br ${activeTrailer.accent} p-6 flex flex-col justify-end relative`}>
              <span className="bg-black/50 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider absolute top-6 left-6">{activeTrailer.badge}</span>
              <h3 className="text-2xl font-black text-white">{activeTrailer.title}</h3>
              <p className="text-xs text-[#f59e0b] font-bold uppercase">{activeTrailer.genre} • Release {activeTrailer.year}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-extrabold text-sm text-white">{activeTrailer.rating} / 10</span>
                <span className="text-xs text-gray-400 ml-1">(Highly recommended by HappyStreamz catalog editors)</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {activeTrailer.synopsis}
              </p>
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5"/> Instant Stream Active
                </div>
                <div className="text-[11px] text-gray-400">
                  Ready to stream on your Firestick, Smart TV, or Mobile device. Connect with any plan.
                </div>
              </div>
              <div className="flex gap-4">
                <a 
                  href="https://freetrialiptv.cc/"
                  className="flex-1 py-3 bg-[#f59e0b] text-black text-xs font-extrabold uppercase rounded-lg tracking-wider hover:brightness-110 text-center flex items-center justify-center"
                >
                  Get Instant Streaming Link
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- pSEO CUSTOM HUB GUIDE MODAL --- */}
      {pSEOGuide && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1c1130] border border-white/10 max-w-lg w-full rounded-2xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setPSEOGuide(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#f59e0b] pb-2 border-b border-white/5">
                <Globe className="w-5 h-5"/>
                <h3 className="text-lg font-black text-white">{pSEOGuide.title}</h3>
              </div>
              
              <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {pSEOGuide.content}
              </div>

              <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5"/> 100% Geo-Authorized Hub
                </div>
                <div className="text-[11px] text-gray-400">
                  Fully calibrated on our high-speed multi-gigabit routing lines. Guaranteed 99.9% uptime with instant delivery.
                </div>
              </div>

              <div className="flex gap-4">
                <a 
                  href="https://freetrialiptv.cc/"
                  className="flex-1 py-3 bg-[#f59e0b] text-black text-xs font-extrabold uppercase rounded-lg tracking-wider text-center flex items-center justify-center"
                >
                  Deploy Plan in {pSEOGuide.title}
                </a>
                <a 
                  href="https://wa.me/33644650533?text=Hello,%20I%20need%20support%20regarding%20HappyStreamz%20setup."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase rounded-lg tracking-wider text-center flex items-center justify-center"
                >
                  Ask Support
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FLOATING WHATSAPP SUPPORT BUTTON --- */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://wa.me/33644650533?text=Hello,%20I%20have%20a%20question%20about%20HappyStreamz."
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all relative group"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0f071a]"></span>
          {/* Tooltip */}
          <span className="absolute right-16 bg-[#1c1130] border border-white/10 text-[11px] font-bold text-white px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
            Need Help? Chat on WhatsApp
          </span>
        </a>
      </div>

    </div>
  );
}
