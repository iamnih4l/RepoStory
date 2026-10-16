'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lightbulb,
  Compass,
  Code2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { ConceptDeepDive, ExplanationLevel } from '@/lib/types/lesson';
import { Badge } from '../ui/Badge';
import { CodeBlock } from '../ui/CodeBlock';
import { getClientApiHeaders } from '@/lib/storage/apiKeyStorage';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  conceptId: string;
  conceptName: string;
  repoLessonId: string;
}

export function ConceptModal({
  isOpen,
  onClose,
  conceptId,
  conceptName,
  repoLessonId,
}: ConceptModalProps) {
  const [level, setLevel] = useState<ExplanationLevel>('beginner');
  const [deepDive, setDeepDive] = useState<ConceptDeepDive | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !conceptId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchExplanation = async () => {
      try {
        const res = await fetch('/api/explain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getClientApiHeaders(),
          },
          body: JSON.stringify({
            repoLessonId,
            conceptId,
            conceptName,
            level,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load concept explanation.');
        }

        if (isMounted) {
          setDeepDive(data.deepDive);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error fetching concept explanation');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [isOpen, conceptId, conceptName, level, repoLessonId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-slate-950/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85),inset_0_0_35px_rgba(0,240,255,0.06)] z-10 my-8 overflow-hidden max-h-[85vh] flex flex-col backdrop-blur-3xl"
        >
          {/* Cyber HUD Corner Brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

          {/* Top Header */}
          <div className="flex items-start justify-between gap-4 border-b border-cyan-500/20 pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="violet" size="sm" icon={<Lightbulb className="w-3 h-3" />}>
                  Concept Deep Dive
                </Badge>
                <span className="text-xs font-mono text-slate-400 capitalize">
                  Level: {level}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                {conceptName}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Explanation Level Selector */}
          <div className="flex items-center justify-between mb-5 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 px-2 font-medium">
              Explanation Mode:
            </span>
            <div className="flex items-center gap-1">
              {(['beginner', 'intermediate', 'technical'] as ExplanationLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer ${
                    level === lvl
                      ? 'bg-lime-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Content Area */}
          <div className="overflow-y-auto flex-1 pr-1 flex flex-col gap-4">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
                <span className="animate-spin inline-block w-6 h-6 border-2 border-lime-400 border-t-transparent rounded-full" />
                <span className="text-xs font-mono">Unfolding concept explanation...</span>
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs">
                {error}
              </div>
            ) : deepDive ? (
              <>
                {/* 1. Real-World Analogy */}
                <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20 rounded-2xl p-4">
                  <span className="text-[11px] font-mono font-bold text-violet-400 uppercase tracking-wider block mb-1">
                    Everyday Analogy
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {deepDive.analogy}
                  </p>
                </div>

                {/* 2. Core Computational Mechanism */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[11px] font-mono font-bold text-lime-400 uppercase tracking-wider block mb-1">
                    How It Works
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {deepDive.coreMechanism}
                  </p>
                </div>

                {/* 3. In This Repository */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider block mb-1">
                    Applied in this Project
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {deepDive.inThisRepository}
                  </p>
                </div>

                {/* 4. Visual Steps Breakdown */}
                {deepDive.visualSteps && deepDive.visualSteps.length > 0 && (
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                      Visual Progression:
                    </span>
                    <div className="flex flex-col gap-2">
                      {deepDive.visualSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-lime-400/20 text-lime-400 border border-lime-400/40 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-semibold text-slate-200 mb-0.5">
                              {step.title}
                            </h4>
                            <p className="text-xs text-slate-400 leading-normal">
                              {step.explanation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Optional Code Reference */}
                {deepDive.codeReference && (
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Source Code Implementation:
                    </span>
                    <CodeBlock
                      code={deepDive.codeReference.code}
                      filename={deepDive.codeReference.filePath}
                      className="shadow-md"
                    />
                  </div>
                )}
              </>
            ) : null}
          </div>

          {/* Modal Footer */}
          <div className="border-t border-slate-800 pt-4 mt-4 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">
              Cached & reusable across chapters
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              Back to Story
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
