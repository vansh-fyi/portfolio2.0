---
projectId: sepcare
project_name: SepCare
role: Product Designer & Full-Stack Developer (hardware prototype and app)
timeline: August 2026 - Present
platform: Wearable Prototype (ESP32 armband) and Web Application
challenge: "Helping caregivers notice early warning signs of neonatal sepsis from simple, low-cost sensor readings"
key_features: ["Wearable Newborn Armband Prototype", "Heart Rate, Oxygen, Temperature and Motion Sensing", "Wi-Fi Upload to a Secure Ingest API", "Risk Scoring", "Caregiver and Parent Views", "Clinical Design System"]
tech_stack: ["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS", "shadcn/ui", "Recharts", "ESP32-S3", "MAX30102", "DS18B20", "MPU6050"]
key_achievements:
  - "Specified and documented a complete low-cost hardware prototype, with a build guide and parts list"
  - "Built a secure ingest API and risk-score pipeline that turns device readings into a status for caregivers"
  - "Created a documented design system with clinical dashboard components"
process: "Research on SDG 3 (Good Health and Well-being), then a hardware and software prototype, built with a small team"
---

# SepCare: A Newborn Sepsis Early-Warning Armband

## Overview
SepCare is a prototype system for catching early warning signs of neonatal sepsis. It pairs a low-cost wearable armband with a web app that shows caregivers and parents how a baby is doing. It was built as a prototype for a competition and grew out of research on the UN Sustainable Development Goal for Good Health and Well-being (SDG 3).

> **Safety boundary:** SepCare is an engineering prototype, not a clinical device. It is not validated for use on newborns or for clinical decisions.

## The Hardware Prototype
The armband is built from inexpensive, off-the-shelf parts, for roughly ₹1,300-2,000 (about $16-24) per unit:
- A **Waveshare ESP32-S3-Tiny** controller that uploads summaries over Wi-Fi
- A **MAX30102** sensor for heart rate and blood-oxygen related signals
- A **DS18B20** sensor for body temperature
- An **MPU6050** for motion and activity
- A small LiPo battery with a charging and protection module

Vansh specified and documented the full build: a single source-of-truth wiring diagram, a parts list, a soldering pinout and a soldering test plan. An earlier BLE-based design was replaced by the simpler direct Wi-Fi approach.

## The App
- **Secure ingest API**: Devices send readings to the app, which checks the device's API key before parsing anything, then validates the data.
- **Risk scores**: Each reading feeds a risk-score calculation that is stored with the reading history.
- **Caregiver and parent views**: Separate screens for vitals, statistics, settings and device details, with a clear status for each infant that uses a word, an icon and a color together so it never relies on color alone.
- **Backend**: Supabase stores devices, readings and risk scores, managed through versioned migrations.

## The Design System
SepCare has its own documented design system built on shadcn/ui, with shared tokens, components and clinical patterns such as vital-sign cards and dashboards. The rule it follows is that a design correction improves the shared system first and the screens second.

## Status
In progress, as a small-team prototype built since August 2026.
