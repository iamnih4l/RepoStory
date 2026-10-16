import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalyzedRepoContext } from '../github/analyzer';
import {
  AskAnswer,
  ConceptDeepDive,
  ExplanationLevel,
  RepoLesson,
} from '../types/lesson';
import {
  AskAnswerSchema,
  ConceptDeepDiveSchema,
  RepoLessonPayloadSchema,
} from './schemas';
import {
  buildAskQuestionPrompt,
  buildConceptDeepDivePrompt,
  buildInitialLessonPrompt,
} from './prompts';

export class GeminiService {
  private apiKey?: string;
  private modelName: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  isConfigured(apiKeyOverride?: string): boolean {
    const key = apiKeyOverride?.trim() || this.apiKey?.trim();
    return Boolean(key && key.length > 0);
  }

  getModelName(): string {
    return this.modelName;
  }

  private cleanJsonResponse(raw: string): string {
    let text = raw.trim();
    // Remove ```json or ``` code fences if present
    if (text.startsWith('```json')) {
      text = text.substring(7);
    } else if (text.startsWith('```')) {
      text = text.substring(3);
    }
    if (text.endsWith('```')) {
      text = text.substring(0, text.length - 3);
    }
    return text.trim();
  }

  private async callGemini(prompt: string, apiKeyOverride?: string): Promise<string> {
    const activeKey = apiKeyOverride?.trim() || this.apiKey;
    if (!activeKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment or request header.');
    }

    // Try @google/genai first, fallback to @google/generative-ai
    try {
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch {
      // Fallback to @google/generative-ai
      const genAI = new GoogleGenerativeAI(activeKey);
      const model = genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    }

    throw new Error('No text returned from Gemini API.');
  }

  async generateLesson(
    ctx: AnalyzedRepoContext,
    level: ExplanationLevel = 'beginner',
    apiKeyOverride?: string
  ): Promise<RepoLesson> {
    const startTime = Date.now();
    const prompt = buildInitialLessonPrompt(ctx, level);
    const rawText = await this.callGemini(prompt, apiKeyOverride);
    const cleanedJson = this.cleanJsonResponse(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanedJson);
    } catch {
      throw new Error('Failed to parse Gemini output as JSON.');
    }

    const validatedPayload = RepoLessonPayloadSchema.parse(parsed);

    const lesson: RepoLesson = {
      id: `lesson-${ctx.meta.owner}-${ctx.meta.name}-${ctx.meta.commitSha}`,
      repo: ctx.meta,
      summary: validatedPayload.summary,
      chapters: validatedPayload.chapters,
      concepts: validatedPayload.concepts,
      gettingStarted: validatedPayload.gettingStarted,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: this.modelName,
        cacheHit: false,
        durationMs: Date.now() - startTime,
        tokensEstimated: Math.round(prompt.length / 4 + rawText.length / 4),
        isDemoFallback: false,
      },
    };

    return lesson;
  }

  async generateConceptDeepDive(
    conceptId: string,
    conceptName: string,
    level: ExplanationLevel,
    lesson: RepoLesson,
    repoContext: AnalyzedRepoContext,
    apiKeyOverride?: string
  ): Promise<ConceptDeepDive> {
    const prompt = buildConceptDeepDivePrompt(conceptId, conceptName, level, lesson, repoContext);
    const rawText = await this.callGemini(prompt, apiKeyOverride);
    const cleaned = this.cleanJsonResponse(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Failed to parse concept deep dive JSON for ${conceptName}.`);
    }

    return ConceptDeepDiveSchema.parse(parsed);
  }

  async answerQuestion(
    question: string,
    lesson: RepoLesson,
    repoContext: AnalyzedRepoContext,
    apiKeyOverride?: string
  ): Promise<AskAnswer> {
    const prompt = buildAskQuestionPrompt(question, lesson, repoContext);
    const rawText = await this.callGemini(prompt, apiKeyOverride);
    const cleaned = this.cleanJsonResponse(rawText);

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error('Failed to parse Q&A response JSON.');
    }

    return AskAnswerSchema.parse(parsed);
  }
}

export const geminiService = new GeminiService();
