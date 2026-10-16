'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Cpu,
  Database,
  Sparkles,
  Layers,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Chapter } from '@/lib/types/lesson';
import { cyberAudio } from '@/lib/audio/cyberAudio';

interface IntroSceneProps {
  chapter: Chapter;
  reducedMotion?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Cpu,
  Database,
  Sparkles,
  Layers,
};

export function IntroScene({ chapter, reducedMotion = false }: IntroSceneProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = chapter.orderedAnimationSteps || [];
  const entities = chapter.visualEntities || [];

  useEffect(() => {
    if (!isPlaying || reducedMotion || steps.length <= 1) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [isPlaying, reducedMotion, steps.length]);

  const currentStepData = steps[activeStep] || {
    title: 'Overview',
    description: chapter.plainEnglishExplanation,
    activeEntityIds: [],
  };

  const handleStepClick = (idx: number) => {
    cyberAudio.playSwitch();
    setActiveStep(idx);
  };

  const handleTogglePlay = () => {
    cyberAudio.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    cyberAudio.playClick();
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 overflow-hidden select-none">
      {/* Background Subtle Grid & Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,240,255,0.08),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Banner: Story Scene Context */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              Interactive Visual Scene // Architecture Map
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
            The Big Picture Workflow
          </h2>
        </div>

        {/* Play/Pause & Replay */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 rounded-xl px-2.5 py-1 shadow-[0_0_12px_rgba(0,240,255,0.1)]">
          <button
            onClick={handleTogglePlay}
            className="p-1 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
          >
            {isPlaying ? (
              <span className="w-3.5 h-3.5 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">❚❚</span>
            ) : (
              <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
            )}
          </button>
          <div className="w-px h-3 bg-slate-800" />
          <button
            onClick={handleReplay}
            className="p-1 text-slate-400 hover:text-lime-400 transition-colors cursor-pointer"
            title="Replay from start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Interactive Visual Pipeline Diagram */}
      <div className="relative z-10 my-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {entities.map((entity, idx) => {
            const Icon = (entity.iconName && ICON_MAP[entity.iconName]) || Sparkles;
            const isHighlighted = currentStepData.activeEntityIds.includes(entity.id);

            return (
              <motion.div
                key={entity.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isHighlighted ? 1.04 : 1,
                }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => handleStepClick(idx % Math.max(steps.length, 1))}
                className={`relative rounded-2xl p-4.5 border transition-all duration-200 cursor-pointer backdrop-blur-xl ${
                  isHighlighted
                    ? 'bg-slate-900/95 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.3)]'
                    : 'bg-slate-950/70 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-slate-900/50'
                }`}
              >
                {/* Active Indicator Pulse Ring */}
                {isHighlighted && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400" />
                  </span>
                )}

                {/* Stage Number Pill */}
                <span className="text-[10px] font-mono font-bold text-cyan-400/80 uppercase tracking-wider block mb-2">
                  Stage {idx + 1} • {entity.role}
                </span>

                {/* Icon & Label */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      isHighlighted
                        ? 'bg-lime-400/20 text-lime-400 border border-lime-400/50 shadow-[0_0_12px_rgba(57,255,20,0.4)]'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 tracking-tight leading-tight">
                    {entity.label}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {entity.description}
                </p>

                {/* Arrow to Next Node on Desktop */}
                {idx < entities.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-slate-950 border border-cyan-500/40 items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Active Step Sequencer & Explanation Pill */}
      <div className="relative z-10 bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4.5 max-w-3xl mx-auto w-full backdrop-blur-xl relative overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-cyan-400/40 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-lime-400/40 pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-lime-400">
              Step {currentStepData.stepNumber || activeStep + 1} of {steps.length || 1}:
            </span>
            <span className="text-sm font-semibold text-slate-100">
              {currentStepData.title}
            </span>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleStepClick(idx)}
                className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === activeStep
                    ? 'w-6 bg-gradient-to-r from-cyan-400 to-lime-400 shadow-[0_0_10px_rgba(0,240,255,0.7)]'
                    : 'w-2 bg-slate-800 hover:bg-slate-600'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {currentStepData.description}
        </p>

        {currentStepData.animatedStateDescription && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-lime-300 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-lime-400" />
            <span>Telemetry: {currentStepData.animatedStateDescription}</span>
          </div>
        )}
      </div>
    </div>
  );
}
