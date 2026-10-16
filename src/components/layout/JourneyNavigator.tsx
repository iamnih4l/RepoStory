'use client';

import React from 'react';
import {
  BookOpen,
  Sparkles,
  GitFork,
  Lightbulb,
  Code2,
  Rocket,
  Award,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { Chapter, SceneType } from '@/lib/types/lesson';

interface JourneyNavigatorProps {
  chapters: Chapter[];
  currentChapterIndex: number;
  onSelectChapter: (index: number) => void;
  className?: string;
}

const SCENE_ICONS: Record<SceneType, React.ElementType> = {
  intro: BookOpen,
  'capability-showcase': Sparkles,
  'process-flow': GitFork,
  'concept-explainer': Lightbulb,
  'code-spotlight': Code2,
  'getting-started': Rocket,
  summary: Award,
};

export function JourneyNavigator({
  chapters,
  currentChapterIndex,
  onSelectChapter,
  className = '',
}: JourneyNavigatorProps) {
  const progressPercentage = Math.round(((currentChapterIndex + 1) / chapters.length) * 100);

  return (
    <aside
      className={`w-full lg:w-72 shrink-0 flex flex-col bg-slate-950/75 border border-cyan-500/25 rounded-3xl p-4.5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden ${className}`}
    >
      {/* Corner HUD markers */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-cyan-400/50 pointer-events-none" />

      {/* Header & Progress Indicator */}
      <div className="mb-4 pb-3 border-b border-cyan-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
            // CURRICULUM
          </span>
          <span className="text-xs font-mono font-medium text-lime-400">
            {currentChapterIndex + 1}/{chapters.length} ({progressPercentage}%)
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-400 via-sky-400 to-lime-400 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(0,240,255,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Chapter List */}
      <nav className="flex flex-col gap-1.5 overflow-y-auto max-h-[600px] pr-1">
        {chapters.map((chapter, idx) => {
          const isActive = idx === currentChapterIndex;
          const isCompleted = idx < currentChapterIndex;
          const Icon = SCENE_ICONS[chapter.sceneType] || BookOpen;

          return (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(idx)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-start gap-3 group relative cursor-pointer active:scale-[0.98] ${
                isActive
                  ? 'bg-slate-900/95 border border-cyan-400/50 text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                  : 'hover:bg-slate-900/60 border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Accent Line */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(0,240,255,0.9)]" />
              )}

              {/* Chapter Icon or Checked state */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : isCompleted
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Title & Scene Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[11px] font-mono font-medium ${
                      isActive ? 'text-lime-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    Chapter {chapter.chapterNumber}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isActive
                        ? 'text-lime-400 translate-x-0.5'
                        : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  />
                </div>
                <h4
                  className={`text-xs font-semibold truncate mt-0.5 ${
                    isActive ? 'text-slate-100' : 'text-slate-300 group-hover:text-slate-100'
                  }`}
                >
                  {chapter.title}
                </h4>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
