'use client';

import React, { useEffect, useState } from 'react';
import { Bot, ChevronLeft, ChevronRight, Compass, LayoutGrid, Moon, Network, PenTool, SquareTerminal, Sparkles, Sun, User, UserSearch, type LucideIcon } from 'lucide-react';
import { useThemeStore } from '@/src/state/themeStore';
import { useUnicornStudio } from '@/src/hooks/useUnicornStudio';

/**
 * SKILLS PLAYGROUND - EXACT WIREFRAME GEOMETRY & PORTFOLIO DESIGN SYSTEM
 * 
 * Geometry matching Proposed Wireframe with mathematical precision:
 * - 8 Left horizontal capsule pills: balanced width (226px), uniform 18px gaps, crisp non-clipping text
 * - Main Center Hero Shape:
 *     - Smooth symmetrical canopy scoop (aerodynamic 44px depth)
 *     - Left overhang above "Heading"
 *     - Crisp geometric two-stage fillet step interlocking around Heading & Bottom-Left card
 *     - Uniform 18px gutters between all adjacent edges
 *     - Tall right section extending down to the baseline
 *     - Dark Grey Nested Overlay Card in bottom-right:
 *         - Notched bottom-left corner cradling an interactive circular button
 *         - 3 frosted metric cards ("LABEL", "LABEL", "LABEL")
 *         - Full skill description text above
 * - "Heading": Bold portfolio title nestled cleanly in the negative space pocket
 * - Bottom-Left Card: Generous rounded rectangle pod perfectly aligned under Heading
 * - Right Column (3 Stacked Pods + Circular Badge):
 *     - Top: Stepped tower card with circular notch cradling the status badge with uniform clearance
 *     - Middle: Horizontal pill capsule with philosophy/quote copy
 *     - Bottom: Rounded rectangle pod aligned with bottom baseline
 * - Mountain Placeholders: High-fidelity aesthetic imagery clipped cleanly to each container
 */

// An image for both modes, or a separate image per mode, e.g.
//   heroImg: { dark: '/skills/robotics-dark.jpg', light: '/skills/robotics-light.jpg' }
type ThemedImage = string | { dark: string; light: string };

interface SkillItem {
  id: string;
  num: string;
  title: string;
  shortDesc: string;
  heading: string[]; // one entry per line
  fullDesc: string;
  metric1: { label: string; val: string };
  metric2: { label: string; val: string };
  metric3: { label: string; val: string };
  heroImg: ThemedImage;
  blImg: ThemedImage;
  trImg: ThemedImage;
  brImg: ThemedImage;
  quote: string;
}

