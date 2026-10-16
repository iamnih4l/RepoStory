'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Lightbulb, Binary, Sparkles, Check, Layers } from 'lucide-react';
import { Chapter, ExplanationLevel } from '@/lib/types/lesson';
import { InteractiveVectorSphere } from '../3d/InteractiveVectorSphere';

interface ConceptExplainerSceneProps {
  chapter: Chapter;
}

export function ConceptExplainerScene({ chapter }: ConceptExplainerSceneProps) {
  const [level, setLevel] = useState<ExplanationLevel>('beginner');
  const [similarityThreshold, setSimilarityThreshold] = useState(94);

  const levelDescriptions = {
    beginner: {
      headline: 'Concept: Vector Embeddings (Like Aisles in a Supermarket)',
      analogy: 'Sentences with similar meanings get assigned 3D coordinate numbers that sit right next to each other in concept space.',
      mathDetail: 'Projected in 768-D coordinates. Cosine angle θ = 14.2° indicates 94% conceptual match.',
    },
    intermediate: {
      headline: 'Concept: Dense Latent Representations & Dot Product Matching',
      analogy: 'Token embeddings map textual semantics to continuous geometric space where similarity equals proximity.',
      mathDetail: 'cos(θ) = (A · B) / (||A|| ||B||). Scored above the 0.82 production threshold.',
    },
    technical: {
      headline: 'Concept: Unit Hypersphere Mapping & SIMD Acceleration',
      analogy: 'L2-normalized float32 vectors reduce distance measurement to pure hardware-accelerated dot products.',
      mathDetail: 'SIMD-accelerated array operations computed in sub-millisecond memory cache.',
    },
  };

  const currentLevelInfo = levelDescriptions[level];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 select-none overflow-y-auto max-h-[750px]">
      {/* Top Header & Level Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              [3D_CONCEPT // HYPERSPACE_PROJECTION]
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-sans tracking-tight">
            {chapter.title}
          </h2>
        </div>

        {/* Level Switcher Pills */}
        <div className="flex items-center gap-1 bg-slate-950/80 border border-cyan-500/30 p-1 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          {(['beginner', 'intermediate', 'technical'] as ExplanationLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                level === lvl
                  ? 'bg-gradient-to-r from-cyan-400 to-lime-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Center 3D Interactive Model & Cards */}
      <div className="my-auto py-2 max-w-3xl mx-auto w-full flex flex-col gap-4">
        {/* Interactive 3D Vector Space Sphere */}
        <InteractiveVectorSphere similarityScore={similarityThreshold} />

        {/* Level Analogy Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono font-bold text-cyan-300 uppercase">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span>{currentLevelInfo.headline}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
            {currentLevelInfo.analogy}
          </p>
          <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-2.5 text-xs font-mono text-lime-300">
            {currentLevelInfo.mathDetail}
          </div>
        </div>

        {/* Interactive Coordinate Pair */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Vector A */}
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-3.5 shadow-[inset_0_0_15px_rgba(0,240,255,0.04)]">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block mb-1">
              [VECTOR_A] // User Inquiry
            </span>
            <p className="text-xs font-semibold text-slate-200 mb-2">
              &ldquo;What were company revenues in Q3?&rdquo;
            </p>
            <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-cyan-300 truncate">
              [+0.428, -0.612, +0.891, ... (768D)]
            </div>
          </div>

          {/* Vector B */}
          <div className="bg-slate-950/80 border border-lime-500/30 rounded-2xl p-3.5 shadow-[inset_0_0_15px_rgba(57,255,20,0.04)]">
            <span className="text-[10px] font-mono text-lime-400 uppercase font-bold block mb-1">
              [VECTOR_B] // Document Chunk
            </span>
            <p className="text-xs font-semibold text-slate-200 mb-2">
              &ldquo;Total gross turnover increased to $4.2M.&rdquo;
            </p>
            <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-lime-300 truncate">
              [+0.419, -0.598, +0.884, ... (768D)]
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Takeaway */}
      <div className="text-center text-xs text-slate-400 font-mono mt-3">
        Interactive 3D WebGL projection • Drag sphere to inspect high-dimensional coordinate alignment.
      </div>
    </div>
  );
}
