export const CORE_PATHS = [
  '/',
  '/free-iptv-trial',
  '/iptv-free-trial',
  '/iptv-72-hour-free-trial',
  '/happystreamz'
];

export const SEO_LOCATIONS = [
  'united-states', 'united-kingdom', 'canada', 'germany', 'australia', 'france', 'spain', 'netherlands',
  'italy', 'belgium', 'switzerland', 'austria', 'sweden', 'norway', 'denmark', 'finland', 'ireland',
  'new-zealand', 'singapore', 'south-africa', 'portugal', 'greece', 'poland', 'mexico', 'brazil',
  'argentina', 'turkey', 'uae', 'dubai', 'saudi-arabia', 'india', 'malaysia', 'thailand', 'japan',
  'south-korea', 'cyprus', 'malta', 'croatia', 'romania', 'bulgaria', 'hungary', 'luxembourg',
  'new-york', 'california', 'texas', 'florida', 'london', 'manchester', 'birmingham', 'toronto',
  'vancouver', 'sydney', 'melbourne', 'berlin', 'munich', 'paris', 'madrid', 'barcelona', 'chicago',
  'los-angeles', 'houston', 'miami', 'atlanta', 'boston', 'seattle', 'las-vegas', 'tokyo', 'rome',
  'amsterdam', 'brussels', 'vienna', 'dublin', 'zurich', 'geneva', 'stockholm', 'oslo', 'copenhagen',
  'helsinki', 'lisbon', 'athens', 'warsaw', 'prague', 'budapest', 'bucharest', 'singapore-city',
  'hong-kong', 'bangkok', 'kuala-lumpur', 'jakarta', 'manila', 'seoul', 'mumbai', 'delhi', 'bangalore',
  'cape-town', 'johannesburg', 'auckland', 'wellington', 'montreal', 'calgary'
];

export const SEO_DEVICES = [
  'firestick', 'samsung-smart-tv', 'lg-smart-tv', 'apple-tv', 'chromecast', 'mag-box', 'enigma2', 'formuler-z',
  'android', 'ios', 'windows', 'mac', 'xbox', 'playstation', 'nvidia-shield', 'smart-tv', 'roku', 'tivimate',
  'gse-smart-iptv', 'iptv-smarters', 'perfect-player', 'kodi', 'mi-box', 'fire-tv', 'android-box',
  'smarters-pro', 'ott-navigator', 'implayer', 'clanjournal', 'net-iptv', 'ss-iptv', 'set-iptv',
  'smart-one-iptv', 'flix-iptv', 'duplex-play', 'iptv-extreme', 'xcip-tv', 'vlc-player', 'perfect-player-iptv',
  'stb-emu', 'myiptv-player', 'lazy-iptv', 'gse-iptv', 'tivimate-premium', 'purple-iptv'
];

export const SEO_CONTENT_STREAMS = [
  'live-sports', 'premium-movie-channels', 'latino-channels', 'sky-sports', 'epg-catchup-guide', 'ppv-main-event',
  'ufc-iptv-channel', 'french-tv-box', '4k-channels', 'arabic-channels', 'uk-channels', 'us-channels',
  'ca-channels', 'indian-channels', 'pakistani-channels', 'african-channels', 'spanish-channels',
  'german-channels', 'italian-channels', 'portuguese-channels', 'beinsports', 'f1-live', 'champions-league',
  'premier-league', 'la-liga', 'nba', 'nfl-sunday-ticket', 'mlb-extra-innings', 'nhl-center-ice',
  'world-cup', 'cricket-live', 'ipl-streaming', 'bundesliga-live', 'serie-a', 'ligue-1', 'eridivisie',
  'scandinavian-channels', 'turkish-channels', 'greek-channels', 'vietnamese-channels'
];

