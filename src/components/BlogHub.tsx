import React, { useState, useMemo, useEffect } from 'react';
import { BLOG_POSTS, BlogPost, getBlogPostContent, getRelatedPosts } from '../blogData';
import { 
  BookOpen, 
  Cpu, 
  Globe, 
  Activity, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  Search, 
  ArrowRight,
  Tv,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Zap,
  Play
} from 'lucide-react';

interface BlogHubProps {
  currentPath: string;
  navigateTo: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
}

export default function BlogHub({ currentPath, navigateTo }: BlogHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(12);

  // Extract the slug if current path is a subpath of blog (e.g. /blog/setup-iptv-free-trial-firestick)
  const currentPostSlug = useMemo(() => {
    if (currentPath.startsWith('/blog/')) {
      return currentPath.replace(/^\/blog\//, '');
    }
    return null;
  }, [currentPath]);

  // Find the active blog post if on a subpath
  const activePost = useMemo(() => {
    if (!currentPostSlug) return null;
    return BLOG_POSTS.find(p => p.slug === currentPostSlug) || null;
  }, [currentPostSlug]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchQuery]);

  // Update document metadata for blog pages (Canonical, OG, and Twitter Cards)
  useEffect(() => {
    let title = "IPTV Free Trial & Streaming Guides | HappyStreamz™ Blog Hub";
    let desc = "Get the ultimate IPTV setup tutorials, live sports streaming lists, VPN security tips, and test account guides. Explore 100+ professional streaming articles.";

    if (activePost) {
      title = `${activePost.title} | HappyStreamz™ Guide`;
      desc = activePost.excerpt;
    }

    if (activePost || currentPath === '/blog') {
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
    }
  }, [activePost, currentPath]);

  // Categories list
  const categories = ['All', 'Setup Guides', 'Sports Streaming', 'Reviews & Tech', 'Global TV Guides'];

  // Map category to aesthetic icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Setup Guides': return <Cpu className="w-4 h-4" />;
      case 'Sports Streaming': return <Activity className="w-4 h-4" />;
      case 'Reviews & Tech': return <TrendingUp className="w-4 h-4" />;
      case 'Global TV Guides': return <Globe className="w-4 h-4" />;
      default: return <Compass className="w-4 h-4" />;
    }
  };

  // Map category to color scheme classes
  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case 'Setup Guides': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'Sports Streaming': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Reviews & Tech': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Global TV Guides': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  // Pre-filter posts for visual UI list (incorporates search & category filters)
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Render Post Detail View
  if (activePost) {
    const { intro, sections, conclusion } = getBlogPostContent(activePost);
    const related = getRelatedPosts(activePost.slug, activePost.category);

    return (
      <div id="blog-post-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Breadcrumbs & Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
          <a href="/" onClick={(e) => navigateTo(e, '/')} className="hover:text-[#f59e0b] transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <a href="/blog" onClick={(e) => navigateTo(e, '/blog')} className="hover:text-[#f59e0b] transition-colors">Blog</a>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#f59e0b] font-bold truncate max-w-[200px] sm:max-w-xs">{activePost.category}</span>
        </div>

        {/* Back Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/blog');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs sm:text-sm font-bold text-[#f59e0b] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guides Index
        </button>

        {/* Article Header */}
        <article className="space-y-6">
          <div className="space-y-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryColorClass(activePost.category)}`}>
              {getCategoryIcon(activePost.category)}
              {activePost.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-gray-100 to-[#f59e0b] bg-clip-text text-transparent">
              {activePost.title}
            </h1>
          </div>

          {/* Author/Date Meta */}
          <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center font-black text-black text-xs">
                HS
              </div>
              <div>
                <span className="font-bold text-gray-200">HappyStreamz Editorial</span>
                <span className="text-[10px] text-gray-500 block">Streaming Tech Specialist</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>{activePost.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{activePost.readTime}</span>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-invert prose-amber max-w-none text-gray-300 leading-relaxed text-sm sm:text-base space-y-8">
            <p className="text-gray-200 text-base sm:text-lg font-medium leading-relaxed border-l-2 border-[#f59e0b] pl-4 italic">
              {intro}
            </p>

            {sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-white mt-8 tracking-tight flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="text-[#f59e0b]">{section.title.split(' ')[0]}</span>
                  {section.title.split(' ').slice(1).join(' ')}
                </h3>
                <div className="whitespace-pre-line text-gray-300 pl-1">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Visual Callout Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-indigo-950/40 border border-[#f59e0b]/20 flex gap-4 items-start">
              <AlertCircle className="w-6 h-6 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm sm:text-base">Anti-Freeze Integration Notice</h4>
                <p className="text-xs sm:text-sm text-gray-300">
                  All setups configured under HappyStreamz are connected automatically to our server architecture backing up to 4K resolution streams. No manual buffering codes are necessary. If you experience lags, please ensure that no other bandwidth-heavy downloads are running on your gateway.
                </p>
              </div>
            </div>

            <p className="whitespace-pre-line text-gray-300">
              {conclusion}
            </p>
          </div>
        </article>

        {/* HappyStreamz Promo CTA Box */}
        <div id="blog-cta-card" className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-[#1c1130] to-purple-950 border-2 border-[#f59e0b]/30 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] text-[10px] font-extrabold uppercase tracking-widest border border-[#f59e0b]/25">
              <Zap className="w-3 h-3 animate-pulse" /> Stream Buffer-Free Today
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Ready to Put Your Setup to the Test?</h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Don't compromise on stream quality. Get premium access to over 30,000 global channels, 150,000+ movies & VOD, and ultra-smooth sports channels with HappyStreamz's leading Anti-Freeze infrastructure. Set up your account in 5 minutes!
            </p>
          </div>

          <div className="flex flex-wrap gap-4 relative z-10">
            <a 
              href="https://freetrialiptv.cc/"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:brightness-110 text-black text-xs sm:text-sm font-black uppercase rounded-xl tracking-wider shadow-lg flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-black text-black" /> Get Instant Trial Account
            </a>
            <a 
              href="/#pricing"
              onClick={(e) => navigateTo(e, '/#pricing')}
              className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs sm:text-sm font-bold uppercase rounded-xl tracking-wider transition-all"
            >
              View Pricing Plans
            </a>
          </div>
        </div>

        {/* Related Articles Section */}
        {related.length > 0 && (
          <div className="space-y-6 border-t border-white/10 pt-10">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f59e0b]" /> Keep Reading: More Guides on {activePost.category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  onClick={(e) => navigateTo(e, `/blog/${post.slug}`)}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#f59e0b]/30 hover:bg-white/10 transition-all space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider block">
                      {post.category}
                    </span>
                    <h4 className="font-extrabold text-white text-sm group-hover:text-[#f59e0b] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Setup Directories (pSEO Internal Links) */}
        <div className="space-y-6 border-t border-white/10 pt-10">
          <h3 className="text-xl sm:text-2xl font-black text-[#f59e0b] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f59e0b]" /> Global Regional Setup Directories
          </h3>
          <p className="text-xs text-gray-400">
            Select your country or preferred streaming device below to unlock dedicated high-speed server guides and local television channel configurations:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'United States', path: '/iptv-in-united-states' },
              { name: 'United Kingdom', path: '/iptv-in-united-kingdom' },
              { name: 'Canada', path: '/iptv-in-canada' },
              { name: 'Germany', path: '/iptv-in-germany' },
              { name: 'Australia', path: '/iptv-in-australia' },
              { name: 'Sweden', path: '/iptv-in-sweden' },
              { name: 'Firestick Setup', path: '/iptv-on-firestick' },
              { name: 'Apple TV Setup', path: '/iptv-on-apple-tv' },
              { name: 'Samsung TV Setup', path: '/iptv-on-samsung-smart-tv' },
              { name: 'LG TV Setup', path: '/iptv-on-lg-smart-tv' },
              { name: 'Tivimate Guide', path: '/iptv-on-tivimate' },
              { name: 'Live Sports IPTV', path: '/live-sports-iptv' }
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => navigateTo(e, item.path)}
                className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#f59e0b]/30 hover:bg-[#120a21] text-xs text-center font-bold text-gray-300 hover:text-white transition-all"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Blog Index View (All 100 links generated programmatically)
  return (
    <div id="blog-index-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Title & SEO Header Block */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest border border-[#f59e0b]/20">
          <BookOpen className="w-3.5 h-3.5" /> HappyStreamz Technical Hub
        </div>
        <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-gray-100 to-[#f59e0b] bg-clip-text text-transparent">
          IPTV Free Trial & Streaming Guides
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Unlock maximum capability with professional walkthroughs, setup guides, sports stream schedules, and VPN security logs tailored for our elite global nodes.
        </p>
      </div>

      {/* Interactive Controls Bar: Search & Category Filters */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#120a21] border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Inputs */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search 100+ streaming guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f071a] border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="md:col-span-8 flex flex-wrap gap-2 justify-start md:justify-end overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                  selectedCategory === cat 
                    ? 'bg-[#f59e0b] text-black border-[#f59e0b] shadow-lg shadow-[#f59e0b]/10' 
                    : 'bg-[#0f071a] text-gray-300 border-white/10 hover:border-[#f59e0b]/30'
                }`}
              >
                {getCategoryIcon(cat)}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEO-Optimized Crawlable Article Grid */}
      <div id="blog-posts-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/*
          CRITICAL SEO INFRASTRUCTURE IMPLEMENTATION:
          To comply with extreme SEO crawler indexing metrics, we render ALL 100 blog posts in the DOM so they are fully crawlable by Google Search Console. 
          For perfect Core Web Vitals (FCP, LCP) and page performance, we visually hide (using display: none) posts that are paginated out or filtered.
        */}
        {BLOG_POSTS.map((post, idx) => {
          // Check filters to see if the item would be included in the results
          const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
          const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
          
          const isFilterMatch = matchesCategory && matchesSearch;

          // Track if we should visually show this item on screen
          // We can find the visual index of this post inside the filtered array
          const visualIndex = isFilterMatch ? filteredPosts.findIndex(p => p.slug === post.slug) : -1;
          const isVisuallyVisible = isFilterMatch && visualIndex !== -1 && visualIndex < visibleCount;

          return (
            <article
              key={post.slug}
              className={`group flex flex-col justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#f59e0b]/30 hover:bg-[#120a21] hover:shadow-2xl hover:shadow-[#f59e0b]/5 active:scale-[0.99] transition-all duration-300 space-y-6 ${
                isVisuallyVisible ? '' : 'pointer-events-none'
              }`}
              style={{ display: isVisuallyVisible ? 'flex' : 'none' }}
            >
              <div className="space-y-3">
                {/* Post Category Tag */}
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getCategoryColorClass(post.category)}`}>
                  {getCategoryIcon(post.category)}
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-black text-white group-hover:text-[#f59e0b] transition-colors leading-snug line-clamp-2">
                  <a 
                    href={`/blog/${post.slug}`} 
                    onClick={(e) => navigateTo(e, `/blog/${post.slug}`)}
                    className="focus:outline-none"
                  >
                    {post.title}
                  </a>
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Meta & Action Link */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#f59e0b]/60" /> {post.date.split(',')[0]}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#f59e0b]/60" /> {post.readTime}
                  </span>
                </div>

                <a 
                  href={`/blog/${post.slug}`} 
                  onClick={(e) => navigateTo(e, `/blog/${post.slug}`)}
                  className="inline-flex items-center gap-1 text-xs font-black text-[#f59e0b] uppercase tracking-wider group-hover:gap-2 transition-all"
                >
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* No Results Fallback */}
      {filteredPosts.length === 0 && (
        <div className="text-center p-12 rounded-3xl bg-white/5 border border-white/10 space-y-3">
          <HelpCircle className="w-12 h-12 text-[#f59e0b] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-white">No Guides Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            We couldn't find any articles matching "{searchQuery}". Try selecting another category tab or expanding your search keys.
          </p>
        </div>
      )}

      {/* UX Lazy Load Pagination Button */}
      {filteredPosts.length > visibleCount && (
        <div className="text-center pt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 12)}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs uppercase rounded-xl tracking-wider hover:brightness-110 shadow-lg active:scale-95 transition-all"
          >
            Load More Articles ({filteredPosts.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Recommended Setup Directories (pSEO Internal Links) */}
      <div className="space-y-6 border-t border-white/10 pt-10">
        <h3 className="text-xl sm:text-2xl font-black text-[#f59e0b] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#f59e0b]" /> Global Regional Setup Directories
        </h3>
        <p className="text-xs text-gray-400">
          Select your country or preferred streaming device below to unlock dedicated high-speed server guides and local television channel configurations:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'United States', path: '/iptv-in-united-states' },
            { name: 'United Kingdom', path: '/iptv-in-united-kingdom' },
            { name: 'Canada', path: '/iptv-in-canada' },
            { name: 'Germany', path: '/iptv-in-germany' },
            { name: 'Australia', path: '/iptv-in-australia' },
            { name: 'Sweden', path: '/iptv-in-sweden' },
            { name: 'Firestick Setup', path: '/iptv-on-firestick' },
            { name: 'Apple TV Setup', path: '/iptv-on-apple-tv' },
            { name: 'Samsung TV Setup', path: '/iptv-on-samsung-smart-tv' },
            { name: 'LG TV Setup', path: '/iptv-on-lg-smart-tv' },
            { name: 'Tivimate Guide', path: '/iptv-on-tivimate' },
            { name: 'Live Sports IPTV', path: '/live-sports-iptv' }
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => navigateTo(e, item.path)}
              className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#f59e0b]/30 hover:bg-[#120a21] text-xs text-center font-bold text-gray-300 hover:text-white transition-all"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
