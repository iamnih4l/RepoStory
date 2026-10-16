'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Layers,
  Cpu,
  Search,
  CheckCircle2,
  ArrowRight,
  Database,
  Network,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Chapter } from '@/lib/types/lesson';
import { CyberDataPipeline3D } from '../3d/CyberDataPipeline3D';
import { cyberAudio } from '@/lib/audio/cyberAudio';

interface ProcessFlowSceneProps {
  chapter: Chapter;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  Layers,
  Cpu,
  Search,
  CheckCircle2,
  Database,
  Network,
};

export function ProcessFlowScene({ chapter }: ProcessFlowSceneProps) {
  const entities = chapter.visualEntities || [];
  const steps = chapter.orderedAnimationSteps || [];
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const activeEntity = entities[activeStageIndex] || entities[0];
  const activeStep = steps[activeStageIndex];

  const handleStageSelect = (idx: number) => {
    setActiveStageIndex(idx);
    cyberAudio.playSwitch();
  };

  const handleReset = () => {
    setActiveStageIndex(0);
    cyberAudio.playClick();
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 select-none overflow-y-auto max-h-[780px]">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest block">
              Architectural Process Flow // Stage {activeStageIndex + 1} of {entities.length}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
            Stage-by-Stage Data Journey
          </h2>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-400 hover:text-white hover:border-cyan-400 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.15)]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Pipeline</span>
        </button>
      </div>

      {/* Center 3D Pipeline & Interactive Stages */}
      <div className="my-auto py-3 max-w-4xl mx-auto w-full flex flex-col gap-4">
        {/* 3D WebGL Conduit */}
        <CyberDataPipeline3D
          stagesCount={entities.length || 4}
          activeStageIndex={activeStageIndex}
        />

        {/* Stages Nav / Spine */}
        <div className="relative flex items-center justify-between px-4 pt-1">
          {/* Background Connecting Line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-800/90 rounded-full z-0" />
          {/* Active Progress Fill */}
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 to-lime-400 rounded-full z-0 transition-all duration-300 shadow-[0_0_12px_rgba(57,255,20,0.6)]"
            style={{
              width: `${(activeStageIndex / Math.max(entities.length - 1, 1)) * 88}%`,
            }}
          />

          {entities.map((node, idx) => {
            const Icon = (node.iconName && ICON_MAP[node.iconName]) || Layers;
            const isSelected = activeStageIndex === idx;
            const isPast = idx < activeStageIndex;

            return (
              <div key={node.id} className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => handleStageSelect(idx)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-lime-400 text-slate-950 border-lime-300 scale-110 shadow-[0_0_22px_rgba(57,255,20,0.6)]'
                      : isPast
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
                      : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
                <span
                  className={`text-[10px] font-mono mt-1.5 text-center max-w-[80px] truncate ${
                    isSelected ? 'text-lime-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  {node.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detailed Stage Inspection Card */}
        {activeEntity && (
          <motion.div
            key={activeEntity.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5 max-w-2xl mx-auto shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden"
          >
            {/* Corner cyber brackets */}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-cyan-400/50 pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-lime-400/50 pointer-events-none" />

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider">
                Stage {activeStageIndex + 1} of {entities.length}: {activeEntity.role.toUpperCase()}
              </span>
              <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                INSPECTABLE NODE
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100 mb-1">
              {activeEntity.label}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeEntity.description}
            </p>

            {/* Step Action context if available */}
            {activeStep && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200 block mb-0.5">
                    {activeStep.title}
                  </span>
                  <p className="text-slate-400 leading-normal">
                    {activeStep.description}
                  </p>
                </div>
              </div>
            )}

            {/* Stage Controls */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => handleStageSelect(Math.max(0, activeStageIndex - 1))}
                disabled={activeStageIndex === 0}
                className="text-xs font-mono text-slate-400 hover:text-cyan-300 disabled:opacity-30 cursor-pointer"
              >
                ← Previous Stage
              </button>
              <button
                onClick={() =>
                  handleStageSelect(Math.min(entities.length - 1, activeStageIndex + 1))
                }
                disabled={activeStageIndex === entities.length - 1}
                className="text-xs font-mono text-lime-400 hover:text-lime-300 font-semibold disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Takeaway */}
      <div className="text-center text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        <span>Click stages or drag the 3D conduit to observe pipeline transformation flow.</span>
      </div>
    </div>
  );
}
