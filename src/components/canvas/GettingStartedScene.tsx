'use client';

import React, { useState } from 'react';
import { Rocket, Check, Copy, AlertCircle, CheckCircle2, Key } from 'lucide-react';
import { Chapter, GettingStartedGuide } from '@/lib/types/lesson';
import { Badge } from '../ui/Badge';
import { cyberAudio } from '@/lib/audio/cyberAudio';

interface GettingStartedSceneProps {
  chapter: Chapter;
  gettingStarted: GettingStartedGuide;
}

export function GettingStartedScene({ chapter, gettingStarted }: GettingStartedSceneProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCommand = async (cmd: string, index: number) => {
    try {
      await navigator.clipboard.writeText(cmd);
      cyberAudio.playClick();
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8 select-none overflow-y-auto max-h-[750px]">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Rocket className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            Hands-on Setup Guide // Local Deployment
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-100">
          Run This Repository in 3 Steps
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Follow verified installation commands extracted directly from documentation and package manifests.
        </p>
      </div>

      {/* Center Setup Grid */}
      <div className="my-auto py-4 max-w-3xl mx-auto w-full flex flex-col gap-4">
        {/* Step-by-Step Shell Commands */}
        <div className="flex flex-col gap-2.5">
          {gettingStarted.installCommands.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-cyan-500/25 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-cyan-500/45 transition-colors backdrop-blur-xl relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-cyan-400/40 pointer-events-none" />
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-lime-400/20 text-lime-400 border border-lime-400/40 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-slate-200">
                      {item.description}
                    </span>
                    {item.isVerified ? (
                      <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                        Verified in repo
                      </Badge>
                    ) : (
                      <Badge variant="amber" size="sm" icon={<AlertCircle className="w-3 h-3" />}>
                        Community standard
                      </Badge>
                    )}
                  </div>
                  <div className="font-mono text-xs text-lime-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80 inline-block">
                    $ {item.command}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopyCommand(item.command, idx)}
                className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Copy command"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-lime-400" />
                    <span className="text-lime-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Prerequisites & Required Environment Keys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Prerequisites */}
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-xl">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
              Prerequisites
            </span>
            <ul className="flex flex-col gap-2 text-xs">
              {gettingStarted.prerequisites.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">{p.item}</span>
                    {p.note && <span className="text-slate-400 block text-[11px]">{p.note}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Environment Variables */}
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-4 backdrop-blur-xl">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Configuration (.env)</span>
            </span>
            {gettingStarted.envVariables && gettingStarted.envVariables.length > 0 ? (
              <ul className="flex flex-col gap-2 text-xs">
                {gettingStarted.envVariables.map((ev, idx) => (
                  <li key={idx} className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between font-mono text-[11px] text-lime-400">
                      <span>{ev.key}</span>
                      {ev.isRequired && <span className="text-[10px] text-amber-400 font-mono">Required</span>}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{ev.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">No special environment keys required for local execution.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Takeaway */}
      <div className="text-center text-xs text-slate-400 font-mono">
        All commands derived directly from project manifests and root configs.
      </div>
    </div>
  );
}
