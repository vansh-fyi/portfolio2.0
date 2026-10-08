# Content Directory for Ursa's RAG Knowledge Base

This directory contains markdown content files that will be processed into vector embeddings for Ursa's RAG (Retrieval-Augmented Generation) system.

## ⚠️ IMPORTANT: Source of Truth

**The authoritative source content is located in `/rag` directory at the project root.**

- `/rag/personal/personal.md` - Comprehensive biography, experience, skills, and professional philosophy
- `/rag/case_studies/` - Detailed project case studies organized by type:
  - `product_design/personal/` - Personal projects (Vibio, Aether)
  - `product_design/industry/` - Industry projects (DriQ Health, Sparto, Synofin, etc.)
  - `branding/` - Branding projects

**Content in `_content/` is DERIVED from the `/rag` source files.** When updating or adding content:
1. First check `/rag` directory for existing source material
2. Extract relevant information from `/rag` files
3. Restructure it into the format required for RAG (separate files per category)
4. Write in Ursa's voice (first-person, conversational)
5. Add proper YAML frontmatter metadata

This ensures consistency between the comprehensive source documentation and the RAG-optimized content structure.

## Directory Structure

```
_content/
├── personal/          # Information about Vansh (personal context)
│   ├── bio.md
│   ├── skills.md
│   ├── experience.md
│   └── interests.md
└── projects/          # Project-specific information
    └── portfolio-website/
        ├── overview.md
        ├── tech-stack.md
        ├── challenges.md
        ├── outcomes.md
        └── links.md
```

## Frontmatter Schema

All markdown files MUST include YAML frontmatter with the following structure:

```yaml
---
type: personal | project
category: bio | skills | experience | interests | overview | tech-stack | challenges | outcomes | links
projectId: portfolio-website  # Required for type: project only
lastUpdated: YYYY-MM-DD
tags: [optional, tags, here]
source: /rag/personal/personal.md  # Reference to source file in /rag directory
---
```

**Note:** The `source` field documents which file in `/rag` the content was derived from, enabling traceability and making it easier to update content when source files change.

## Writing Guidelines

**CRITICAL**: All content must be written in first-person ("I", "my", "me") AS Ursa, ABOUT Vansh.

Follow the Ursa Personality Guide (`docs/ursa-personality-guide.md`):
- Tone: Conversational, authentic, passionate
- Voice: Strongly first-person
- Vocabulary: Clear, direct with informal touches
- Narrative flow: Stories, not bullet points
- Emojis: Strategic use (max 1-2 per document)

## Content Requirements

**Personal Content** (300+ words per file):
- Bio: Personal story, what drives you
- Skills: Technical expertise with context and examples
- Experience: Work history as stories with impact
- Interests: Passions, side projects, learning journey

**Project Content** (200-600 words per file):
- Overview: What it is, why you built it, vision
- Tech Stack: Technologies used and why
- Challenges: Problems solved, solutions found
- Outcomes: Results, impact, lessons learned
- Links: Context for demos, GitHub, screenshots

## RAG Integration

Ursa's backend ingests these files with `npm run ingest-kb` (run from `backend/`; see `backend/README.md`):

1. Each file is split **by markdown heading**. Every chunk is prefixed with its project and section path (for example `Portfolio Website > Challenges`), so retrieved passages always say where they came from.
2. Chunks are embedded and stored in Supabase. Only changed chunks are re-embedded on later runs.
3. An overview of every project is generated from the frontmatter and included with every question.

Whether a file is `personal` or `project` content is decided by its folder (`personal/` vs `projects/`), not by a `type` field. `projectId` links project files together and enables project-specific search.

## Writing for retrieval

Retrieval quality depends more on the content than on the model:

- **Use clear `##` / `###` headings** that name the topic. They become part of every chunk's title.
- **Keep one idea per section**, ideally 150-1200 characters. Very small sections get merged; very large ones get split.
- **Name things in full** ("Ursa AI", "DriQ Health"), not "it" or "the project", because chunks are read on their own.
- **Fill in project frontmatter** — `project_name`, `role`, `timeline`, `platform`, `client`, `challenge`, `key_achievements`, `key_features`, `tech_stack` feed the project overview. Files without them still work but have a weaker overview entry.
- **State current facts explicitly** (current employer, location, dates) and update them when they change; Ursa only knows what is written here.
- After editing content, run `npm run ingest-kb` and then `npx ts-node src/scripts/eval-ursa.ts` from `backend/`.