const SKILLS_DATA: SkillItem[] = [
  {
    id: 'robotics',
    num: '01',
    title: 'Robotics',
    shortDesc: 'Hardware and Kinematics',
    heading: ['Robotics', 'and', 'Kinematics'],
    fullDesc: 'Inverse kinematics solvers coupled with real-time physics bridging tangible mechanical hardware with generative digital software.',
    metric1: { label: 'LOOP RATE', val: '240 FPS' },
    metric2: { label: 'LATENCY', val: '0.4ms' },
    metric3: { label: 'SOLVER', val: 'FABRIK' },
    heroImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    blImg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    trImg: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80',
    brImg: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80',
    quote: 'Bridging tangible hardware mechanisms with generative digital interfaces.',
  },
  {
    id: 'genai',
    num: '02',
    title: 'Generative AI',
    shortDesc: 'LLMs and Agents',
    heading: ['Generative AI', 'and', 'Agentic UX'],
    fullDesc: 'Crafting non-deterministic workflows, multi-agent orchestrations, and context-aware interfaces that make complex AI feel intuitive and reliable.',
    metric1: { label: 'LATENCY', val: '120ms' },
    metric2: { label: 'ACCURACY', val: '99.4%' },
    metric3: { label: 'PIPELINE', val: 'STREAM' },
    heroImg: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=1600&q=80',
    blImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    trImg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    brImg: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80',
    quote: 'Designing beyond chat: multimodal agents that think, act, and remember.',
  },
  {
    id: 'prototyping',
    num: '03',
    title: 'Prototyping',
    shortDesc: 'Code and Motion',
    heading: ['High-Fidelity', 'Code', 'Prototypes'],
    fullDesc: 'Bridging design and production through interactive React, Three.js, and TypeScript prototypes that prove technical viability before handoff.',
    metric1: { label: 'FIDELITY', val: '100%' },
    metric2: { label: 'FRAME-TIME', val: '4.1ms' },
    metric3: { label: 'STACK', val: 'REACT' },
    heroImg: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1600&q=80',
    blImg: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80',
    trImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    brImg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    quote: 'Eliminating guesswork between Figma concepts and production codebases.',
  },
  {
    id: 'design-systems',
    num: '04',
    title: 'Design Systems',
    shortDesc: 'Tokens and Architecture',
    heading: ['Enterprise', 'Design', 'Systems'],
    fullDesc: 'Building multi-brand token architectures, accessible component libraries, and unified design tooling used by thousands of engineering teams.',
    metric1: { label: 'COMPONENTS', val: '84+' },
    metric2: { label: 'ADOPTION', val: '96%' },
    metric3: { label: 'WCAG', val: 'AAA' },
    heroImg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80',
    blImg: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80',
    trImg: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80',
    brImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    quote: 'Scalable foundations that empower teams to move fast without breaking craft.',
  },
  {
    id: 'ui-craft',
    num: '05',
    title: 'UI Craft',
    shortDesc: 'Visual and Micro-Motion',
    heading: ['Visual Craft', 'and', 'Micro-Motion'],
    fullDesc: 'Obsessing over spatial composition, spring physics, tactile haptics, and hairline glass borders that make software feel visceral and alive.',
    metric1: { label: 'SPRING DAMP', val: '28' },
    metric2: { label: 'FPS', val: '120' },
    metric3: { label: 'BORDER', val: '0.5px' },
    heroImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    blImg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    trImg: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80',
    brImg: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80',
    quote: 'Details make the product: every bezier curve and haptic click counts.',
  },
  {
    id: 'ux-arch',
    num: '06',
    title: 'UX Architecture',
    shortDesc: 'Systems and Flows',
    heading: ['UX Systems', 'and', 'Architecture'],
    fullDesc: 'Deconstructing dense data pipelines, multi-step configuration panels, and complex workflows into lucid, effortless user journeys.',
    metric1: { label: 'TASK TIME', val: '-48%' },
    metric2: { label: 'ERROR RATE', val: '-62%' },
    metric3: { label: 'CLARITY', val: 'MAX' },
    heroImg: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=1600&q=80',
    blImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    trImg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    brImg: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80',
    quote: 'Turning overwhelming enterprise data into clear, confident human decisions.',
  },
  {
    id: 'research',
    num: '07',
    title: 'User Research',
    shortDesc: 'Insights and Validation',
    heading: ['User Research', 'and', 'Insights'],
    fullDesc: 'Triangulating quantitative telemetry with qualitative usability sessions to unearth non-obvious behavioral patterns and unmet user needs.',
    metric1: { label: 'COHORTS', val: '400+' },
    metric2: { label: 'VALIDATION', val: 'P<0.01' },
    metric3: { label: 'SPEED', val: '2-WK' },
    heroImg: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1600&q=80',
    blImg: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80',
    trImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    brImg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    quote: 'Listening to what users do, not just what they say.',
  },
  {
    id: 'strategy',
    num: '08',
    title: 'Product Strategy',
    shortDesc: 'Roadmap and Value',
    heading: ['Product', 'Strategy', 'and', 'Roadmaps'],
    fullDesc: 'Aligning business economics with technological feasibility to define product differentiation and zero-to-one product market fit.',
    metric1: { label: 'RETENTION', val: '+34%' },
    metric2: { label: 'NPS', val: '+42' },
    metric3: { label: 'IMPACT', val: 'HIGH' },
    heroImg: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80',
    blImg: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=800&q=80',
    trImg: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80',
    brImg: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    quote: 'Design as a competitive moat and revenue engine.',
  },
];

