# Performance maintenance

The progressive hero blur is intentional. Its eight layers, masks, radii, and mobile fallback are unchanged by this optimization.

## Images

Run `npm run optimize:images` after replacing a homepage image in `public/images`. Commit the generated manifest and `public/images/optimized` files. Variants use content hashes and a one-year immutable cache policy. Keep previously deployed hashed files available when rolling deployments overlap; original image URLs retain their existing cache behavior.

Portrait variants cover 1x, 2x, and 3x displays. About and project images expose responsive widths. CMS project media reuse the existing Supabase variant list. The hero loads the cookie-selected theme first; alternate imagery and chat code warm only after page load on unconstrained connections.

## Chat and embeds

Chat reveals word batches over at most 1.2 seconds and follows new content only while the visitor remains near the bottom. Completed reveals survive virtualized message remounts for the current chat session.

The contact assistant keeps a 120 ms typing beat for local replies; it no longer adds a 1.5-second pause after each reply or after the email API finishes.

Project iframes retain their document for 60 seconds after closing the project window or switching to chat, then unmount to release script activity and memory. Reopening during that interval preserves the iframe. Switching browser tabs while a project is open preserves its document. Embeds receive `{ type: 'portfolio:visibility', visible: boolean }` via `postMessage` with an exact target origin on load and visibility changes. Embeds you control can validate the sender and use this to pause their own media, animation loops, and timers immediately. Third-party pages need not support the message; their closed document is still released after the grace period.

## Measurement

The app includes Vercel Speed Insights. Enable **Speed Insights** for the project in the Vercel dashboard, then deploy this change to collect real-user metrics. Admin pages are excluded, and URL query strings/fragments are removed from measurements. Existing Clarity initialization waits until the critical page load has finished.

Ursa applies a 25-second overall deadline starting before quota/publication checks. Embedding has a six-second cap; retrieval and generation share cancellation. Structured `ursa-stage` server logs record stage, duration, and success without logging the visitor's question or conversation.

Validate cold mobile and desktop loads, both themes, project close/reopen, chat reveal while scrolling upward, and the contact section. Compare LCP, INP, CLS, transferred bytes, and desktop frame timings on the same device and network. Asset-size improvements alone do not establish Core Web Vitals scores.
