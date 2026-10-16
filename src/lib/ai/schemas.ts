import { z } from 'zod';

export const VisualEntitySchema = z.object({
  id: z.string(),
  label: z.string(),
  role: z.enum(['input', 'process', 'store', 'output', 'service']).default('process'),
  description: z.string(),
  iconName: z.string().optional(),
  status: z.string().optional(),
  colorTheme: z.string().optional(),
});

export const EntityRelationshipSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
  type: z.enum(['data', 'call', 'transform']).default('data'),
});

export const AnimationStepSchema = z.object({
  stepNumber: z.number(),
  title: z.string(),
  description: z.string(),
  activeEntityIds: z.array(z.string()).default([]),
  animatedStateDescription: z.string().optional(),
});

export const SourceReferenceSchema = z.object({
  filePath: z.string(),
  startLine: z.number().optional(),
  endLine: z.number().optional(),
  description: z.string(),
  snippet: z.string().optional(),
});

export const CodeSnippetSchema = z.object({
  filePath: z.string(),
  language: z.string().default('javascript'),
  code: z.string(),
  highlightedLines: z.array(z.number()).default([]),
  explanation: z.string(),
  functionName: z.string().optional(),
});

export const CapabilityDemoSchema = z.object({
  inputLabel: z.string(),
  sampleInputs: z.array(z.string()).default([]),
  transformationDescription: z.string(),
  outputResult: z.string(),
  interactivePresets: z.array(
    z.object({
      label: z.string(),
      input: z.string(),
      output: z.string(),
      stageSteps: z.array(z.string()).default([]),
    })
  ).optional(),
});

export const ChapterSchema = z.object({
  id: z.string(),
  chapterNumber: z.number(),
  title: z.string(),
  learningObjective: z.string(),
  plainEnglishExplanation: z.string(),
  sceneType: z.enum([
    'intro',
    'capability-showcase',
    'process-flow',
    'concept-explainer',
    'code-spotlight',
    'getting-started',
    'summary',
  ]),
  visualEntities: z.array(VisualEntitySchema).default([]),
  relationships: z.array(EntityRelationshipSchema).default([]),
  orderedAnimationSteps: z.array(AnimationStepSchema).default([]),
  relevantConcepts: z.array(z.string()).default([]),
  sourceReferences: z.array(SourceReferenceSchema).default([]),
  codeSnippet: CodeSnippetSchema.optional(),
  capabilityDemo: CapabilityDemoSchema.optional(),
  takeawayMessage: z.string(),
});

export const ConceptSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  oneLineHook: z.string(),
  category: z.string().default('Core Concept'),
  relatedChapterIds: z.array(z.string()).optional(),
});

export const GettingStartedGuideSchema = z.object({
  prerequisites: z.array(
    z.object({
      item: z.string(),
      isVerified: z.boolean().default(false),
      note: z.string().optional(),
    })
  ).default([]),
  installCommands: z.array(
    z.object({
      command: z.string(),
      description: z.string(),
      isVerified: z.boolean().default(false),
    })
  ).default([]),
  envVariables: z.array(
    z.object({
      key: z.string(),
      description: z.string(),
      example: z.string().optional(),
      isRequired: z.boolean().default(false),
    })
  ).default([]),
  runCommand: z.object({
    command: z.string(),
    description: z.string(),
    isVerified: z.boolean().default(false),
  }),
  firstUsageExample: z.object({
    code: z.string(),
    language: z.string().default('bash'),
    description: z.string(),
  }),
  limitations: z.array(z.string()).default([]),
  liveDemoUrl: z.string().optional(),
});

export const RepoLessonPayloadSchema = z.object({
  summary: z.object({
    tagline: z.string(),
    plainEnglishPurpose: z.string(),
    primaryProblemSolved: z.string(),
    targetAudience: z.string(),
  }),
  chapters: z.array(ChapterSchema).min(3),
  concepts: z.array(ConceptSummarySchema).min(2),
  gettingStarted: GettingStartedGuideSchema,
});

export const ConceptDeepDiveSchema = z.object({
  conceptId: z.string(),
  name: z.string(),
  level: z.enum(['beginner', 'intermediate', 'technical']),
  analogy: z.string(),
  coreMechanism: z.string(),
  inThisRepository: z.string(),
  visualSteps: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
      visualElement: z.string(),
    })
  ).default([]),
  codeReference: z.object({
    filePath: z.string(),
    code: z.string(),
    explanation: z.string(),
  }).optional(),
});

export const AskAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
  groundedInFiles: z.array(z.string()).default([]),
  simplifiedTakeaway: z.string(),
  relatedConcepts: z.array(z.string()).default([]),
});
