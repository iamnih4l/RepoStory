'use client';

import React, { useState } from 'react';
import { ArrowRight, Terminal, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { GithubIcon } from '../ui/GithubIcon';
import { cyberAudio } from '@/lib/audio/cyberAudio';

interface HeroSectionProps {
  onSubmitUrl: (url: string) => void;
  isLoading?: boolean;
}

const PRESET_REPOS = [
  { label: 'DocQuery AI (Featured RAG)', url: 'https://github.com/docquery-ai/pdf-rag-agent', isFeatured: true, tag: 'RAG_AGENT' },
  { label: 'LangChain', url: 'https://github.com/langchain-ai/langchain', tag: 'AI_ORCHESTRATION' },
  { label: 'React', url: 'https://github.com/facebook/react', tag: 'UI_FRAMEWORK' },
  { label: 'llama.cpp', url: 'https://github.com/ggerganov/llama.cpp', tag: 'LLM_INFERENCE' },
  { label: 'FastAPI', url: 'https://github.com/fastapi/fastapi', tag: 'PYTHON_ASYNC' },
];

export function HeroSection({ onSubmitUrl, isLoading = false }: HeroSectionProps) {
  const [inputUrl, setInputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setErrorMsg('Please paste a public GitHub repository link.');
      return;
    }
    cyberAudio.playClick();
    setErrorMsg(null);
    onSubmitUrl(trimmed);
  };

  const handleSelectPreset = (url: string) => {
    cyberAudio.playClick();
    setInputUrl(url);
    setErrorMsg(null);
    onSubmitUrl(url);
  };

  return (
    <section className="relative pt-10 pb-14 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center text-center select-none z-10">
      {/* Eyebrow Pill */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)] backdrop-blur-md">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold tracking-wide">SYSTEM: REPOSTORY // VISUAL CODE ENGINE</span>
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.1] max-w-3xl mb-4 font-sans">
        GitHub projects, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-lime-300 drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]">
          finally understandable.
        </span>
      </h1>

      {/* Supporting Text */}
      <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8 font-sans">
        Turn unfamiliar repositories into interactive visual stories. Discover what they do,
        explore the concepts behind them, and learn how to use them.
      </p>

      {/* Cyber Glassmorphic URL Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl relative mb-3 flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-slate-950/70 border border-cyan-500/40 shadow-[0_12px_45px_rgba(0,0,0,0.7),inset_0_0_20px_rgba(0,240,255,0.06)] focus-within:border-cyan-400 focus-within:shadow-[0_0_35px_rgba(0,240,255,0.35)] transition-all backdrop-blur-2xl"
      >
        {/* Corner HUD markers */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
        <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

        <div className="flex items-center gap-2.5 px-3 w-full sm:w-auto flex-1">
          <span className="text-xs font-mono text-cyan-400 select-none font-bold">$</span>
          <GithubIcon className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="Paste public GitHub URL, e.g. github.com/facebook/react"
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono py-2"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="right"
          className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-cyan-400 to-lime-400 hover:from-cyan-300 hover:to-lime-300 text-slate-950 font-bold shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] border-0"
        >
          Initialize Story
        </Button>
      </form>

      {errorMsg && (
        <p className="text-xs text-red-400 font-mono mb-4 bg-red-950/40 border border-red-900/60 px-3 py-1.5 rounded-xl">
          {errorMsg}
        </p>
      )}

      {/* Telemetry Security Note */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-lime-400" />
        <span>Public repositories supported • Zero local setup • 100% sandboxed analysis</span>
      </div>

      {/* Cyber Presets Bar */}
      <div className="flex flex-col items-center gap-2.5 w-full max-w-2xl">
        <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-widest font-semibold">
          // INITIALIZE VERIFIED PRESET CURRICULUM
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESET_REPOS.map((preset) => (
            <button
              key={preset.url}
              onClick={() => handleSelectPreset(preset.url)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-150 cursor-pointer flex items-center gap-1.5 border active:scale-95 ${
                preset.isFeatured
                  ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/50 hover:bg-cyan-500/25 font-bold shadow-[0_0_16px_rgba(0,240,255,0.25)]'
                  : 'bg-slate-900/70 text-slate-300 border-slate-800 hover:border-cyan-500/40 hover:text-cyan-200'
              }`}
            >
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
