---
projectId: astr
project_name: Astr
role: Product Designer & Flutter Developer
timeline: November 2025 - Present (major redesign underway)
platform: Mobile App (Android, iOS) and Progressive Web App (in development, not yet released)
tagline: "Your Personal Stargazing Planner"
key_features: ["Tonight's Sky Dashboard", "Light Pollution Zones (1-9)", "Prime Viewing Windows", "Celestial Object Catalog", "7-Day Forecast", "Red Mode for Night Vision", "Offline Zone Data"]
challenge: "Telling a stargazer when and where to look, using real light pollution, weather and astronomical data"
tech_stack: ["Flutter", "Dart", "Riverpod", "GoRouter", "Swiss Ephemeris", "H3", "SQLite", "Hive", "Cloudflare Workers", "Cloudflare D1", "Open-Meteo"]
key_achievements:
  - "Built a light pollution rating from satellite data that accounts for scattered city light"
  - "Combined moon phase, cloud cover and darkness into prime viewing windows"
  - "Designed a red night-vision mode that preserves dark adaptation"
process: "Solo design and build, AI-assisted"
---

# Astr: Your Personal Stargazing Planner

## Overview
Astr helps people plan a stargazing session by telling them **when and where** to look up. It combines real light pollution data, accurate astronomical calculations and weather forecasts into one clear picture for the user's location. It is designed for touchscreen devices and is being built for Android, iOS and the web.

**Astr has not been released yet.** It is undergoing a major design change, and Vansh is documenting everything along the way ahead of a later release. It is his biggest project of the year, and it involves a great deal of physics, from planetary positions to the way light scatters through the atmosphere.

## Key Features
These describe the current version, which is changing with the redesign.

- **Dashboard**: A "Tonight's Sky" overview of stargazing conditions, the light pollution zone for the user's location, hourly cloud cover, transparency and seeing conditions, and prime viewing windows.
- **Prime viewing windows**: An algorithm that finds the best time slots by weighing moon phase, cloud cover and darkness.
- **Celestial catalog**: Stars, planets, constellations, galaxies, nebulae and star clusters, with visibility, rise and set times for the user's location and time.
- **7-day forecast**: Multi-day star ratings with cloud cover and astronomical twilight.
- **Profile and settings**: Multiple saved locations (GPS or manual), offline download of global zone data on native apps, and background weather sync.
- **Red mode**: An overlay that preserves night vision by avoiding bright light.

## The Light Pollution Model
Astr uses a custom 9-zone scale based on VIIRS satellite nighttime-lights data. Satellites only measure light that goes upward, but a stargazer sees light scattered through the atmosphere from cities far away. Astr corrects for this with a Garstang-inspired skyglow propagation model, so a remote site can still be rated correctly when a city's light dome reaches it. For example, a temple 30 km from Dehradun has no direct upward light but still sees the city's glow, so it rates as Zone 3-4 and not Zone 1.

## Engineering Decisions
- **Accurate astronomy**: Planetary positions come from the Swiss Ephemeris through the `sweph` package, with star and deep-sky catalogs stored in SQLite.
- **Fast zone lookups**: Zone data is indexed with H3 hexagons and served through Cloudflare Workers and D1, with an offline download for native apps.
- **Solid app foundations**: Riverpod for state management, GoRouter for navigation, and AES-256 encrypted local storage with Hive.
- **Background sync**: Weather data updates in the background through WorkManager and BGTaskScheduler.

## Status
In active development since November 2025 and not yet released. A major redesign is underway, and Vansh plans to release the app once it is finished.
