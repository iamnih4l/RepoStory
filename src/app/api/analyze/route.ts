import { NextRequest, NextResponse } from 'next/server';
import { parseGitHubUrl } from '@/lib/github/parser';
import { RepoAnalyzer } from '@/lib/github/analyzer';
import { GitHubClient, GitHubApiError } from '@/lib/github/client';
import { geminiService } from '@/lib/ai/gemini';
import { memoryCache } from '@/lib/cache/memoryCache';
import { DEMO_REPO_LESSON } from '@/lib/sample-data/demoLesson';
import { RepoLesson } from '@/lib/types/lesson';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { repoUrl, level = 'beginner' } = body;

    // Check for Bring Your Own Key headers or body fields
    const customGeminiKey = req.headers.get('x-gemini-key') || body.userGeminiKey;
    const customGitHubToken = req.headers.get('x-github-token') || body.userGitHubToken;

    if (!repoUrl || typeof repoUrl !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid GitHub repository URL (e.g., https://github.com/owner/repository).' },
        { status: 400 }
      );
    }

    const parseResult = parseGitHubUrl(repoUrl);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error }, { status: 400 });
    }

    const { owner, repo } = parseResult.data;

    // Check if the user is requesting the demo repo directly
    if (
      (owner.toLowerCase() === 'docquery-ai' && repo.toLowerCase() === 'pdf-rag-agent') ||
      repoUrl.toLowerCase().includes('sample') ||
      repoUrl.toLowerCase().includes('demo')
    ) {
      return NextResponse.json({
        lesson: DEMO_REPO_LESSON,
        isCached: true,
        source: 'sample_preset',
      });
    }

    // Configure analyzer with optional custom token
    const ghClient = customGitHubToken ? new GitHubClient(customGitHubToken) : undefined;
    const analyzer = new RepoAnalyzer(ghClient);

    let analyzedContext;
    try {
      analyzedContext = await analyzer.analyze(owner, repo);
    } catch (err: unknown) {
      if (err instanceof GitHubApiError) {
        return NextResponse.json({ error: err.message }, { status: err.statusCode });
      }
      const message = err instanceof Error ? err.message : 'Failed to analyze repository.';
      return NextResponse.json({ error: message }, { status: 500 });
    }

    // Cache key incorporates owner, repo, commitSha, and schema version
    const cacheKey = `lesson:${owner.toLowerCase()}/${repo.toLowerCase()}@${analyzedContext.meta.commitSha}:v1:${level}`;
    const cachedLesson = memoryCache.get<RepoLesson>(cacheKey);

    if (cachedLesson) {
      return NextResponse.json({
        lesson: {
          ...cachedLesson,
          metadata: {
            ...cachedLesson.metadata,
            cacheHit: true,
          },
        },
        isCached: true,
        source: 'memory_cache',
      });
    }

    // Check if Gemini API is configured (either on server or via user-provided key)
    if (!geminiService.isConfigured(customGeminiKey)) {
      // Graceful fallback to verified sample lesson with friendly notice
      const fallbackLesson: RepoLesson = {
        ...DEMO_REPO_LESSON,
        repo: {
          ...DEMO_REPO_LESSON.repo,
          fullName: analyzedContext.meta.fullName,
          owner: analyzedContext.meta.owner,
          name: analyzedContext.meta.name,
          stars: analyzedContext.meta.stars,
          description: analyzedContext.meta.description,
          language: analyzedContext.meta.language,
          url: analyzedContext.meta.url,
          commitSha: analyzedContext.meta.commitSha,
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          model: 'Sample Interactive Journey',
          cacheHit: false,
          durationMs: 35,
          isDemoFallback: true,
          notice: `No Gemini API key detected. Displaying our verified sample learning journey for ${analyzedContext.meta.fullName}. Click the [API KEY] button in the top bar to add your free Gemini key for live custom analysis!`,
        },
      };

      return NextResponse.json({
        lesson: fallbackLesson,
        isCached: false,
        source: 'demo_fallback',
        notice: fallbackLesson.metadata.notice,
      });
    }

    // Call Gemini to generate the full story using the active key
    try {
      const lesson = await geminiService.generateLesson(analyzedContext, level, customGeminiKey);

      // Save in cache (24hr TTL)
      memoryCache.set(cacheKey, lesson);

      // Also store repo context for lazy concept explorations
      const contextKey = `context:${lesson.id}`;
      memoryCache.set(contextKey, analyzedContext);

      return NextResponse.json({
        lesson,
        isCached: false,
        source: 'gemini_generated',
      });
    } catch (aiErr: unknown) {
      console.error('Gemini generation error:', aiErr);
      return NextResponse.json(
        {
          error: `AI Story generation encountered an issue: ${aiErr instanceof Error ? aiErr.message : 'Unknown error'}. Please verify your API key or explore our sample journey.`,
        },
        { status: 502 }
      );
    }
  } catch (err: unknown) {
    console.error('Analyze route error:', err);
    return NextResponse.json(
      { error: 'An unexpected internal server error occurred while analyzing the repository.' },
      { status: 500 }
    );
  }
}
