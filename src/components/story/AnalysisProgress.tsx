'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

interface AnalysisProgressProps {
  repoUrl: string;
  error?: string | null;
  onRetry: () => void;
  onCancel: () => void;
}

const STAGES = [
  { id: 1, label: 'Discovering the project', detail: 'Fetching repository metadata and commit history from GitHub REST API...' },
  { id: 2, label: 'Identifying important functionality', detail: 'Inspecting README, application manifests, and dependencies...' },
  { id: 3, label: 'Finding the concepts that matter', detail: 'Selecting core source files and pruning irrelevant build artifacts...' },
  { id: 4, label: 'Preparing the visual story', detail: 'Synthesizing structured learning chapters, diagrams, and code spotlights...' },
];

export function AnalysisProgress({
  repoUrl,
  error,
  onRetry,
  onCancel,
}: AnalysisProgressProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (error) return;

    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [error]);

  useEffect(() => {
    if (error) return;

    // Advance stages smoothly to reflect the realistic pipeline progression
    const stage2 = setTimeout(() => setCurrentStage(2), 1200);
    const stage3 = setTimeout(() => setCurrentStage(3), 2800);
    const stage4 = setTimeout(() => setCurrentStage(4), 4800);

    return () => {
      clearTimeout(stage2);
      clearTimeout(stage3);
      clearTimeout(stage4);
    };
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 select-none">
      <div className="relative w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/5 blur-3xl pointer-events-none" />

        {error ? (
          /* Error State */
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Analysis Encountered an Issue
            </h3>

            <p className="text-xs text-red-300 bg-red-950/50 border border-red-900/60 p-3.5 rounded-xl max-w-md mx-auto mb-6 text-left font-mono leading-relaxed">
              {error}
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={onCancel}
              >
                Back to Home
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={onRetry}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          /* Active Progress State */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime-400/20 text-lime-400 border border-lime-400/40 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    Unfolding Repository Story
                  </h3>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-xs">
                    {repoUrl}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-lime-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                {elapsedSeconds}s elapsed
              </span>
            </div>

            {/* Stages List */}
            <div className="flex flex-col gap-3 mb-6">
              {STAGES.map((stage) => {
                const isDone = currentStage > stage.id;
                const isCurrent = currentStage === stage.id;

                return (
                  <div
                    key={stage.id}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-slate-850 bg-slate-900 border-lime-400/40 shadow-[0_0_20px_rgba(163,230,53,0.1)]'
                        : isDone
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                        : 'bg-slate-950/30 border-slate-800/40 text-slate-600'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="inline-block w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 block text-[10px] text-center font-mono">
                          {stage.id}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-xs font-semibold ${
                          isCurrent ? 'text-slate-100' : isDone ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {stage.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cancel Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-500 font-mono">
                Real GitHub & Gemini API processing
              </span>
              <button
                onClick={onCancel}
                className="text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