// Lucide icon per skill, rendered as a nested <svg> centred on the given point
const SKILL_ICONS: Record<string, LucideIcon> = {
  robotics: Bot,
  genai: Sparkles,
  prototyping: SquareTerminal,
  'design-systems': LayoutGrid,
  'ui-craft': PenTool,
  'ux-arch': Network,
  research: UserSearch,
  strategy: Compass,
};

function SvgIcon({ icon: Icon, cx, cy, size }: { icon: LucideIcon; cx: number; cy: number; size: number }) {
  return <Icon x={cx - size / 2} y={cy - size / 2} width={size} height={size} strokeWidth={1.5} aria-hidden="true" />;
}

// Design-system tokens, translated to SVG (fill = bg, 1px non-scaling stroke = ring-1)
const SURFACE = 'fill-(--sp-surface) stroke-(--sp-line) transition-colors duration-300';
const OUTLINE = 'fill-none stroke-(--sp-line) transition-colors duration-300';
const TILE = 'fill-(--sp-tile) stroke-(--sp-line) transition-colors duration-300';
// Pill states: hover mirrors `hover:bg-white/10 hover:ring-white/20`, selected mirrors `bg-white/10 ring-white/20`
const PILL_HOVER = 'group-hover/pill:fill-(--sp-surface-hover) group-hover/pill:stroke-(--sp-line-hover)';
const PILL_ACTIVE = 'fill-(--sp-surface-active) stroke-(--sp-line-active)';
// Solid circle buttons: same as the Hero send button (bg-white/80 -> hover:bg-white, text-black/80, border-white/10)
const SOLID_BUTTON = 'fill-(--sp-solid) stroke-(--sp-line) transition-colors duration-300 group-hover/btn:fill-(--sp-solid-hover)';
const HAIRLINE = { strokeWidth: 1, vectorEffect: 'non-scaling-stroke' } as const;

const HERO_PATH = `
  M 312 36 L 550 36 A 20 20 0 0 1 570 56 L 570 60 A 20 20 0 0 0 590 80 L 758 80
  A 20 20 0 0 0 778 60 L 778 56 A 20 20 0 0 1 798 36 L 1096 36 A 32 32 0 0 1 1128 68
  L 1128 752 A 32 32 0 0 1 1096 784 L 670 784 A 32 32 0 0 1 638 752 L 638 506
  A 28 28 0 0 0 610 478 L 520 478 A 28 28 0 0 1 492 450 L 492 328 A 28 28 0 0 0 464 300
  L 312 300 A 32 32 0 0 1 280 268 L 280 68 A 32 32 0 0 1 312 36 Z`;

const TOP_RIGHT_PATH = `
  M 1170 364 L 1380 364 A 24 24 0 0 0 1404 340 L 1404 60 A 24 24 0 0 0 1380 36
  L 1264 36 A 24 24 0 0 0 1240 60 L 1240 84 A 50 50 0 0 1 1190 134 L 1170 134
  A 24 24 0 0 0 1146 158 L 1146 340 A 24 24 0 0 0 1170 364 Z`;

// Notch arc is concentric with the action button (704, 718; r 34) at 16px clearance, like the top-right badge
const OVERLAY_PATH = `
  M 774 768 L 1084 768 A 28 28 0 0 0 1112 740 L 1112 558 A 28 28 0 0 0 1084 530
  L 688 530 A 28 28 0 0 0 660 558 L 660 648 A 20 20 0 0 0 680 668 L 704 668
  A 50 50 0 0 1 754 718 L 754 748 A 20 20 0 0 0 774 768 Z`;

