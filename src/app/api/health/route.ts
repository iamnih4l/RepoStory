import { NextResponse } from 'next/server';
import { geminiService } from '@/lib/ai/gemini';
import { memoryCache } from '@/lib/cache/memoryCache';

export async function GET() {
  const cacheMetrics = memoryCache.getMetrics();
  const isGeminiConfigured = geminiService.isConfigured();
  const modelName = geminiService.getModelName();
  const isGitHubTokenConfigured = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim().length > 0);

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'RepoStory Visual Learning Engine',
    gemini: {
      isConfigured: isGeminiConfigured,
      model: modelName,
    },
    github: {
      hasToken: isGitHubTokenConfigured,
      rateLimitTier: isGitHubTokenConfigured ? 'Authenticated (5,000 req/hr)' : 'Public (60 req/hr)',
    },
    cache: cacheMetrics,
  });
}
