'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { ValuePropsSection } from '@/components/landing/ValuePropsSection';
import { AnalysisProgress } from '@/components/story/AnalysisProgress';
import { StoryView } from '@/components/story/StoryView';
import { CyberGridBackground } from '@/components/3d/CyberGridBackground';
import { RepoLesson } from '@/lib/types/lesson';
import { DEMO_REPO_LESSON } from '@/lib/sample-data/demoLesson';
import { getClientApiHeaders } from '@/lib/storage/apiKeyStorage';

function RepoStoryApp() {
  const searchParams = useSearchParams();
  const [appState, setAppState] = useState<'landing' | 'analyzing' | 'story'>('landing');
  const [currentRepoUrl, setCurrentRepoUrl] = useState('');
  const [activeLesson, setActiveLesson] = useState<RepoLesson | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [timingMs, setTimingMs] = useState<number | undefined>(undefined);

  // Auto-analyze if repo query param is provided in URL
  useEffect(() => {
    const initialRepo = searchParams.get('repo');
    if (initialRepo && appState === 'landing') {
      handleAnalyzeRepo(initialRepo);
    }
  }, [searchParams]);

  const handleAnalyzeRepo = async (repoUrl: string) => {
    setCurrentRepoUrl(repoUrl);
    setAppState('analyzing');
    setErrorMsg(null);

    try {
      const startTime = Date.now();
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getClientApiHeaders(),
        },
        body: JSON.stringify({ repoUrl, level: 'beginner' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze repository.');
      }

      const lesson: RepoLesson = data.lesson;
      setActiveLesson(lesson);
      setIsCached(Boolean(data.isCached));
      setTimingMs(Date.now() - startTime);
      setAppState('story');

      // Update URL without full page reload for shareability
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', `/?repo=${encodeURIComponent(repoUrl)}`);
      }
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during analysis.');
    }
  };

  const handleReset = () => {
    setAppState('landing');
    setActiveLesson(null);
    setErrorMsg(null);
    setCurrentRepoUrl('');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#04060A] text-slate-100 font-sans selection:bg-cyan-400 selection:text-slate-950 relative overflow-hidden">
      {/* 3D Cinematic Interactive Background */}
      <CyberGridBackground />

      {/* Top Header */}
      <Header
        repo={activeLesson?.repo}
        isDemoFallback={activeLesson?.metadata?.isDemoFallback}
        isCached={isCached}
        durationMs={timingMs || activeLesson?.metadata?.durationMs}
        onNewStory={handleReset}
      />

      {/* Main Content Area based on appState */}
      {appState === 'landing' && (
        <main className="flex-1 flex flex-col justify-between">
          <HeroSection
            onSubmitUrl={handleAnalyzeRepo}
          />
          <ValuePropsSection />
          {/* Footer */}
          <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400 font-mono">
            RepoStory • Turning GitHub repositories into interactive learning journeys.
          </footer>
        </main>
      )}

      {appState === 'analyzing' && (
        <main className="flex-1 flex flex-col items-center justify-center">
          <AnalysisProgress
            repoUrl={currentRepoUrl}
            error={errorMsg}
            onRetry={() => handleAnalyzeRepo(currentRepoUrl)}
            onCancel={handleReset}
          />
        </main>
      )}

      {appState === 'story' && activeLesson && (
        <StoryView
          lesson={activeLesson}
          onExploreAnother={handleReset}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070A11]" />}>
      <RepoStoryApp />
    </Suspense>
  );
}
