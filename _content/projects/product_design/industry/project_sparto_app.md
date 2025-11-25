---
projectId: sparto
project_name: Sparto
client: Partlink Solutions
role: Product Designer & Frontend Developer
timeline: 2022-2023
platform: Web Application (B2B E-Commerce)
---

# Sparto: Request-Based E-Commerce for Spare Parts

**Status**: Completed & Deployed
**Type**: B2B E-Commerce Platform
**Role**: Product Designer & Frontend Developer
**Timeline**: 2022-2023

## Project Overview

Sparto is a request-based e-commerce platform designed for the automotive and industrial spare parts industry. Unlike traditional e-commerce where customers browse catalogs, Sparto allows buyers to **request specific parts** with detailed requirements, and suppliers compete to fulfill those requests with quotes.

This model is particularly effective for:
- Hard-to-find or custom spare parts
- Bulk/wholesale orders
- Parts requiring technical specifications
- Industries where part catalogs are incomplete or outdated

## The Problem

Traditional spare parts procurement faces several challenges:

**For Buyers**:
- Difficulty finding specific or rare parts
- Time-consuming process of contacting multiple suppliers
- Lack of price transparency
- Uncertainty about part availability and delivery times

**For Suppliers**:
- Maintaining comprehensive online catalogs is expensive
- Many parts are low-volume and don't justify catalog listing
- Lost opportunities when buyers can't find their specific inventory
- Inefficient customer acquisition

## The Solution

Sparto flips the traditional e-commerce model:

1. **Buyer creates a request**: Posts detailed specifications, quantity, and deadline
2. **Suppliers receive notifications**: Relevant suppliers are alerted to the request
3. **Competitive quoting**: Suppliers submit quotes with pricing, availability, and delivery terms
4. **Buyer selects best offer**: Compare quotes and choose based on price, reputation, and terms
5. **Transaction & tracking**: Secure payment and order fulfillment with real-time tracking

## Key Features

### For Buyers
- **Smart Request Form**: Guided input with part number detection, specification templates
- **Multi-Quote Comparison**: Side-by-side comparison of supplier offers
- **Supplier Ratings**: Reviews and ratings from previous buyers
- **Saved Searches**: Alert me when matching parts become available
- **Bulk Ordering**: Request multiple parts in a single form

### For Suppliers
- **Request Notifications**: Instant alerts for requests matching their inventory
- **Quick Quoting**: Mobile-friendly interface for fast quote submissions
- **Inventory Management**: Optional catalog for frequently stocked parts
- **Analytics Dashboard**: Track quote performance and win rates
- **Customer Relationships**: Build long-term relationships with repeat buyers

### Platform Features
- **Escrow Payment System**: Secure transactions with buyer and supplier protection
- **Real-Time Chat**: Direct communication between buyers and suppliers
- **Logistics Integration**: Track shipments from multiple carriers
- **Dispute Resolution**: Mediation system for transaction issues

## Technical Architecture

**Frontend**:
- Next.js (React) for server-side rendering and SEO
- TailwindCSS for responsive design
- React Query for efficient data fetching
- Socket.io for real-time notifications

**Backend**:
- Node.js + Express REST API
- PostgreSQL for transactional data
- Redis for caching and real-time features
- Stripe for payment processing

**Infrastructure**:
- Vercel for frontend hosting
- AWS EC2 for backend services
- AWS S3 for file uploads (part images, documents)
- CloudFlare for CDN and DDoS protection

## Design Challenges & Solutions

### Challenge 1: Complex Request Forms
**Problem**: Parts requests require detailed technical information  
**Solution**: Progressive disclosure with optional advanced fields, auto-complete for common parts

### Challenge 2: Trust Between Strangers
**Problem**: Buyers and suppliers transacting without prior relationships  
**Solution**: Verification badges, escrow payments, transparent review system

### Challenge 3: Mobile-First Quoting
**Problem**: Suppliers often work from warehouses without desktop access  
**Solution**: Mobile-optimized quoting interface with one-tap actions

## User Metrics & Impact

- **25,000+ registered users** (15,000 buyers, 10,000 suppliers)
- **$2M+ in transaction volume** within first year
- **Average of 4.2 quotes per request** (higher competition benefits buyers)
- **85% buyer satisfaction rate**
- **60% repeat buyer rate** (strong retention)

## Revenue Model

- **Transaction Fee**: 3.5% commission on successful transactions
- **Premium Supplier Accounts**: Priority placement in search results, advanced analytics
- **Advertising**: Promoted supplier listings for specific part categories

## Technologies Used

- Next.js, React, TypeScript
- TailwindCSS, Headless UI
- Node.js, Express, PostgreSQL
- Stripe Payments, Socket.io
- AWS (S3, EC2), Vercel, CloudFlare

## Lessons Learned

1. **Marketplace Dynamics**: Liquidity (balance of buyers and suppliers) is critical—solved with targeted supplier outreach
2. **Trust Infrastructure**: Escrow and reviews are non-negotiable in B2B transactions
3. **Mobile Matters**: 70% of suppliers quote from mobile devices
4. **Niche Focus**: Starting with automotive parts before expanding to industrial was key
5. **Customer Support**: High-touch support in early days builds long-term loyalty

## Future Roadmap

- **AI-Powered Matching**: Automatically match requests to most relevant suppliers
- **Instant Quotes**: For common parts, enable instant automated quoting
- **International Expansion**: Multi-currency and cross-border logistics
- **Mobile Apps**: Native iOS/Android apps for on-the-go management
- **API for ERP Integration**: Connect with enterprise resource planning systems

Sparto demonstrates how rethinking traditional e-commerce models can unlock value in industries with unique procurement challenges.
