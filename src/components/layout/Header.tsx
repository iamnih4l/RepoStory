'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Star,
  GitFork,
  ArrowLeft,
  Zap,
  Activity,
  Volume2,
  VolumeX,
  Key,
} from 'lucide-react';
import { RepoMetadata } from '@/lib/types/lesson';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GithubIcon } from '../ui/GithubIcon';
import { cyberAudio } from '@/lib/audio/cyberAudio';
import { ApiKeyModal } from '../settings/ApiKeyModal';
import { getStoredGeminiKey } from '@/lib/storage/apiKeyStorage';

interface HeaderProps {
  repo?: RepoMetadata;
  isDemoFallback?: boolean;
  isCached?: boolean;
  durationMs?: number;
  onNewStory?: () => void;
}

export function Header({
  repo,
  isDemoFallback = false,
  isCached = false,
  durationMs,
  onNewStory,
}: HeaderProps) {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);

  const checkKeyStatus = () => {
    setHasCustomKey(Boolean(getStoredGeminiKey()));
  };

  useEffect(() => {
    setAudioEnabled(cyberAudio.isEnabled());
    checkKeyStatus();
  }, []);

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    cyberAudio.setEnabled(next);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/75 backdrop-blur-2xl shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                cyberAudio.playClick();
                if (onNewStory) onNewStory();
              }}
              className="flex items-center gap-3 group text-left cursor-pointer transition-transform active:scale-95"
              title="RepoStory Home"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-lime-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_28px_rgba(0,240,255,0.7)] transition-all">
                <BookOpen className="w-5 h-5 fill-slate-950/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-100 tracking-tight text-base font-sans">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-slate-100 to-lime-300">
                    RepoStory
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <span className="text-[9px] text-cyan-400/80 font-mono tracking-widest uppercase block">
                  CYBER-STORY // ENGINE
                </span>
              </div>
            </button>
          </div>

          {/* Center / Repo Information if in story mode */}
          {repo && (
            <div className="hidden md:flex items-center gap-3 bg-slate-900/80 border border-cyan-500/30 px-4 py-1.5 rounded-full text-xs shadow-[inset_0_0_12px_rgba(0,240,255,0.06)]">
              <span className="text-cyan-400 font-mono text-[11px]">[TARGET]:</span>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-100 font-semibold hover:text-cyan-300 flex items-center gap-1.5 transition-colors font-mono"
              >
                <span>{repo.fullName}</span>
                <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <div className="h-3 w-px bg-slate-800" />
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                SHA: {repo.commitSha}
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-mono text-xs">
                <Star className="w-3 h-3 fill-amber-300/30" />
                {repo.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-mono text-xs">
                <GitFork className="w-3 h-3" />
                {repo.forks.toLocaleString()}
              </span>
              <Badge variant="blue" size="sm">
                {repo.language}
              </Badge>
            </div>
          )}

          {/* Right side: Status, BYOK Key, SFX and Actions */}
          <div className="flex items-center gap-2.5">
            {/* BYOK Settings Trigger */}
            <button
              onClick={() => {
                cyberAudio.playClick();
                setIsKeyModalOpen(true);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                hasCustomKey
                  ? 'bg-lime-950/60 border-lime-400/60 text-lime-300 shadow-[0_0_12px_rgba(57,255,20,0.3)]'
                  : 'bg-slate-900/80 border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:text-white'
              }`}
              title="API Settings (Bring Your Own Key)"
            >
              <Key className="w-3 h-3" />
              <span>{hasCustomKey ? 'API: ACTIVE' : 'API KEY'}</span>
            </button>

            {/* Cyber Audio SFX Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all cursor-pointer ${
                audioEnabled
                  ? 'bg-cyan-950/60 border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
              title={audioEnabled ? 'Mute Cyber UI SFX' : 'Enable Cyber UI SFX'}
            >
              {audioEnabled ? (
                <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" />
              ) : (
                <VolumeX className="w-3 h-3" />
              )}
              <span>SFX: {audioEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Cyber Telemetry Status */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="text-cyan-300 font-medium">SYS_OK</span>
            </div>

            {isDemoFallback ? (
              <Badge variant="amber" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                Sample Journey
              </Badge>
            ) : (
              <Badge variant="lime" size="sm" icon={<Zap className="w-3 h-3" />}>
                {isCached ? '⚡ Cached Lesson' : `✨ ${durationMs ? (durationMs / 1000).toFixed(1) : 1.2}s Synthesis`}
              </Badge>
            )}

            {repo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  cyberAudio.playClick();
                  if (onNewStory) onNewStory();
                }}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
                className="hidden sm:inline-flex border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 hover:text-white"
              >
                Analyze Another Repo
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* BYOK Settings Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeysUpdated={checkKeyStatus}
      />
    </>
  );
}
