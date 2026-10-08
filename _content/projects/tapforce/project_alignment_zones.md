---
projectId: alignment-zones
project_name: Alignment Zones
client: Alignment Zones (via Tapforce LLC)
role: Product Designer & Full-Stack Developer
timeline: December 2025 - Present
platform: Web Application (Quiz, Personalized Reports, Payments)
live: alignmentzones.com
key_features: ["Life-Alignment Quiz", "Personalized AI-Assisted Reports", "Free and Paid Report Tiers", "Shareable Result Cards", "Customer Dashboard", "Admin Panel"]
challenge: "Turning a long self-assessment quiz into a smooth, trustworthy path from first question to a paid, personalized report"
tech_stack: ["React", "TypeScript", "Vite", "Node.js", "Express", "Vercel Serverless", "Supabase", "Stripe", "Resend", "Anthropic Claude API", "Playwright", "Vitest"]
key_achievements:
  - "Built the full quiz-to-paid-report product end to end as a solo designer-developer"
  - "Designed and shipped a free report that leads into a paid, fuller report"
  - "Created an automated report-generation pipeline with email delivery and retries"
process: "Solo design and build, AI-assisted"
---

# Case Study: Alignment Zones

## Key Achievements & Contributions
- **End-to-End Ownership**: Vansh designed and built the whole product on his own, from the quiz experience and homepage to payments, reports and the admin tools, using AI to move faster.
- **Quiz to Report Flow**: Visitors take a roughly ten-minute quiz and receive a personalized report on where they are and how to move up.
- **Free and Paid Tiers**: A free report introduces the result, and a paid report unlocks the full detail through Stripe checkout.
- **Reliable Delivery**: Reports are generated in the background and emailed to the user, with a scheduled fallback job that sends the report email if the normal delivery didn't happen.

## 1. Context: What Alignment Zones Is
Alignment Zones is a self-assessment product. People answer a quiz about different areas of their life and learn which "alignment zone" they are in: Lifequake, Face-Slap, Pinch, Wink, High-Five or Standing Ovation. The report explains how that zone is shaping their life and suggests counterintuitive ways to move up. The quiz covers General, Family, Love & Partnership, Friends & Community, Career, Health, Finances, and City & Home.

## 2. What Vansh Built
- **The quiz experience**: A guided, section-by-section flow with progress saving, section intro screens and context messages for sensitive questions.
- **Homepage and marketing pages**: Several iterations of the homepage, plus legal pages and a contact page.
- **Reports**: A report viewer that streams in sections as they are generated, a free preview report, and a fuller paid report.
- **Accounts and dashboard**: Users can return to their reports through a dashboard and email login links.
- **"Take it with me" cards**: Shareable result cards people can download or share.
- **Payments**: Stripe checkout and webhooks that unlock the paid report after purchase.
- **Email**: Report emails and unsubscribe handling through Resend, with signed unsubscribe tokens.
- **Admin tools**: Screens for reviewing submissions, retriggering reports, and handling feedback.

## 3. Engineering Decisions
- **Background report generation**: Reports are built by a pipeline that calls an LLM (Anthropic's Claude API) and compiles the result into a finished report, run through a queue so the user is never left waiting on a single request.
- **Serverless plus a dedicated pipeline**: Light API work runs as Vercel serverless functions, while the heavier report-generation pipeline runs in its own backend service.
- **Supabase for data**: Submissions, accounts and report state live in Supabase, managed through versioned migrations.
- **Testing**: Unit tests with Vitest, and Playwright end-to-end tests that cover the quiz flow.

## 4. Status
Live at alignmentzones.com and under active development since December 2025.
