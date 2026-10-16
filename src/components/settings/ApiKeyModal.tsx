'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  ShieldCheck,
  ExternalLink,
  Eye,
  EyeOff,
  Check,
  Trash2,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { GithubIcon } from '../ui/GithubIcon';
import {
  getStoredGeminiKey,
  setStoredGeminiKey,
  clearStoredGeminiKey,
  getStoredGitHubToken,
  setStoredGitHubToken,
  clearStoredGitHubToken,
} from '@/lib/storage/apiKeyStorage';
import { cyberAudio } from '@/lib/audio/cyberAudio';
import { Button } from '../ui/Button';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysUpdated?: () => void;
}

export function ApiKeyModal({ isOpen, onClose, onKeysUpdated }: ApiKeyModalProps) {
  const [geminiKey, setGeminiKey] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showGemini, setShowGemini] = useState(false);
  const [showGitHub, setShowGitHub] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(getStoredGeminiKey() || '');
      setGithubToken(getStoredGitHubToken() || '');
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    cyberAudio.playSuccess();

    if (geminiKey.trim()) {
      setStoredGeminiKey(geminiKey.trim());
    } else {
      clearStoredGeminiKey();
    }

    if (githubToken.trim()) {
      setStoredGitHubToken(githubToken.trim());
    } else {
      clearStoredGitHubToken();
    }

    setIsSaved(true);
    if (onKeysUpdated) onKeysUpdated();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClear = () => {
    cyberAudio.playSwitch();
    clearStoredGeminiKey();
    clearStoredGitHubToken();
    setGeminiKey('');
    setGithubToken('');
    if (onKeysUpdated) onKeysUpdated();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] relative overflow-hidden text-slate-100"
          >
            {/* Cyber HUD Corner Brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-lime-400/80 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-lime-400/80 pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-lime-400 text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 tracking-tight">
                    API Settings // BYOK Mode
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest block">
                    BRING YOUR OWN KEY
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  onClose();
                }}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Security Guarantee Pill */}
            <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-3 mb-5 flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
                <span className="font-semibold text-cyan-300 block mb-0.5 font-mono">
                  100% Client-Side Privacy
                </span>
                Keys are stored strictly in your browser&apos;s <code className="text-lime-300 font-mono">localStorage</code>. They are passed directly per analysis request and never saved on our server.
              </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Gemini API Key Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                    <span>Google Gemini API Key (Required for custom repos)</span>
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                  >
                    <span>Get free key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showGemini ? 'text' : 'password'}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGemini(!showGemini)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Free tier from Google AI Studio supports 15 requests per minute.
                </span>
              </div>

              {/* GitHub Token Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>GitHub Token (Optional - Increases rate limits)</span>
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                  >
                    <span>Create token</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showGitHub ? 'text' : 'password'}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_... or github_pat_..."
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGitHub(!showGitHub)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showGitHub ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Raises rate limit from 60 to 5,000 requests per hour. No permissions required beyond public repo read.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-mono text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/60 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Keys</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={isSaved ? <Check className="w-4 h-4 text-lime-400" /> : <Zap className="w-4 h-4" />}
                    className="bg-gradient-to-r from-cyan-400 to-lime-400 text-slate-950 font-bold border-0"
                  >
                    {isSaved ? 'Saved!' : 'Save Keys'}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
