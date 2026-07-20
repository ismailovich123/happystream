import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API Route: Secure Server-Side Gemini 3.5 Flash AI Summary & Streaming Report
  app.post("/api/ai-summary", async (req, res) => {
    try {
      const { device, location, contentStream, customPrompt } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Return a high-quality, pre-computed fallback response if the API key is not configured or in template mode
        return res.json({
          summary: `### 🤖 HappyStreamz™ AI Streaming Report (Offline Mode)
          
**Target Configuration:**
*   **Selected Hardware:** ${device || "Amazon Firestick (Recommended)"}
*   **Geographic Route:** ${location || "United States / Global Nodes"}
*   **Streaming Package:** ${contentStream || "Premium Sports & Cinema HD"}

---

#### 🌐 1. Geolocation & Server Routing Nodes (GEO)
*   **Active Local Cluster:** ${location || "Global edge networks"}
*   **Latency Optimization:** Less than 18ms through anti-freeze v4.2 connection nodes.
*   **ISP Throttling Bypass:** Fully encrypted VPN tunnels integrated into CDN endpoints.

#### ⚙️ 2. Step-by-Step Setup Walkthrough for **${device || "Amazon Firestick"}**
1.  **Download App:** Open the search bar on your **${device || "device"}** and search for **Downloader** or **IPTV Smarters Pro**.
2.  **Configure API Source:** Enter the custom **HappyStreamz Portal URL** received in your email activation package.
3.  **Input Test Lines:** Input your unique Xtream Codes API username and password.
4.  **Database Compilation:** Allow 1-2 minutes for our 30,000+ live television feeds and 150,000+ movies to sync.
5.  **Enjoy 4K UHD:** Start streaming with 99.9% uptime and zero buffering!

#### 🏆 3. Local Channel Highlights (**${contentStream || "Live Sports & PPV"}**)
*   Stream your selected **${contentStream || "Live Sports & Movies"}** package in native 4K UHD at 60fps.
*   Fully loaded Electronic Program Guide (EPG) metadata synced and updated hourly.
*   Backup CDN streams allocated dynamically for major live Pay-Per-View events.

---
*Powered by Gemini 3.5 Flash — HappyStreamz AI Optimization Engine.*`
        });
      }

      // Initialize Gemini Client with standard User-Agent for AI Studio Build telemetry
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Construct a professional prompt matching the user's pSEO context (Device, Location, Content)
      const prompt = `You are the ultimate HappyStreamz AI Streaming Optimizer & Geolocation Expert for 2026.
Generate an expert, high-authority, and engaging custom IPTV streaming report based on the following user settings:
- Selected Device/Hardware: ${device || "Standard Streaming Device"}
- Geographic Location: ${location || "Global Server Route"}
- Content Category / Sports Event: ${contentStream || "Live Sports, Movies, & Live TV"}
${customPrompt ? `- Additional User Request: ${customPrompt}` : ""}

Provide the output in beautiful Markdown format with clear sections:
1. 🌐 Geolocation & Server Routing Node (GEO): Elaborate on how HappyStreamz utilizes local high-speed edge CDN nodes in ${location} to achieve less than 15-25ms latency, bypass ISP throttling, and deliver buffer-free streams.
2. ⚙️ Hardware Setup Walkthrough: Write a specific, clear step-by-step installation guide for setting up HappyStreamz on the ${device} using IPTV Smarters Pro or a custom player. Keep it extremely action-oriented.
3. 🏆 Localized Streaming & Channels Guide: Describe how they can access ${contentStream} with our automatic daily-updated EPG and premium 4K UHD quality at 60fps. Mention relevant networks for that selection (e.g. Sky Sports / ESPN / BeIN Sports / Peacock).
4. 🤖 AI Summary Verdict: A brief, confident summary statement on why HappyStreamz on their ${device} in ${location} outperforms expensive $300 hardware box solutions like VSeeBox.

Keep the tone professional, reassuring, and highly optimized for E-E-A-T. Do not use generic placeholders.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite enterprise IPTV technical support and marketing expert representing HappyStreamz™ in 2026."
        }
      });

      res.json({ summary: response.text });
    } catch (error: any) {
      console.error("Gemini AI error:", error);
      res.status(500).json({ error: "Failed to generate AI report", details: error.message });
    }
  });

  // Vite middleware for development vs static asset serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