// Image pod: picture + darkening + grid, clipped to its shape, with a hairline outline
// Per-mode images are both rendered and cross-faded by the body's light-mode class (same approach as
// the site's #dark-bg-image / #light-bg-image), so the other mode's image is already loaded on toggle
function PodImage({ img, box }: { img: ThemedImage; box: { x: number; y: number; width: number; height: number } }) {
  const props = { ...box, preserveAspectRatio: 'xMidYMid slice' };
  if (typeof img === 'string') {
    return <image href={img} {...props} className="transition-opacity duration-700" />;
  }
  return (
    <>
      <image href={img.dark} {...props} className="sp-img-dark transition-opacity duration-700" />
      <image href={img.light} {...props} className="sp-img-light transition-opacity duration-700" />
    </>
  );
}

function ImagePod({ img, clipId, shape, box, gridOpacity = 0.3 }: {
  img: ThemedImage;
  clipId: string;
  shape: React.ReactElement<React.SVGProps<SVGElement>>;
  box: { x: number; y: number; width: number; height: number };
  gridOpacity?: number;
}) {
  return (
    <>
      <g clipPath={`url(#${clipId})`}>
        <PodImage img={img} box={box} />
        <rect {...box} fill="url(#heroImgGradient)" />
        <rect {...box} fill="url(#heroGrid)" opacity={gridOpacity} />
      </g>
      {React.cloneElement(shape, { className: `${OUTLINE} group-hover/pod:stroke-(--sp-line-hover)`, ...HAIRLINE })}
    </>
  );
}

// Pill button on the hero's top shelf: the header's "Contact Me" button classes, except the fill is
// bg-black/30 (the glass surface used across this page) instead of bg-white/5, which disappears over
// imagery in both modes. Every class here has a light-mode rule in globals.css.
const NAV_BUTTON =
  'inline-flex items-center gap-2 transition-[transform,translate,scale,opacity,background-color,border-color,color] active:scale-95 text-sm font-medium font-geist rounded-full ring-1 pt-2 pr-3.5 pb-2 pl-3.5 backdrop-blur-sm hover:bg-white/10 hover:ring-white/20 text-white/80 bg-black/30 ring-white/10 cursor-pointer';

function ShelfButton({ x, align, onClick, label, children }: {
  x: number;
  align: 'start' | 'end';
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <foreignObject x={x} y="46" width="140" height="40">
      <div className={`flex h-full items-center ${align === 'end' ? 'justify-end' : 'justify-start'}`}>
        <button type="button" onClick={onClick} aria-label={label} className={NAV_BUTTON}>
          {children}
        </button>
      </div>
    </foreignObject>
  );
}

const HEADING_SIZE = 30;
const HEADING_LINE = 32;
const HEADING_CENTER_Y = 398;

