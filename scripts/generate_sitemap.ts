import { writeFileSync } from 'fs';
import { join } from 'path';
import { BLOG_POSTS } from '../src/blogData';
import { SEO_LOCATIONS, SEO_DEVICES, SEO_CONTENT_STREAMS } from '../src/seoData';

const BASE_URL = 'https://happystreamz.ai.studio';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

function generate() {
  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

  // 1. Core Pages
  const corePaths = [
    { path: '/', priority: '1.00', changefreq: 'daily' },
    { path: '/free-iptv-trial', priority: '0.90', changefreq: 'daily' },
    { path: '/iptv-free-trial', priority: '0.90', changefreq: 'daily' },
    { path: '/iptv-72-hour-free-trial', priority: '0.90', changefreq: 'daily' },
    { path: '/happystreamz', priority: '0.90', changefreq: 'daily' },
    { path: '/reviews/vseebox-review', priority: '0.95', changefreq: 'weekly' },
    { path: '/blog', priority: '0.85', changefreq: 'daily' },
  ];

  for (const core of corePaths) {
    urls.push({
      loc: `${BASE_URL}${core.path}`,
      lastmod: CURRENT_DATE,
      changefreq: core.changefreq,
      priority: core.priority,
    });
  }

  // 2. Blog Posts
  for (const post of BLOG_POSTS) {
    urls.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.80',
    });
  }

  // 3. Programmatic Location SEO Pages
  for (const loc of SEO_LOCATIONS) {
    const slug = loc.toLowerCase().replace(/ /g, '-');
    urls.push({
      loc: `${BASE_URL}/iptv-in-${slug}`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.75',
    });
  }

  // 4. Programmatic Device SEO Pages
  for (const dev of SEO_DEVICES) {
    const slug = dev.toLowerCase().replace(/ /g, '-');
    urls.push({
      loc: `${BASE_URL}/iptv-on-${slug}`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.75',
    });
  }

  // 5. Programmatic Content Stream SEO Pages
  for (const stream of SEO_CONTENT_STREAMS) {
    const slug = stream.toLowerCase().replace(/ /g, '-');
    urls.push({
      loc: `${BASE_URL}/${slug}-iptv`,
      lastmod: CURRENT_DATE,
      changefreq: 'weekly',
      priority: '0.75',
    });
  }

  // --- WRITE SITEMAP.XML ---
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  }
  
  xml += '</urlset>\n';

  const publicSitemapPath = join(process.cwd(), 'public/sitemap.xml');
  writeFileSync(publicSitemapPath, xml, 'utf8');
  console.log(`Successfully generated public sitemap at ${publicSitemapPath} with ${urls.length} URLs!`);

  // --- WRITE URLS LIST FOR SUBMISSION ---
  const flatUrlsList = urls.map(u => u.loc).join('\n');
  
  const publicUrlsPath = join(process.cwd(), 'public/urls-to-submit.txt');
  writeFileSync(publicUrlsPath, flatUrlsList, 'utf8');

  const rootUrlsPath = join(process.cwd(), 'urls-to-submit.txt');
  writeFileSync(rootUrlsPath, flatUrlsList, 'utf8');
  
  console.log(`Successfully wrote flat URLs list containing ${urls.length} paths to public and root!`);
}

generate();
