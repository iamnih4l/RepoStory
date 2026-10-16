'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, BookOpen, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';
import { Chapter, RepoLesson } from '@/lib/types/lesson';
import { Button } from '../ui/Button';
import { cyberAudio } from '@/lib/audio/cyberAudio';

interface SummarySceneProps {
  chapter: Chapter;
  lesson: RepoLesson;
  onExploreAnother?: () => void;
}

export function SummaryScene({ chapter, lesson, onExploreAnother }: SummarySceneProps) {
  useEffect(() => {
    // Launch celebratory confetti burst & victory audio
    try {
      cyberAudio.playSuccess();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#39FF14', '#38BDF8', '#8B5CF6'],
      });
    } catch {
      // Ignore if canvas-confetti is unavailable
    }
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4 h-4 text-lime-400" />
          <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest">
            Milestone Achieved // Curriculum Complete
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Learning Journey Complete!
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          You now have an intuitive, visual mental model of how {lesson.repo.fullName} operates.
        </p>
      </div>

      {/* Center Celebration & Certificate Card */}
      <div className="my-auto py-4 max-w-2xl mx-auto w-full">
        <div className="bg-slate-950/80 border border-lime-400/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(57,255,20,0.15)] text-center relative overflow-hidden backdrop-blur-2xl">
          {/* Cyber HUD Brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-lime-400/60 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-lime-400/60 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-lime-400/60 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-lime-400/60 pointer-events-none" />

          {/* Decorative glowing gradient aura */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-gradient-to-b from-cyan-400/15 via-lime-400/10 to-transparent blur-3xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-lime-400 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,240,255,0.5)]">
            <Award className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-100 tracking-tight mb-2">
            You Mastered {lesson.repo.name}
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
            {lesson.summary.tagline}
          </p>

          {/* Concepts Mastered Pills */}
          <div className="bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-4 mb-6 text-left">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Concepts Understood:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {lesson.concepts.map((concept) => (
                <div key={concept.id} className="flex items-start gap-2 text-slate-300 font-medium font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
                  <span>{concept.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={lesson.repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-100 text-xs font-semibold border border-slate-700 hover:border-cyan-400/50 transition-colors font-mono"
            >
              <span>View GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {onExploreAnother && (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  cyberAudio.playClick();
                  onExploreAnother();
                }}
                icon={<BookOpen className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Explore Another Project
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Takeaway */}
      <div className="text-center text-xs text-slate-500 font-mono">
        Made with RepoStory // Visual interactive mental models for public codebases.
      </div>
    </div>
  );
}