const THEME_CSS = `
.skills-preview {
  --sp-surface: rgba(0, 0, 0, 0.3);            /* bg-black/30 */
  --sp-tile: rgba(255, 255, 255, 0.05);        /* bg-white/5 */
  --sp-surface-hover: rgba(255, 255, 255, 0.1); /* hover:bg-white/10 */
  --sp-surface-active: rgba(255, 255, 255, 0.1); /* bg-white/10 */
  --sp-line: rgba(255, 255, 255, 0.1);         /* ring-white/10 */
  --sp-line-hover: rgba(255, 255, 255, 0.2);   /* hover:ring-white/20 */
  --sp-line-active: rgba(255, 255, 255, 0.2);  /* ring-white/20 */
  --sp-line-focus: rgba(255, 255, 255, 0.3);   /* ring-white/30 */
  --sp-ink: #ffffff;                           /* text-white */
  --sp-ink-hover: #ffffff;                     /* hover:text-white */
  --sp-ink-80: rgba(255, 255, 255, 0.8);       /* text-white/80 */
  --sp-ink-50: rgba(255, 255, 255, 0.5);       /* text-white/50 */
  --sp-solid: rgba(255, 255, 255, 0.8);        /* bg-white/80 */
  --sp-solid-hover: #ffffff;                   /* hover:bg-white */
  --sp-on-solid: rgba(0, 0, 0, 0.8);           /* text-black/80 */
  --sp-scrim: #000000;                         /* image darkening */
  --sp-grid: rgba(255, 255, 255, 0.05);
}
.skills-preview .sp-img-light { opacity: 0; }
.light-mode .skills-preview .sp-img-dark { opacity: 0; }
.light-mode .skills-preview .sp-img-light { opacity: 1; }
.light-mode .skills-preview {
  --sp-surface: rgba(255, 255, 255, 0.6);      /* .light-mode .bg-black/30 */
  --sp-tile: rgba(24, 24, 27, 0.04);           /* .light-mode .bg-white/5 */
  --sp-surface-hover: rgba(0, 0, 0, 0.05);     /* .light-mode .hover:bg-white/10 */
  --sp-surface-active: rgba(24, 24, 27, 0.1);  /* .light-mode .bg-white/10 */
  --sp-line: rgba(24, 24, 27, 0.1);            /* .light-mode .ring-white/10 */
  --sp-line-hover: rgba(0, 0, 0, 0.1);         /* .light-mode .hover:ring-white/20 */
  --sp-line-active: rgba(24, 24, 27, 0.2);     /* .light-mode .ring-white/20 */
  --sp-line-focus: rgba(24, 24, 27, 0.3);      /* .light-mode .ring-white/30 */
  --sp-ink: #18181b;                           /* .light-mode .text-white */
  --sp-ink-hover: #000000;                     /* .light-mode .hover:text-white */
  --sp-ink-80: rgba(24, 24, 27, 0.8);          /* .light-mode .text-white/80 */
  --sp-ink-50: rgba(24, 24, 27, 0.5);          /* .light-mode .text-white/50 */
  --sp-solid: rgba(0, 0, 0, 0.8);              /* .light-mode .bg-white/80 */
  --sp-solid-hover: #18181b;                   /* .light-mode .hover:bg-white */
  --sp-on-solid: rgba(255, 255, 255, 0.8);     /* .light-mode .text-black/80 */
  --sp-scrim: #ffffff;
  --sp-grid: rgba(24, 24, 27, 0.05);
}
`;

