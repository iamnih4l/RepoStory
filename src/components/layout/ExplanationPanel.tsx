'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Lightbulb,
  FileCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
} from 'lucide-react';
import { Chapter, ConceptSummary } from '@/lib/types/lesson';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cyberAudio } from '@/lib/audio/cyberAudio';
import { getClientApiHeaders } from '@/lib/storage/apiKeyStorage';

interface ExplanationPanelProps {
  chapter: Chapter;
  allConcepts: ConceptSummary[];
  repoLessonId: string;
  onOpenConcept: (conceptId: string, conceptName: string) => void;
  className?: string;
}

export function ExplanationPanel({
  chapter,
  allConcepts,
  repoLessonId,
  onOpenConcept,
  className = '',
}: ExplanationPanelProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qnaResult, setQnaResult] = useState<{
    answer: string;
    groundedInFiles: string[];
    simplifiedTakeaway: string;
  } | null>(null);
  const [qnaError, setQnaError] = useState<string | null>(null);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    cyberAudio.playClick();
    setIsAsking(true);
    setQnaError(null);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getClientApiHeaders(),
        },
        body: JSON.stringify({
          repoLessonId,
          question: question.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      cyberAudio.playSuccess();
      setQnaResult(data.answer);
    } catch (err: unknown) {
      setQnaError(err instanceof Error ? err.message : 'Error asking question');
    } finally {
      setIsAsking(false);
    }
  };

  const handleConceptClick = (conceptId: string, displayName: string) => {
    cyberAudio.playClick();
    onOpenConcept(conceptId, displayName);
  };

  return (
    <aside
      className={`w-full lg:w-84 shrink-0 flex flex-col gap-4 bg-slate-950/75 border border-cyan-500/25 rounded-3xl p-4.5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-y-auto max-h-[800px] relative ${className}`}
    >
      {/* Corner HUD markers */}
      <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none" />
      <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-cyan-400/50 pointer-events-none" />

      {/* Chapter Context Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="lime" size="sm">
            Chapter {chapter.chapterNumber}
          </Badge>
          <span className="text-[10px] text-cyan-400 font-mono capitalize">
            {chapter.sceneType.replace('-', ' ')}
          </span>
        </div>
        <h3 className="text-base font-bold text-slate-100 tracking-tight leading-snug">
          {chapter.title}
        </h3>
        <p className="text-xs text-lime-400/90 font-medium mt-1 font-mono">
          Goal: {chapter.learningObjective}
        </p>
      </div>

      {/* Plain English Narrative */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 relative overflow-hidden">
        <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Story So Far</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {chapter.plainEnglishExplanation}
        </p>
      </div>

      {/* Key Takeaway Card */}
      {chapter.takeawayMessage && (
        <div className="bg-slate-900/90 border border-lime-400/30 rounded-xl p-3 shadow-[inset_0_0_15px_rgba(57,255,20,0.05)]">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold text-lime-400 block mb-0.5 font-mono">
                Key Takeaway
              </span>
              <p className="text-xs text-slate-200 leading-normal">
                {chapter.takeawayMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Relevant Concepts - Clickable Pills */}
      {chapter.relevantConcepts && chapter.relevantConcepts.length > 0 && (
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
            Key Concepts (Click to explore)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {chapter.relevantConcepts.map((conceptId) => {
              const matchedConcept = allConcepts.find((c) => c.id === conceptId);
              const displayName = matchedConcept ? matchedConcept.name : conceptId;
              return (
                <button
                  key={conceptId}
                  onClick={() => handleConceptClick(conceptId, displayName)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 hover:border-cyan-400 transition-all cursor-pointer font-medium active:scale-95 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                >
                  <Lightbulb className="w-3 h-3 text-cyan-400" />
                  <span>{displayName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Source References Accordion */}
      {chapter.sourceReferences && chapter.sourceReferences.length > 0 && (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
          <button
            onClick={() => {
              cyberAudio.playClick();
              setSourcesOpen(!sourcesOpen);
            }}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-900/90 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 font-mono">
              <FileCode className="w-3.5 h-3.5 text-lime-400" />
              <span>Real Repository Sources ({chapter.sourceReferences.length})</span>
            </div>
            {sourcesOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {sourcesOpen && (
            <div className="p-3 border-t border-slate-800 flex flex-col gap-2.5 bg-slate-950/60">
              {chapter.sourceReferences.map((ref, idx) => (
                <div key={idx} className="text-xs">
                  <div className="font-mono text-lime-400 flex items-center justify-between">
                    <span className="truncate">{ref.filePath}</span>
                    {ref.startLine && (
                      <span className="text-[10px] text-slate-500">
                        L{ref.startLine}{ref.endLine ? `-L${ref.endLine}` : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                    {ref.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contextual Ask RepoStory Box */}
      <div className="mt-auto pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask RepoStory</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Grounded Q&A</span>
        </div>

        <form onSubmit={handleAskQuestion} className="flex gap-1.5">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this repo..."
            className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/60 font-sans"
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={!question.trim() || isAsking}
            isLoading={isAsking}
            className="px-2.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>

        {qnaError && (
          <p className="text-[11px] text-red-400 mt-2 bg-red-950/40 border border-red-900/60 p-2 rounded-lg">
            {qnaError}
          </p>
        )}

        {qnaResult && (
          <div className="mt-2.5 bg-slate-900/90 border border-cyan-400/30 rounded-xl p-3 text-xs flex flex-col gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            <div className="flex items-center gap-1.5 text-lime-400 font-semibold text-[11px] font-mono">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Grounded Answer</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {qnaResult.answer}
            </p>
            {qnaResult.groundedInFiles.length > 0 && (
              <div className="text-[10px] text-slate-500 font-mono">
                Verified from: {qnaResult.groundedInFiles.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
