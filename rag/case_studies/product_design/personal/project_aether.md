---
project_name: Aether
role: Creator & Full-Stack Developer
timeline: Ongoing (MVP Live)
tech_stack: [Vite, React, TypeScript, Tailwind CSS, Gemini Flash API, Vercel]
live_link: "https://aether-vansh-fyi.vercel.app/"
repo_link: "https://github.com/vansh-fyi/aether"
project_type: AI-Powered Design System Generator
key_features: ["Moodboard-to-Code Analysis", "Live Component Preview", "TypeScript/Doc Gen", "Chaos Mode"]
related_documents: [personal_bio.md]
---

# Case Study: Aether – The AI Design System Generator

## 1. The Concept: "Vibe Coding" for the AI Era
As AI coding tools like **Lovable, Claude Code, v0, and Bolt.new** rise in popularity, a new problem has emerged: **The "Generic UI" Trap.**
While these tools are excellent at generating logic, they often default to standard, soulless component libraries (Shadcn/UI defaults) that lack brand personality.

**Aether** was built to solve this. It is a **"Design System Generator"** that bridges the gap between abstract aesthetics ("Vibes") and concrete engineering (Tailwind/TypeScript).
* **The Goal:** To allow a developer to input a "Mood" and instantly receive a downloadable, drag-and-drop ready Design System.

## 2. How It Works: The "Magic" Workflow
Aether provides three distinct entry points for the user:

### A. The Inputs
1.  **Moodboard Analysis:** Users can upload up to 3 images (e.g., a Cyberpunk poster, a minimalist Swiss print). The AI analyzes the color theory, contrast ratios, and emotional tone.
2.  **Pre-Made Templates:** Curated styles for quick starts.
3.  **Chaos Mode:** A serendipitous mode where the AI acts as the sole creative director.

### B. The Engine (Gemini Flash API)
Vansh utilized the **Gemini Flash API** (specifically the high-speed 2.4 Flash variant) to process the inputs.
* **Logic:** The AI doesn't just pick colors; it generates a semantic color system (Primary, Secondary, Accent, Destructive) and typographic scales (Type sizes, REM units) that adhere to accessibility standards.

### C. The Output (Developer Experience)
* **Live Preview:** A real-time playground featuring a toggleable Desktop/Mobile view. Users can adjust padding, rounded corners, and typography in real-time.
* **Atomic Components:** The preview renders actual components: Project Cards, Form Fields, Navigation Bars, and Headers.
* **The "Drop-In" Deliverable:** Once satisfied, the user generates a **ZIP file** containing:
    * Production-ready **TypeScript Components**.
    * A fully configured **Tailwind Config**.
    * Comprehensive **Documentation**.

## 3. The Development Story: From "No-Code" to "Pro-Code"
This project marked Vansh’s transition from a Designer to a **Builder**.

### The "Figma Make" Pivot
Initially, Vansh attempted to speed up development using a "Figma-to-Code" automation tool ("Figma Make").
* **The Failure:** The tool locked essential code behind a paid subscription and generated "messy" code—incorrect React imports and hidden logic that couldn't be customized.
* **The Fix:** Vansh abandoned the automation and decided to **self-deploy**.

### The Refactor (Gemini CLI & Warp.dev)
Vansh took the raw, imperfect output and rebuilt the architecture manually.
1.  **Environment Security:** Moved API keys from client-side exposure to secure Environment Variables.
2.  **Build System:** Manually configured **Vite** and **TypeScript** to ensure a clean build process.
3.  **Tailwind Re-Architecture:** The automated tool had poor styling practices. Vansh hand-coded a new **Tailwind Configuration** to ensure the design system was scalable and visually polished.
4.  **AI-Assisted Debugging:** utilized **Gemini CLI** to fix broken import statements and debug the "White Screen of Death" errors.
5.  **Deployment:** Used **Warp.dev** for terminal management and deployed the final optimized build to **Vercel**.

## 4. Why This Matters
Aether represents the intersection of Vansh’s interests: **Aesthetics and Algorithms.**
* It proves he can build **RAG/AI Wrappers** that interact with multimedia inputs (Images/Vision).
* It demonstrates **Full-Stack Capability**—handling everything from the UI design (Figma) to the API integration and Deployment pipeline.