export default function SkillsPreview() {
  // Same store and body class the site uses, so globals.css light-mode rules apply here too
  const { isLightMode, toggleTheme } = useThemeStore();
  useEffect(() => {
    document.body.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);
  const showBackground = useUnicornStudio(true, isLightMode);

  const [activeSkillId, setActiveSkillId] = useState<string>('robotics');
  const activeSkill = SKILLS_DATA.find((s) => s.id === activeSkillId) || SKILLS_DATA[0];
  const activeIndex = SKILLS_DATA.indexOf(activeSkill);
  // Wraps around: Next on the last skill goes to the first, Prev on the first goes to the last
  const step = (delta: number) =>
    setActiveSkillId(SKILLS_DATA[(activeIndex + delta + SKILLS_DATA.length) % SKILLS_DATA.length].id);

  return (
    <div className="skills-preview min-h-screen text-(--sp-ink) flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden select-none">
      <style>{THEME_CSS}</style>

      {/* Theme toggle (same button as the site header) */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed top-4 right-4 z-20 inline-flex transition-[transform,translate,scale,opacity,background-color,border-color,color] active:scale-95 w-9 h-9 rounded-full ring-1 backdrop-blur-sm items-center justify-center hover:bg-white/10 hover:ring-white/20 text-white/80 bg-white/10 ring-white/10"
      >
        {isLightMode ? <Sun className="w-[18px] h-[18px]" strokeWidth={1.5} aria-hidden="true" /> : <Moon className="w-[18px] h-[18px] text-white" strokeWidth={1.5} aria-hidden="true" />}
      </button>

      {/* Unicorn Studio background, same scenes and markup as the main site (src/App.tsx) */}
      <div className="aura-background-component bg-black md:bg-transparent fixed -z-10 w-full h-screen top-0">
        {!isLightMode && (
          <div id="darkBackground" data-us-project="krvLrHX3sj3cg8BHywDj" data-us-lazyload="true" data-us-production="true" data-us-scale="0.75" data-us-dpi="1.0" data-us-fps="30" className={`absolute top-0 left-0 -z-10 w-full h-full invisible md:visible transition-opacity ${showBackground ? 'opacity-100 duration-300' : 'opacity-0 duration-[900ms]'}`}></div>
        )}
        {isLightMode && (
          <div id="lightBackground" data-us-project="yACzULFKkgXAmEcep6hu" data-us-lazyload="true" data-us-production="true" data-us-scale="0.75" data-us-dpi="1.0" data-us-fps="30" className={`absolute top-0 left-0 -z-10 w-full h-full invisible md:visible transition-opacity ${showBackground ? 'opacity-100 duration-300' : 'opacity-0 duration-[900ms]'}`}></div>
        )}
      </div>

      {/* Main Responsive Viewport Container (Aspect 1440 / 820) */}
      <div className="relative w-full max-w-[1440px] aspect-[1440/820] flex items-center justify-center z-10">
        <svg viewBox="0 0 1440 820" className="w-full h-full" fill="none">
          <defs>

            {/* Hero Card Image Dark Gradient Overlay */}
            <linearGradient id="heroImgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopOpacity="0.72" style={{ stopColor: 'var(--sp-scrim)' }} />
              <stop offset="50%" stopOpacity="0.45" style={{ stopColor: 'var(--sp-scrim)' }} />
              <stop offset="100%" stopOpacity="0.82" style={{ stopColor: 'var(--sp-scrim)' }} />
            </linearGradient>

            {/* Coordinate Grid Pattern */}
            <pattern id="heroGrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" style={{ stroke: 'var(--sp-grid)' }} strokeWidth="1" />
              <circle cx="36" cy="36" r="1" style={{ fill: 'var(--sp-grid)' }} />
            </pattern>

            {/* 
              ========================================================================
              EXACT MATHEMATICAL CLIPPING PATHS MATCHING PROPOSED WIREFRAME
              ========================================================================
            */}
            <clipPath id="heroClip"><path d={HERO_PATH} /></clipPath>
            <clipPath id="topRightClip"><path d={TOP_RIGHT_PATH} /></clipPath>
            <clipPath id="bottomLeftClip"><rect x="280" y="496" width="340" height="288" rx="28" /></clipPath>
            <clipPath id="bottomRightClip"><rect x="1146" y="514" width="258" height="270" rx="28" /></clipPath>
          </defs>

          {/* 
            ========================================================================
            1. LEFT COLUMN: 8 IDENTICAL STACKED HORIZONTAL CAPSULE PILLS
            ========================================================================
            - X: 36 to 262 (Width: 226)
            - Y: 36 to 784 (Height: 748)
            - 8 Pills: Height = 76, Gap = 20, Radius = 38 (Full Capsule)
            - Same states as the site's pill buttons: hover = bg-white/10 + ring-white/20,
              selected = the hover look held on, text white/80 -> white, icon tile white/5 -> white/10
          */}
          {SKILLS_DATA.map((skill, index) => {
            const pillHeight = 76;
            const pillGap = 20;
            const y = 36 + index * (pillHeight + pillGap);
            const isActive = skill.id === activeSkillId;

            return (
              <g
                key={skill.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={skill.title}
                className="group/pill cursor-pointer outline-none"
                onClick={() => setActiveSkillId(skill.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveSkillId(skill.id);
                  }
                }}
              >
                {/* Pill Capsule Body */}
                <rect
                  x="36"
                  y={y}
                  width="226"
                  height={pillHeight}
                  rx="38"
                  className={`transition-colors duration-300 group-focus-visible/pill:stroke-(--sp-line-focus) ${isActive ? PILL_ACTIVE : `${SURFACE} ${PILL_HOVER}`}`}
                  {...HAIRLINE}
                />

                {/* Left Circular Icon Tile */}
                <circle
                  cx="72"
                  cy={y + 38}
                  r="20"
                  className={`transition-colors duration-300 ${isActive ? PILL_ACTIVE : `${TILE} ${PILL_HOVER}`}`}
                  {...HAIRLINE}
                />
                <g
                  className={`pointer-events-none origin-center [transform-box:fill-box] transition-[scale,color] duration-300 group-hover/pill:scale-110 group-hover/pill:text-(--sp-ink-hover) ${isActive ? 'text-(--sp-ink)' : 'text-(--sp-ink-80)'}`}
                >
                  <SvgIcon icon={SKILL_ICONS[skill.id]} cx={72} cy={y + 38} size={20} />
                </g>

                {/* Title & subtitle (same hierarchy as the Skills cards) */}
                <text
                  x="100"
                  y={y + 34}
                  className={`pointer-events-none font-geist text-sm font-semibold tracking-tight transition-colors duration-300 group-hover/pill:fill-(--sp-ink-hover) ${isActive ? 'fill-(--sp-ink)' : 'fill-(--sp-ink-80)'}`}
                >
                  {skill.title}
                </text>
                <text
                  x="100"
                  y={y + 52}
                  className={`pointer-events-none text-xs transition-colors duration-300 group-hover/pill:fill-(--sp-ink-80) ${isActive ? 'fill-(--sp-ink-80)' : 'fill-(--sp-ink-50)'}`}
                >
                  {skill.shortDesc}
                </text>
              </g>
            );
          })}

          {/* 
            ========================================================================
            2. MAIN CENTER HERO CONTAINER (Exact Interlocking Stepped Contour)
            ========================================================================
          */}
          <g className="group/pod">
            <ImagePod
              img={activeSkill.heroImg}
              clipId="heroClip"
              shape={<path d={HERO_PATH} />}
              box={{ x: 280, y: 36, width: 848, height: 748 }}
              gridOpacity={0.35}
            />
          </g>

          {/* Section title in the top notch (site eyebrow style, sized up: uppercase text-white/50 tracking-wider) */}
          <text x="674" y="64" textAnchor="middle" className="pointer-events-none text-base font-medium uppercase tracking-wider fill-(--sp-ink-50)">
            My Skills
          </text>

          {/* Top Shelf Prev / Next (loop through the skills) */}
          <ShelfButton x={304} align="start" onClick={() => step(-1)} label="Previous skill">
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            Prev
          </ShelfButton>
          <ShelfButton x={964} align="end" onClick={() => step(1)} label="Next skill">
            Next
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
          </ShelfButton>

          {/* 
            ========================================================================
            2B. OVERLAY CARD (In Bottom-Right of Main Hero Container)
            ========================================================================
            - Notched bottom-left corner with cradled circular icon button
            - 3 metric cards
            - Full skill description text above
          */}
          <g className="group/overlay">
            <path
              d={OVERLAY_PATH}
              className={`${SURFACE} group-hover/overlay:fill-(--sp-surface-hover) group-hover/overlay:stroke-(--sp-line-hover)`}
              {...HAIRLINE}
            />

            {/* Description Paragraph in Upper Area */}
            <foreignObject x="684" y="546" width="404" height="106" className="pointer-events-none">
              <p className="text-sm leading-relaxed text-(--sp-ink-80)">
                {activeSkill.fullDesc}
              </p>
            </foreignObject>
          </g>

          {/* Circular Action Button nestled in the bottom-left notch */}
          <g className="group/btn cursor-pointer">
            <circle
              cx="704"
              cy="718"
              r="34"
              className={SOLID_BUTTON}
              {...HAIRLINE}
            />
            <g className="pointer-events-none origin-center [transform-box:fill-box] transition-[scale,color] duration-300 text-(--sp-on-solid) group-hover/btn:scale-110">
              <SvgIcon icon={User} cx={704} cy={718} size={24} />
            </g>
          </g>

          {/* 3 Metric Cards */}
          {[activeSkill.metric1, activeSkill.metric2, activeSkill.metric3].map((metric, i) => {
            const cardX = 770 + i * 112;
            return (
              <g key={i} className="group/metric">
                <rect
                  x={cardX}
                  y="678"
                  width="102"
                  height="76"
                  rx="16"
                  className={`${SURFACE} group-hover/metric:fill-(--sp-surface-hover) group-hover/metric:stroke-(--sp-line-hover)`}
                  {...HAIRLINE}
                />
                <text
                  x={cardX + 51}
                  y="714"
                  textAnchor="middle"
                  className="pointer-events-none font-geist text-lg font-semibold tracking-tight fill-(--sp-ink-80) transition-colors duration-300 group-hover/metric:fill-(--sp-ink-hover)"
                >
                  {metric.val}
                </text>
                <text
                  x={cardX + 51}
                  y="736"
                  textAnchor="middle"
                  className="pointer-events-none text-xs font-medium fill-(--sp-ink-50) transition-colors duration-300 group-hover/metric:fill-(--sp-ink-80)"
                >
                  {metric.label}
                </text>
              </g>
            );
          })}

          {/* 
            ========================================================================
            3. "HEADING" (In the Negative Space Pocket)
            ========================================================================
            - Bold white, line breaks set per skill in SKILLS_DATA
          */}
          <g className="pointer-events-none">
            {activeSkill.heading.map((line, i, lines) => (
              <text
                key={`${activeSkill.id}-${i}`}
                x="280"
                // block centred vertically in the pocket (y 300 to 496)
                y={HEADING_CENTER_Y - ((lines.length - 1) * HEADING_LINE) / 2 + i * HEADING_LINE + HEADING_SIZE * 0.36}
                fontSize={HEADING_SIZE}
                className="font-geist font-bold tracking-tight fill-(--sp-ink)"
              >
                {line}
              </text>
            ))}
          </g>

          {/* 
            ========================================================================
            4. BOTTOM-LEFT POD (Directly Under Heading, Baseline-Aligned)
            ========================================================================
          */}
          <g className="group/pod">
            <ImagePod
              img={activeSkill.blImg}
              clipId="bottomLeftClip"
              shape={<rect x="280" y="496" width="340" height="288" rx="28" />}
              box={{ x: 280, y: 496, width: 340, height: 288 }}
            />
          </g>

          {/* 
            ========================================================================
            5. RIGHT COLUMN (3 PODS + CIRCULAR BADGE)
            ========================================================================
          */}

          {/* 5A. Top Stepped Card with Notch Wrapping Around Circular Badge */}
          <g className="group/pod">
            <ImagePod
              img={activeSkill.trImg}
              clipId="topRightClip"
              shape={<path d={TOP_RIGHT_PATH} />}
              box={{ x: 1146, y: 36, width: 258, height: 328 }}
            />
          </g>

          {/* 5A. Circular Status Badge Nestled in Top-Left Notch */}
          <g className="group/btn cursor-pointer">
            <circle
              cx="1190"
              cy="84"
              r="34"
              className={SOLID_BUTTON}
              {...HAIRLINE}
            />
            <g className="pointer-events-none origin-center [transform-box:fill-box] transition-[scale,color] duration-300 text-(--sp-on-solid) group-hover/btn:scale-110">
              <SvgIcon icon={User} cx={1190} cy={84} size={24} />
            </g>
          </g>

          {/* 5B. Middle Horizontal Capsule Pill (With Philosophy / Quote Copy) */}
          <g className="group/quote">
            <rect
              x="1146"
              y="382"
              width="258"
              height="114"
              rx="32"
              className={`${SURFACE} group-hover/quote:fill-(--sp-surface-hover) group-hover/quote:stroke-(--sp-line-hover)`}
              {...HAIRLINE}
            />
            <foreignObject x="1166" y="398" width="218" height="82" className="pointer-events-none">
              <p className="text-sm leading-relaxed text-(--sp-ink-80)">
                {activeSkill.quote}
              </p>
            </foreignObject>
          </g>

          {/* 5C. Bottom Rounded Rectangle Pod (Aligned with Bottom Baseline) */}
          <g className="group/pod">
            <ImagePod
              img={activeSkill.brImg}
              clipId="bottomRightClip"
              shape={<rect x="1146" y="514" width="258" height="270" rx="28" />}
              box={{ x: 1146, y: 514, width: 258, height: 270 }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