// Helper to clean paths and format titles
export function formatKeyword(str: string): string {
  const clean = str.replace(/^\//, '').replace(/-/g, ' ');
  return clean.replace(/\b[a-z]/g, (char) => char.toUpperCase())
    .replace(/\biptv\b/gi, 'IPTV')
    .replace(/\bepg\b/gi, 'EPG')
    .replace(/\bppv\b/gi, 'PPV')
    .replace(/\bufc\b/gi, 'UFC')
    .replace(/\bf1\b/gi, 'F1')
    .replace(/\bca\b/gi, 'CA')
    .replace(/\bus\b/gi, 'US')
    .replace(/\buk\b/gi, 'UK')
    .replace(/\buae\b/gi, 'UAE')
    .replace(/\bvod\b/gi, 'VOD');
}

// Generate highly unique Intro & Conclusion paragraphs to achieve > 30% uniqueness
export function generateSEOContent(currentPath: string): { intro: string; conclusion: string; type: 'location' | 'device' | 'content' | null; name: string } {
  const path = currentPath.toLowerCase();

  // 1. Check if Location Page
  if (path.startsWith('/iptv-in-')) {
    const rawLocation = path.replace('/iptv-in-', '');
    const locationName = formatKeyword(rawLocation);
    
    // Create rich location intro and conclusion
    const intro = `Welcome to the premier portal for HappyStreamz IPTV in ${locationName}. If you are looking for a reliable, buffer-free television solution to stream national local channels, live regional sports, and movies in pristine 4K UHD, our dedicated ${locationName} server nodes are fully optimized for your network. Residents in ${locationName} can now stream premium content with less than 1.2s latency, specifically tuned for local high-speed providers.`;
    
    const conclusion = `In conclusion, subscribing to HappyStreamz in ${locationName} is the absolute best way to future-proof your home entertainment. With our active ${locationName} network nodes, premium English & localized VOD subtitles, and 24/7 technical support, you get unrivaled stability. Try our IPTV 24-hour free trial or premium plans in ${locationName} today and join over 50,000 satisfied streamers around the globe.`;

    return { intro, conclusion, type: 'location', name: locationName };
  }

  // 2. Check if Device Page
  if (path.startsWith('/iptv-on-')) {
    const rawDevice = path.replace('/iptv-on-', '');
    const deviceName = formatKeyword(rawDevice);

    const intro = `Welcome to the ultimate setup guide for HappyStreamz IPTV on ${deviceName}. Getting high-performance, crystal-clear 4K streams running smoothly on ${deviceName} has never been simpler. By routing through our optimized app configuration, ${deviceName} users can bypass standard ISP throttling, eliminate buffering, and unlock over 30,000 live channels and 150,000 VOD titles on their screen within 5 minutes.`;

    const conclusion = `In conclusion, configuring HappyStreamz on ${deviceName} provides a truly premium, cord-cutting experience. Our anti-freeze v4.2 technology ensures your ${deviceName} streams stay flawless. Claim your free test account or activate a premium subscription today, and experience how your ${deviceName} transforms into a powerful media center.`;

    return { intro, conclusion, type: 'device', name: deviceName };
  }

  // 3. Check if Content Page
  if (path.endsWith('-iptv') && path !== '/') {
    const rawContent = path.replace(/^\//, '').replace(/-iptv$/, '');
    const contentName = formatKeyword(rawContent);

    const intro = `Welcome to the ultimate stream directory for HappyStreamz ${contentName}. Our high-speed CDN servers are fully equipped to stream premium ${contentName} feeds in up to 4K resolution at 60 frames per second without any interruption. Never miss another live event, movie launch, or high-profile broadcast with our automated catch-up EPG and high-frequency buffering nodes specifically engineered for ${contentName}.`;

    const conclusion = `In conclusion, streaming ${contentName} with HappyStreamz delivers the absolute highest quality and stability available on the market today. Backed by our specialized sports and cinematic movie CDN servers, your ${contentName} streams will be completely free of lag or frame drops. Start your free trial or subscribe now to experience premium ${contentName} at its absolute finest.`;

    return { intro, conclusion, type: 'content', name: contentName };
  }

  return { intro: '', conclusion: '', type: null, name: '' };
}
