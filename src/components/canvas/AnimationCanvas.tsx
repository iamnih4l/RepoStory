'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  EyeOff,
  Eye,
  Maximize2,
} from 'lucide-react';
import { Chapter, RepoLesson } from '@/lib/types/lesson';
import { IntroScene } from './IntroScene';
import { CapabilityShowcaseScene } from './CapabilityShowcaseScene';
import { ProcessFlowScene } from './ProcessFlowScene';
import { ConceptExplainerScene } from './ConceptExplainerScene';
import { CodeSpotlightScene } from './CodeSpotlightScene';
import { GettingStartedScene } from './GettingStartedScene';
import { SummaryScene } from './SummaryScene';
import { Button } from '../ui/Button';

interface AnimationCanvasProps {
  chapter: Chapter;
  lesson: RepoLesson;
  chapterIndex: number;
  totalChapters: number;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onExploreAnother?: () => void;
  className?: string;
}

export function AnimationCanvas({
  chapter,
  lesson,
  chapterIndex,
  totalChapters,
  onPrevChapter,
  onNextChapter,
  onExploreAnother,
  className = '',
}: AnimationCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        onPrevChapter();
      } else if (e.key === 'ArrowRight') {
        onNextChapter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrevChapter, onNextChapter]);

  const handleReplay = () => {
    setReplayKey((k) => k + 1);
  };

  const renderScene = () => {
    switch (chapter.sceneType) {
      case 'intro':
        return <IntroScene key={replayKey} chapter={chapter} reducedMotion={reducedMotion} />;
      case 'capability-showcase':
        return <CapabilityShowcaseScene key={replayKey} chapter={chapter} />;
      case 'process-flow':
        return <ProcessFlowScene key={replayKey} chapter={chapter} />;
      case 'concept-explainer':
        return <ConceptExplainerScene key={replayKey} chapter={chapter} />;
      case 'code-spotlight':
        return <CodeSpotlightScene key={replayKey} chapter={chapter} />;
      case 'getting-started':
        return (
          <GettingStartedScene
            key={replayKey}
            chapter={chapter}
            gettingStarted={lesson.gettingStarted}
          />
        );
      case 'summary':
        return (
          <SummaryScene
            key={replayKey}
            chapter={chapter}
            lesson={lesson}
            onExploreAnother={onExploreAnother}
          />
        );
      default:
        return <IntroScene key={replayKey} chapter={chapter} reducedMotion={reducedMotion} />;
    }
  };

  return (
    <main
      className={`relative flex-1 flex flex-col bg-slate-950/75 border border-cyan-500/25 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.7),inset_0_0_30px_rgba(0,240,255,0.04)] min-h-[580px] ${className}`}
    >
      {/* Cyber HUD Corner Brackets */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none z-20" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none z-20" />
      <div className="absolute bottom-16 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none z-20" />
      <div className="absolute bottom-16 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none z-20" />

      {/* Canvas Viewport Area */}
      <div className="relative flex-1 w-full overflow-hidden">
        {renderScene()}
      </div>

      {/* Persistent Bottom Scene Control Bar */}
      <div className="border-t border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-5 py-3.5 flex items-center justify-between gap-3 relative z-20">
        {/* Left: Replay & Reduced Motion */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReplay}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Replay this scene animation"
          >
            Replay
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReducedMotion(!reducedMotion)}
            icon={reducedMotion ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            title={reducedMotion ? 'Enable smooth animations' : 'Reduce animation motion'}
            className="hidden sm:inline-flex"
          >
            {reducedMotion ? 'Reduced Motion' : 'Standard Motion'}
          </Button>
        </div>

        {/* Center: Key Navigation hints on desktop */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">→</kbd>
          <span>to navigate chapters</span>
        </div>

        {/* Right: Previous / Next Chapter Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onPrevChapter}
            disabled={chapterIndex === 0}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onNextChapter}
            disabled={chapterIndex === totalChapters - 1}
            icon={<ChevronRight className="w-4 h-4" />}
            iconPosition="right"
          >
            {chapterIndex === totalChapters - 1 ? 'End Journey' : 'Next Chapter'}
          </Button>
        </div>
      </div>
    </main>
  );
}
