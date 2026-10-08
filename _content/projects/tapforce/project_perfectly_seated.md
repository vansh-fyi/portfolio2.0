---
projectId: perfectly-seated
project_name: Perfectly Seated
client: Perfectly Seated (via Tapforce LLC)
role: Product Designer & Full-Stack Developer
timeline: June 2026 - Present
platform: Web Application and Marketing Site
live: perfectlyseated.com
key_features: ["Drag-and-Drop Floor Plan Canvas", "Guest Self-Selection of Seats", "Shareable Event Links", "Guest Import and Export (CSV/Excel)", "Custom Invitation Emails", "Credit-Based Pricing", "Admin Dashboard"]
challenge: "Replacing spreadsheets and email back-and-forth with a seating plan that guests can fill in themselves"
tech_stack: ["Next.js 15", "React", "TypeScript", "Supabase", "Stripe", "Resend", "React Email", "Tailwind CSS", "GSAP", "Motion", "Recharts"]
key_achievements:
  - "Designed and built the marketing site and the full event-planning web app as one product"
  - "Built a visual seating canvas with tables, stages, bars and dance floors"
  - "Let guests choose their own seats from a shareable link"
process: "Solo design and build, AI-assisted"
---

# Case Study: Perfectly Seated

## Key Achievements & Contributions
- **One Product, Two Layers**: Vansh designed and built both the marketing site and the web app behind it, keeping the same brand across them.
- **Visual Seating Planner**: Hosts lay out an event on a canvas with tables, stages, bars and dance floors, and assign seats.
- **Guests Pick Their Own Seats**: Instead of the organizer assigning every seat, guests receive a link and choose their seat themselves.
- **End-to-End Event Flow**: Guest lists, invitations, RSVPs, RSVP reminders and seat confirmations are handled in one place.

## 1. Context: What Perfectly Seated Is
Perfectly Seated is a seating management platform for weddings, corporate events, galas, conferences, parties and fundraisers. Its tagline is "Every seat PERFECTLY CHOSEN." The core idea is to remove "spreadsheet chaos": hosts can set up and share a complete seating plan without back-and-forth emails.

## 2. What Vansh Built
- **Marketing site**: A polished landing page covering live seating, custom layouts, guest invitations, a three-step onboarding, event types and testimonials, plus pricing, privacy and terms pages.
- **Event setup**: A guided flow for creating an event, adding details and choosing an invitation email template.
- **The planner**: A drag-and-drop canvas with tables and other venue objects.
- **Guests area**: Guests can be added by hand or imported from CSV or Excel, and exported again.
- **Guest experience**: A shareable event page where each guest selects a seat, reached through an invite code or share link.
- **Email**: Branded invitation, seat-confirmation and RSVP-reminder emails, plus a notification to the host when the deadline passes. They are built with React Email and sent through Resend, with invitation templates for different event types (such as gala, corporate party, baby shower and bar mitzvah) and an envelope-style invitation image.
- **Accounts and billing**: Sign-up, login and password reset with Supabase Auth, and Stripe-based pricing with per-event and credit options.
- **Admin dashboard**: Internal tools for managing the platform.

## 3. Engineering Decisions
- **Next.js App Router with Supabase**: One codebase and one deployment on Vercel for the site and the app, with Supabase handling auth and data through versioned migrations.
- **A shared brand**: The app theme follows the finalized website theme so the product feels like one experience.
- **Animation**: GSAP and Motion power the animations on the marketing site.

## 4. Status
Live at perfectlyseated.com and under active development since June 2026.
