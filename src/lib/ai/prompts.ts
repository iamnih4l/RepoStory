import { AnalyzedRepoContext } from '../github/analyzer';
import { ExplanationLevel, RepoLesson } from '../types/lesson';

export function buildInitialLessonPrompt(ctx: AnalyzedRepoContext, level: ExplanationLevel = 'beginner'): string {
  const fileSummaries = ctx.selectedFiles
    .map(
      (f) =>
        `FILE: ${f.path} (${f.charCount} chars) ${f.isManifest ? '[MANIFEST]' : ''} ${f.isEntryPoint ? '[ENTRY_POINT]' : ''}\n` +
        '```\n' +
        f.content +
        '\n```'
    )
    .join('\n\n');

  return `You are RepoStory's Educational AI Architect. Your mission is to transform this public GitHub repository into an engaging, animated, picture-book style learning journey for curious learners and developers.

REPOSITORY INFORMATION:
- Full Name: ${ctx.meta.fullName}
- Description: ${ctx.meta.description}
- Language: ${ctx.meta.language}
- Stars: ${ctx.meta.stars} | Forks: ${ctx.meta.forks}
- Ecosystem: ${ctx.detectedEcosystem}
- Default Branch: ${ctx.meta.defaultBranch}
- Commit SHA: ${ctx.meta.commitSha}

README EXCERPT:
${ctx.readmeExcerpt}

KEY FILE OVERVIEW:
${ctx.treeOverview.slice(0, 20).join(', ')}

REAL SOURCE FILE EXCERPTS (Use ONLY these real paths and lines):
${fileSummaries}

TASK REQUIREMENTS:
1. Ground every claim in the provided repository files. NEVER hallucinate files, functions, or dependencies that are not present.
2. Structure a personalized 5-to-7 chapter learning journey:
   - Chapter 1: "Meet the project" (sceneType: "intro") - Plain English purpose, animated pipeline illustration.
   - Chapter 2: "See what it can do" (sceneType: "capability-showcase") - Real capabilities with sample inputs and outputs.
   - Chapter 3: "Under the hood" (sceneType: "process-flow") - Step-by-step pipeline of how data flows through the project.
   - Chapter 4: Core mechanism or concept (sceneType: "concept-explainer") - Visual explanation of the central technical concept.
   - Chapter 5: Real code spotlight (sceneType: "code-spotlight") - Highlight a verified real code snippet from the provided files with exact line numbers.
   - Chapter 6: Getting started (sceneType: "getting-started") - Plain English setup, verified commands from package.json/README.
   - Chapter 7: Summary & Celebration (sceneType: "summary") - Key takeaways and milestone recap.
3. Keep text concise, friendly, and visual (like an interactive picture book). Avoid lengthy academic essays.
4. Extract 3-5 core concepts (e.g. "RAG", "Embeddings", "Virtual DOM", "Middleware", etc.).
5. Mark all prerequisites and installation commands with isVerified: true ONLY if verified in the provided files.

OUTPUT FORMAT:
Respond with ONLY a raw valid JSON object matching this structure (no markdown fences, no surrounding commentary):
{
  "summary": {
    "tagline": "A punchy 1-sentence hook",
    "plainEnglishPurpose": "2-3 clear sentences explaining what it does without heavy jargon",
    "primaryProblemSolved": "The pain point or problem this repo solves",
    "targetAudience": "Who this project is built for"
  },
  "chapters": [
    {
      "id": "chapter-1",
      "chapterNumber": 1,
      "title": "Chapter Title",
      "learningObjective": "One sentence goal",
      "plainEnglishExplanation": "Engaging, conversational explanation in 2-3 sentences",
      "sceneType": "intro" | "capability-showcase" | "process-flow" | "concept-explainer" | "code-spotlight" | "getting-started" | "summary",
      "visualEntities": [
        {
          "id": "ent-1",
          "label": "Short label",
          "role": "input" | "process" | "store" | "output" | "service",
          "description": "What this piece does",
          "iconName": "FileText" | "Cpu" | "Database" | "Sparkles" | "Layers" | "Code" | "Terminal",
          "colorTheme": "blue" | "violet" | "emerald" | "lime" | "cyan"
        }
      ],
      "relationships": [
        { "from": "ent-1", "to": "ent-2", "label": "Sends data", "type": "data" | "call" | "transform" }
      ],
      "orderedAnimationSteps": [
        {
          "stepNumber": 1,
          "title": "Step title",
          "description": "What happens in this step",
          "activeEntityIds": ["ent-1"],
          "animatedStateDescription": "Visual state transition"
        }
      ],
      "relevantConcepts": ["concept-id-1"],
      "sourceReferences": [
        {
          "filePath": "src/index.ts",
          "startLine": 1,
          "endLine": 20,
          "description": "Explanation of relevance"
        }
      ],
      "codeSnippet": {
        "filePath": "src/index.ts",
        "language": "typescript",
        "functionName": "mainFunction",
        "code": "real snippet",
        "highlightedLines": [2, 3],
        "explanation": "Why this code matters"
      },
      "capabilityDemo": {
        "inputLabel": "Example input",
        "sampleInputs": ["Input A", "Input B"],
        "transformationDescription": "What the system does to the input",
        "outputResult": "The generated result",
        "interactivePresets": [
          {
            "label": "Preset 1",
            "input": "Sample",
            "output": "Result",
            "stageSteps": ["Step 1", "Step 2"]
          }
        ]
      },
      "takeawayMessage": "A memorable 1-sentence takeaway"
    }
  ],
  "concepts": [
    {
      "id": "concept-id",
      "name": "Concept Name",
      "oneLineHook": "A simple 1-line analogy or hook",
      "category": "Core Architecture"
    }
  ],
  "gettingStarted": {
    "prerequisites": [
      { "item": "e.g. Node.js 18+", "isVerified": true, "note": "Required runtime" }
    ],
    "installCommands": [
      { "command": "npm install", "description": "Install dependencies", "isVerified": true }
    ],
    "envVariables": [
      { "key": "API_KEY", "description": "Required service key", "example": "sk-...", "isRequired": true }
    ],
    "runCommand": { "command": "npm run dev", "description": "Start the application", "isVerified": true },
    "firstUsageExample": { "language": "bash", "code": "node index.js", "description": "First run" },
    "limitations": ["Any known limits noted in the repo"]
  }
}`;
}

