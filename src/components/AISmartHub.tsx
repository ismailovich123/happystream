import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Globe, Tv, Zap, RefreshCw, Send, ShieldCheck, Play } from 'lucide-react';

interface AISmartHubProps {
  initialDevice?: string;
  initialLocation?: string;
  initialContent?: string;
}

const DEVICES = [
  'Amazon Firestick',
  'Samsung Smart TV',
  'LG Smart TV',
  'Apple TV',
  'Android TV / Nvidia Shield',
  'MAG Box / Enigma2',
  'Formuler Z'
];

const POPULAR_LOCATIONS = [
  'United Kingdom',
  'United States',
  'Canada',
  'Germany',
  'Australia',
  'Sweden',
  'Spain',
  'France',
  'Netherlands'
];

const CONTENT_PACKAGES = [
  'Premier League Live',
  'Sky Sports & TNT Sports',
  'UFC PPV Main Events',
  'Champions League Football',
  'Premium Movies & 4K Cinema VOD',
  'US & Canada Local Networks'
];

export default function AISmartHub({ initialDevice = '', initialLocation = '', initialContent = '' }: AISmartHubProps) {
  const [selectedDevice, setSelectedDevice] = useState(initialDevice || DEVICES[0]);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || POPULAR_LOCATIONS[0]);
  const [selectedContent, setSelectedContent] = useState(initialContent || CONTENT_PACKAGES[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "🤖 Booting HappyStreamz AI Optimizer...",
    "🌐 Locating optimal regional CDN edge nodes...",
    "🔒 Injecting anti-freeze connection parameters...",
    "⚡ Bypassing potential local ISP throttling...",
    "📱 Tailoring setup installation guide for your device...",
    "✨ Compiling customized high-definition sports guide...",
    "🎉 Finalizing your high-authority streaming summary..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Sync initial props if they change (e.g. when navigating pSEO routes)
  useEffect(() => {
    if (initialDevice) setSelectedDevice(initialDevice);
    if (initialLocation) setSelectedLocation(initialLocation);
    if (initialContent) setSelectedContent(initialContent);
  }, [initialDevice, initialLocation, initialContent]);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setLoadingMessageIndex(0);

    try {
      const response = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device: selectedDevice,
          location: selectedLocation,
          contentStream: selectedContent,
          customPrompt: customPrompt.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Server responded with an error while generating report.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiReport(data.summary);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to connect to the HappyStreamz AI server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render markdown-like structures into beautiful styled JSX elements
  const renderFormattedReport = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={index} className="h-3" />;
      }

      // Headers
      if (trimmed.startsWith('###')) {
        return (
          <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            {trimmed.replace(/^###\s*/, '')}
          </h3>
        );
      }
      if (trimmed.startsWith('####')) {
        return (
          <h4 key={index} className="text-lg font-bold text-[#f59e0b] mt-5 mb-2 flex items-center gap-2">
            {trimmed.replace(/^####\s*/, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h2 key={index} className="text-2xl font-black text-white mt-8 mb-4 border-l-4 border-amber-500 pl-3">
            {trimmed.replace(/^##\s*/, '')}
          </h2>
        );
      }
      if (trimmed.startsWith('#')) {
        return (
          <h1 key={index} className="text-3xl font-black text-white mt-8 mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            {trimmed.replace(/^#\s*/, '')}
          </h1>
        );
      }

      // Bold sections formatting inside lines (simple parser for strong tags)
      const parseBoldText = (str: string) => {
        const parts = str.split('**');
        return parts.map((part, i) => {
          if (i % 2 === 1) {
            return <strong key={i} className="text-amber-300 font-extrabold">{part}</strong>;
          }
          // handle single bold markups too
          const innerParts = part.split('*');
          return innerParts.map((inner, j) => {
            if (j % 2 === 1) {
              return <strong key={j} className="text-white font-bold">{inner}</strong>;
            }
            return inner;
          });
        });
      };

      // Bullet Points
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const bulletText = trimmed.replace(/^[\*\-]\s*/, '');
        return (
          <ul key={index} className="list-none pl-6 my-2">
            <li className="flex items-start gap-2.5 text-sm sm:text-base text-gray-300">
              <span className="text-[#f59e0b] text-base mt-1">•</span>
              <span>{parseBoldText(bulletText)}</span>
            </li>
          </ul>
        );
      }

      // Numbered items
      if (/^\d+\./.test(trimmed)) {
        const numText = trimmed.replace(/^\d+\.\s*/, '');
        const num = trimmed.match(/^\d+/)![0];
        return (
          <div key={index} className="flex items-start gap-3 my-3 bg-white/5 rounded-xl p-3 border border-white/5 pl-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black shrink-0 mt-0.5">
              {num}
            </span>
            <span className="text-sm sm:text-base text-gray-300">{parseBoldText(numText)}</span>
          </div>
        );
      }

      // Default paragraph
      return (
        <p key={index} className="text-sm sm:text-base text-gray-300 leading-relaxed my-2">
          {parseBoldText(trimmed)}
        </p>
      );
    });
  };

  return (
    <section id="ai-smart-hub" className="py-20 bg-gradient-to-b from-[#0f071a] to-[#120a21] border-t border-white/10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Visual background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 text-[#c084fc] text-xs font-bold uppercase tracking-widest animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Streaming Optimizer
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Generate Your Custom <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-purple-400 bg-clip-text text-transparent">AI Setup & Speed Report</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Configure your exact device, country, and content to compile a personalized, high-performance streaming setup guide generated instantly by Gemini AI.
          </p>
        </div>

        {/* Input Configuration Box */}
        <div className="bg-[#1c1130]/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/10 to-transparent w-32 h-32 rounded-bl-full pointer-events-none" />
          
          <form onSubmit={handleGenerateReport} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Device Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5" />
                  1. Selected Device
                </label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer"
                  aria-label="Select your streaming device"
                >
                  {DEVICES.map((dev) => (
                    <option key={dev} value={dev} className="bg-[#120a21]">{dev}</option>
                  ))}
                </select>
              </div>

              {/* Location Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  2. Your Country
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer"
                  aria-label="Select your geographic location"
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#120a21]">{loc}</option>
                  ))}
                </select>
              </div>

              {/* Package Selector */}
              <div className="space-y-2">
                <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  3. Content Stream
                </label>
                <select
                  value={selectedContent}
                  onChange={(e) => setSelectedContent(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer"
                  aria-label="Select content package to optimize"
                >
                  {CONTENT_PACKAGES.map((pkg) => (
                    <option key={pkg} value={pkg} className="bg-[#120a21]">{pkg}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Custom Question field */}
            <div className="space-y-2">
              <label className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Optional: Ask Specific Questions or Specify Setup Players
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Can you explain how to set up HappyStreamz on TiviMate? What is the server latency in London?"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors placeholder:text-gray-500"
                  aria-label="Custom questions for streaming optimization"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300 disabled:text-gray-600 transition-colors"
                  aria-label="Send query"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400 order-last sm:order-first">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Uncompressed 4K Server Optimization • No sign-up required</span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold uppercase text-xs tracking-wider px-8 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating AI Report...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-black fill-black" />
                    Compile Personalized AI Speed Guide
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Loading Display */}
          {isLoading && (
            <div className="mt-8 bg-black/60 border border-purple-500/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-amber-400 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <p className="text-amber-400 font-bold text-sm transition-all duration-300">
                  {loadingMessages[loadingMessageIndex]}
                </p>
                <p className="text-xs text-gray-500 font-mono">Bypassing local ISP bottlenecks...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-8 bg-red-950/20 border border-red-500/30 text-red-300 text-sm p-4 rounded-xl flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* AI Report Result Display */}
          {!isLoading && aiReport && (
            <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar scroll-smooth">
              
              {/* Report Header badge */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest">Optimized Real-time Report</span>
                </div>
                <button
                  onClick={() => setAiReport(null)}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline cursor-pointer"
                >
                  Clear Report ×
                </button>
              </div>

              {/* Formatted Content */}
              <div className="prose prose-invert prose-amber max-w-none">
                {renderFormattedReport(aiReport)}
              </div>

              {/* Conversion CTA embedded in report */}
              <div className="mt-8 bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-[#f59e0b]/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-black text-white">Unlock Server Route Instantly</h4>
                  <p className="text-xs text-gray-400">Claim your 24-Hour IPTV Free Trial and start streaming in uncompressed 4K today.</p>
                </div>
                <a
                  href="#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('pricing');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-black text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
                >
                  Get Access Now →
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
