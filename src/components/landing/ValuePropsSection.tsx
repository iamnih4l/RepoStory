'use client';

import React from 'react';
import {
  BookOpen,
  Sparkles,
  Cpu,
  Compass,
  Rocket,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { CyberCard } from '../ui/CyberCard';

const CHAPTERS_PREVIEW = [
  {
    num: 1,
    title: 'Meet the Project',
    icon: BookOpen,
    glow: 'cyan' as const,
    hudTag: 'CH_01 // INTRO',
    description: 'Understand the big picture in seconds with plain-English summaries and high-level workflow diagrams.',
  },
  {
    num: 2,
    title: 'See What It Can Do',
    icon: Sparkles,
    glow: 'lime' as const,
    hudTag: 'CH_02 // CAPABILITIES',
    description: 'Observe real repository capabilities through interactive visual demonstrations grounded in repository evidence.',
  },
  {
    num: 3,
    title: 'Discover How It Works',
    icon: Cpu,
    glow: 'violet' as const,
    hudTag: 'CH_03 // PIPELINE',
    description: 'Follow data as it flows through connected system modules with animated state transitions and inspectable nodes.',
  },
  {
    num: 4,
    title: 'Explore Core Concepts',
    icon: Compass,
    glow: 'cyan' as const,
    hudTag: 'CH_04 // DEEP_DIVE',
    description: 'Demystify complex terms (embeddings, chunking, transformers) through 3D hypersphere models and progressive difficulty modes.',
  },
  {
    num: 5,
    title: "Let's Use It",
    icon: Rocket,
    glow: 'amber' as const,
    hudTag: 'CH_05 // COOKBOOK',
    description: 'Get up and running with verified installation commands, environment templates, and practical copy-paste guides.',
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-14 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-900 select-none z-10 relative">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-2">
          // CURRICULUM ARCHITECTURE
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mb-3">
          How Every Repository Story Unfolds
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
          RepoStory discards long, intimidating README walls of text in favor of an interactive,
          step-by-step visual picture-book curriculum.
        </p>
      </div>

      {/* Cyber 3D Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CHAPTERS_PREVIEW.map((item, idx) => {
          const Icon = item.icon;
          const isLarge = idx === 0 || idx === 2;

          return (
            <CyberCard
              key={item.num}
              glowColor={item.glow}
              hudTag={item.hudTag}
              className={`p-6 flex flex-col justify-between ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-950/80 border border-slate-700/60 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-100 mb-2 font-sans tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              {/* Bottom Telemetry Note */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Zero AI video generation • Real-time WebGL & Canvas rendering</span>
              </div>
            </CyberCard>
          );
        })}
      </div>
    </section>
  );
}
