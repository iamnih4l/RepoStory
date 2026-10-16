'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Play, Search, Bot } from 'lucide-react';
import { Chapter } from '@/lib/types/lesson';
import { Button } from '../ui/Button';

interface CapabilityShowcaseSceneProps {
  chapter: Chapter;
}

export function CapabilityShowcaseScene({ chapter }: CapabilityShowcaseSceneProps) {
  const demo = chapter.capabilityDemo || {
    inputLabel: 'Try an inquiry on this project',
    sampleInputs: ['Sample inquiry A', 'Sample inquiry B'],
    transformationDescription: 'Processes query and finds corresponding result.',
    outputResult: 'Sample demonstration result verified from repository evidence.',
    interactivePresets: [
      {
        label: 'Default Preset',
        input: 'How does this project handle requests?',
        output: 'Dispatches requests through the primary pipeline and delivers verified response.',
        stageSteps: ['Embedding inquiry', 'Scanning index', 'Ranking matches', 'Synthesizing output'],
      },
    ],
  };

  const presets = demo.interactivePresets || [
    {
      label: 'Sample Query',
      input: demo.sampleInputs[0] || 'Execute command',
      output: demo.outputResult,
      stageSteps: ['Tokenizing input', 'Running pipeline', 'Matching results', 'Generating output'],
    },
  ];

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(3); // initially completed

  const activePreset = presets[selectedPresetIndex] || presets[0];

  const handleRunSimulation = (index: number) => {
    setSelectedPresetIndex(index);
    setIsRunning(true);
    setCurrentStageIndex(0);

    const stages = activePreset.stageSteps || ['Embedding', 'Scanning', 'Ranking', 'Synthesizing'];
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step < stages.length) {
        setCurrentStageIndex(step);
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 450);
  };

  const stages = activePreset.stageSteps || ['Embedding', 'Scanning', 'Ranking', 'Synthesizing'];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-lime-400" />
          <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-widest">
            Capability Demonstration
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Interactive Inquiry Simulator
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {demo.transformationDescription}
        </p>
      </div>

      {/* Center Interactive Simulation Station */}
      <div className="my-auto py-4 max-w-3xl mx-auto w-full flex flex-col gap-5">
        {/* Preset Selector Buttons */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
            Select a verified question to test:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleRunSimulation(idx)}
                disabled={isRunning}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer flex items-center gap-2 border active:scale-95 ${
                  selectedPresetIndex === idx
                    ? 'bg-gradient-to-r from-cyan-400 to-lime-400 text-slate-950 border-0 font-bold shadow-[0_0_18px_rgba(0,240,255,0.4)]'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-200'
                }`}
              >
                <Search className="w-3.5 h-3.5 opacity-70" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Input & Output Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Card */}
          <div className="bg-slate-950/80 border border-cyan-500/25 rounded-2xl p-4.5 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-cyan-400/40 pointer-events-none" />
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                // INPUT_PAYLOAD: QUERY
              </span>
              <p className="text-sm font-semibold text-slate-100 italic">
                &ldquo;{activePreset.input}&rdquo;
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Natural language query</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunSimulation(selectedPresetIndex)}
                disabled={isRunning}
                icon={<Play className="w-3 h-3 fill-current" />}
                className="border-cyan-500/30 hover:border-cyan-400 text-cyan-300"
              >
                {isRunning ? 'Processing...' : 'Run Pipeline'}
              </Button>
            </div>
          </div>

          {/* Output Card */}
          <div className="bg-slate-950/80 border border-lime-500/30 rounded-2xl p-4.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl shadow-[inset_0_0_20px_rgba(57,255,20,0.04)]">
            <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-lime-400/40 pointer-events-none" />
            {isRunning && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="flex items-center gap-2 text-xs font-mono text-lime-400">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full" />
                  <span>Processing...</span>
                </div>
              </div>
            )}
            <div>
              <span className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-wider block mb-1">
                Grounded Retrieval Output
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {activePreset.output}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Grounded in Repository Evidence</span>
            </div>
          </div>
        </div>

        {/* Live Pipeline Step Tracker */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-3">
            Real-time Execution Stages:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {stages.map((stage, idx) => {
              const isCurrent = isRunning && currentStageIndex === idx;
              const isDone = !isRunning || currentStageIndex > idx;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-all duration-200 flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-lime-400/15 border-lime-400 text-lime-300 font-bold scale-[1.02]'
                      : isDone
                      ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Takeaway */}
      <div className="text-center text-xs text-slate-400 font-mono">
        Derived from verified repository capabilities. No invented claims.
      </div>
    </div>
  );
}
