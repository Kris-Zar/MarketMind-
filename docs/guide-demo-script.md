# MarketMind AI — Phase 0 Guide Demonstration Script & Scope Disclosure

**Document Purpose:** Presentation script and prototype truth disclosure for project guide review.  
**Milestone:** Phase 0 — Guide-Ready Prototype  
**Date:** 13 November 2026  

---

## 1. 8-Step Demonstration Script

| Step | Screen | Action to Perform | Expected Observable Outcome | Product Truth Validation |
|---|---|---|---|---|
| **1** | Dashboard | Open application root. | View workspace greeting, quick action cards, and KPI overview. | Metrics are honestly marked as `Demo Data` or `Phase 2` placeholders; no fabricated live accounts. |
| **2** | Brand Kit | Select *LumaBrew Roasters* or enter a new Brand Kit. Modify colors and voice. | Live mini brand preview updates with selected colors, logo, and typography. | Proves brand context is stored and ready to ground generated content. |
| **3** | Products | Review *Aurora Cold Brew Concentrate* or add a product. | View benefits list, price, and visual preview. | Confirms product profile grounding without hallucinating unverified claims. |
| **4** | Campaign Planner | Set objective (*Product Launch*), audience, channel (*Instagram*), and key message. | Reviewable Campaign Brief summary card displays on right column. Initial drafts auto-generate. | Connects brand and product to explicit marketing intent. |
| **5** | Campaign Modes | Toggle between **Individual Content** and **Do My Campaign**. | UI clearly differentiates single-format variant generation from a coordinated 3-asset package (Post, Banner, Video Storyboard). | Directly fulfills PRD requirement F06. |
| **6** | Banner Customizer | Select the Banner asset and toggle aspect ratio (1:1 Square, 9:16 Story, 16:9 Landscape) and themes. | Banner visual dynamically adapts layout, proportions, color gradients, and brand logo. | Live interactive banner generation per design.md. |
| **7** | Video Storyboard Player | Select the Video Storyboard asset and click Play or step through Frames 1–4. | 4-scene interactive video player shows camera prompts, on-screen text, and voiceover scripts with animated timer. | Fulfills "video images / concept" requirement with real short-form video scenes. |
| **8** | Real Export | Click *Brief (.md)*, *Data (.json)*, *Banner (.svg)*, or *Video Script (.md)*. | Browser downloads genuine formatted files to the local filesystem. | Real file export only; no fake publishing success states. |

---

## 2. Capability Matrix & Phase 0 Boundaries

| Capability | Phase 0 Prototype Status | Planned Phase | Notes |
|---|---|---|---|
| **Brand Kit Management** | Functional | Phase 0 | Name, category, mission, voice, hex palette, logo upload / sample SVG, prototype store. |
| **Product Profiles** | Functional | Phase 0 | Product facts, benefits, pricing, audience, and sample images. |
| **Campaign Planning** | Functional | Phase 0 | Objectives, audience, channel, tone, reviewable brief summary, auto-draft trigger. |
| **Individual Content Mode** | Functional | Phase 0 | Generates focused variations for one chosen format (Social Post, Banner, Video Storyboard, Ad Copy). |
| **Do My Campaign Mode** | Functional | Phase 0 | Coordinated 3-asset package (Launch Post, Value Banner, 15s Video Concept Storyboard). |
| **Branded Promotional Banners** | Functional | Phase 0 | Customizable aspect ratios (1:1, 9:16, 16:9) and color themes with real SVG download. |
| **Video Concepts & Storyboard** | Functional | Phase 0 | 4-frame interactive video player with camera directions, voiceover script, and `.md` script export. |
| **Live Copy Editing** | Functional | Phase 0 | In-place text editing with instant visual preview update. |
| **Template Creative Preview** | Functional | Phase 0 | `HeroProductCard`, `BannerVisual`, `VideoStoryboardVisual`, `MinimalQuoteCard`. |
| **Real File Export** | Functional | Phase 0 | Real Markdown brief (.md), JSON bundle (.json), SVG visual banner (.svg), and Video Script (.md). |
| **AI Generation Layer** | Functional / Smart Engine | Phase 0 | Dynamic contextual generator (with Gemini adapter support if key supplied); clearly labelled. |
| **Production User Authentication** | Deferred | Phase 1 | Single personal workspace used for prototype; full auth in Phase 1 MVP. |
| **Relational DB Persistence** | Deferred | Phase 1 | Atomic JSON prototype store used; SQLAlchemy/PostgreSQL in Phase 1 MVP. |
| **Social Account OAuth** | Deferred | Phase 2 | Official platform developer accounts & review required. |
| **Direct Social Publishing** | Deferred | Phase 2 | Export/download remains the complete fallback. |
| **Verified Platform Analytics** | Deferred | Phase 2 | Dashboard metrics show `Demo Data` or `—` placeholders in Phase 0. |
| **Market Trend Discovery** | Deferred | Phase 3 | Permitted data source pipeline required. |
| **Competitor Analysis** | Deferred | Phase 3 | Permitted public observation pipeline required. |
| **AI Recommendation Engine** | Deferred | Phase 3 | Explainable recommendation engine grounded in trend evidence. |

---

## 3. Guide Feedback & Evaluation Questions

1. **Workflow Clarity:** Does going from Brand Kit → Product Profile → Campaign Brief → Content Studio feel natural for a lean marketing team?
2. **Mode Differentiation:** Is the visual distinction between **Individual Content** and **Do My Campaign** obvious and useful?
3. **Banner Customization:** Are the aspect ratio options (1:1, 9:16, 16:9) and themes practical for multi-channel digital marketing campaigns?
4. **Video Storyboards:** Does the 4-frame video ad concept (camera prompts, on-screen text, voiceovers, script download) provide clear value for video ad planning?
5. **Brand Consistency:** Are the primary/secondary color application, logo placement, and voice grounding sufficient to keep generated creatives on-brand?
6. **Fallback Value:** Is the real file export (Markdown brief, JSON, SVG banner, and Video Script) valuable to users before direct social media publishing integrations are added in Phase 2?
7. **Phase 1 Priorities:** What are the most important refinements needed before starting Phase 1 Core MVP persistence and user authentication?