export function buildConceptDeepDivePrompt(
  conceptId: string,
  conceptName: string,
  level: ExplanationLevel,
  lesson: RepoLesson,
  repoContext: AnalyzedRepoContext
): string {
  return `You are RepoStory's Concept Explainer. The user clicked on the concept "${conceptName}" from the repository "${lesson.repo.fullName}".
Target Explanation Level: ${level.toUpperCase()}
- Beginner: Use everyday real-world analogies (like cooking, libraries, or postal mail). Explain like I am 10. Avoid jargon.
- Intermediate: Explain the computational mechanism, data structures, and how components interact.
- Technical: Dive into mathematical principles, time/space complexity, exact APIs, and source code patterns.

REPOSITORY CONTEXT:
- Project: ${lesson.repo.fullName} (${lesson.repo.description})
- Files available: ${repoContext.selectedFiles.map((f) => f.path).join(', ')}

Explain how "${conceptName}" is specifically applied in this repository.

OUTPUT FORMAT:
Respond with ONLY a raw valid JSON object (no markdown formatting, no code fences):
{
  "conceptId": "${conceptId}",
  "name": "${conceptName}",
  "level": "${level}",
  "analogy": "A memorable 1-2 sentence real-world analogy",
  "coreMechanism": "2-3 clear sentences explaining how it works mathematically or conceptually",
  "inThisRepository": "2-3 sentences explaining exactly where and why this repository uses this concept",
  "visualSteps": [
    {
      "title": "Step 1 Title",
      "explanation": "What happens in step 1",
      "visualElement": "Description of the visual state"
    },
    {
      "title": "Step 2 Title",
      "explanation": "What happens in step 2",
      "visualElement": "Description of the visual state"
    },
    {
      "title": "Step 3 Title",
      "explanation": "What happens in step 3",
      "visualElement": "Description of the visual state"
    }
  ],
  "codeReference": {
    "filePath": "path/to/relevant/file.ext",
    "code": "relevant 5-10 line snippet from the repo if applicable",
    "explanation": "What these lines do"
  }
}`;
}

export function buildAskQuestionPrompt(
  question: string,
  lesson: RepoLesson,
  repoContext: AnalyzedRepoContext
): string {
  const snippets = repoContext.selectedFiles
    .slice(0, 5)
    .map((f) => `FILE: ${f.path}\n${f.content.slice(0, 1500)}`)
    .join('\n\n');

  return `You are RepoStory's Grounded Q&A Assistant. A user is asking a question about the GitHub repository "${lesson.repo.fullName}".

USER QUESTION: "${question}"

REPOSITORY SUMMARY:
${lesson.summary.plainEnglishPurpose}

GROUNDING SOURCE SNIPPETS:
${snippets}

INSTRUCTIONS:
1. Answer concisely in plain English (2-4 paragraphs max).
2. Ground your answer in the provided files. If the repository does not contain evidence to answer the question, politely explain what can and cannot be confirmed.
3. List the real file paths that support your answer.
4. Provide a 1-sentence simplified takeaway.

OUTPUT FORMAT:
Respond with ONLY a raw valid JSON object (no markdown formatting, no code fences):
{
  "question": "${question.replace(/"/g, '\\"')}",
  "answer": "Plain-English explanation grounded in repository evidence.",
  "groundedInFiles": ["src/example.ts"],
  "simplifiedTakeaway": "1 sentence punchy takeaway.",
  "relatedConcepts": ["Concept 1", "Concept 2"]
}`;
}
