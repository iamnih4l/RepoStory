'use client';

import React, { useState } from 'react';
import { RepoLesson } from '@/lib/types/lesson';
import { JourneyNavigator } from '../layout/JourneyNavigator';
import { AnimationCanvas } from '../canvas/AnimationCanvas';
import { ExplanationPanel } from '../layout/ExplanationPanel';
import { ConceptModal } from '../exploration/ConceptModal';
import { Sparkles, Info, X } from 'lucide-react';
import { cyberAudio } from '@/lib/audio/cyberAudio';

interface StoryViewProps {
  lesson: RepoLesson;
  onExploreAnother?: () => void;
}

export function StoryView({ lesson, onExploreAnother }: StoryViewProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [selectedConcept, setSelectedConcept] = useState<{ id: string; name: string } | null>(null);
  const [showDemoNotice, setShowDemoNotice] = useState(Boolean(lesson.metadata?.isDemoFallback));

  const chapters = lesson.chapters || [];
  const currentChapter = chapters[currentChapterIndex] || chapters[0];

  const handlePrevChapter = () => {
    cyberAudio.playSwitch();
    setCurrentChapterIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextChapter = () => {
    cyberAudio.playChapterWarp();
    setCurrentChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1));
  };

  const handleSelectChapter = (idx: number) => {
    cyberAudio.playChapterWarp();
    setCurrentChapterIndex(idx);
  };

  const handleOpenConcept = (conceptId: string, conceptName: string) => {
    cyberAudio.playClick();
    setSelectedConcept({ id: conceptId, name: conceptName });
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 gap-4">
      {/* Optional Demo Notice Banner */}
      {showDemoNotice && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5 font-mono">
                Featured Sample Learning Journey
              </span>
              <p className="text-amber-200/90 leading-relaxed">
                {lesson.metadata?.notice ||
                  'Exploring our verified sample repository. To generate visual stories for any public GitHub repository, configure GEMINI_API_KEY in your .env.local file.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDemoNotice(false)}
            className="text-amber-400/70 hover:text-amber-300 p-1 cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3-Part Responsive Picture-Book Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 items-stretch min-h-[620px]">
        {/* Left: Journey Navigator */}
        <JourneyNavigator
          chapters={chapters}
          currentChapterIndex={currentChapterIndex}
          onSelectChapter={handleSelectChapter}
        />

        {/* Center: Animated Learning Canvas */}
        <AnimationCanvas
          chapter={currentChapter}
          lesson={lesson}
          chapterIndex={currentChapterIndex}
          totalChapters={chapters.length}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          onExploreAnother={onExploreAnother}
        />

        {/* Right: Explanation Panel & Contextual Q&A */}
        <ExplanationPanel
          chapter={currentChapter}
          allConcepts={lesson.concepts || []}
          repoLessonId={lesson.id}
          onOpenConcept={handleOpenConcept}
        />
      </div>

      {/* Interactive Concept Exploration Modal */}
      {selectedConcept && (
        <ConceptModal
          isOpen={Boolean(selectedConcept)}
          onClose={() => setSelectedConcept(null)}
          conceptId={selectedConcept.id}
          conceptName={selectedConcept.name}
          repoLessonId={lesson.id}
        />
      )}
    </div>
  );
}
