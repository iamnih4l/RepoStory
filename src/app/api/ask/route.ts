import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/ai/gemini';
import { memoryCache } from '@/lib/cache/memoryCache';
import { AskAnswer, RepoLesson } from '@/lib/types/lesson';
import { AnalyzedRepoContext } from '@/lib/github/analyzer';
import { DEMO_REPO_LESSON } from '@/lib/sample-data/demoLesson';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { repoLessonId, question } = body as { repoLessonId: string; question: string };
    const customGeminiKey = req.headers.get('x-gemini-key') || (body as { userGeminiKey?: string }).userGeminiKey;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide a question.' }, { status: 400 });
    }

    const trimmedQuestion = question.trim().slice(0, 300);
    const normalizedKey = trimmedQuestion.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const cacheKey = `ask:${repoLessonId || 'default'}:${normalizedKey}`;

    const cached = memoryCache.get<AskAnswer>(cacheKey);
    if (cached) {
      return NextResponse.json({ answer: cached, isCached: true });
    }

    const contextKey = `context:${repoLessonId}`;
    const repoContext = memoryCache.get<AnalyzedRepoContext>(contextKey);
    const lesson: RepoLesson = memoryCache.get<RepoLesson>(`lesson:${repoLessonId}`) || DEMO_REPO_LESSON;

    if (geminiService.isConfigured(customGeminiKey) && repoContext) {
      const answer = await geminiService.answerQuestion(trimmedQuestion, lesson, repoContext, customGeminiKey);
      memoryCache.set(cacheKey, answer);
      return NextResponse.json({ answer, isCached: false });
    }

    // Grounded fallback answer using repository summary
    const fallbackAnswer: AskAnswer = {
      question: trimmedQuestion,
      answer: `Based on the repository documentation for ${lesson.repo.fullName}, ${lesson.summary.plainEnglishPurpose} The project utilizes ${lesson.repo.language} and coordinates the workflow via ${lesson.chapters[0]?.sourceReferences[0]?.filePath || 'core source files'}.`,
      groundedInFiles: lesson.chapters.flatMap((c) => c.sourceReferences.map((s) => s.filePath)).slice(0, 3),
      simplifiedTakeaway: `This repository focuses on ${lesson.summary.primaryProblemSolved.toLowerCase()}`,
      relatedConcepts: lesson.concepts.slice(0, 3).map((c) => c.name),
    };

    memoryCache.set(cacheKey, fallbackAnswer);
    return NextResponse.json({ answer: fallbackAnswer, isCached: false });
  } catch (err: unknown) {
    console.error('Ask route error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to answer question.' },
      { status: 500 }
    );
  }
}
