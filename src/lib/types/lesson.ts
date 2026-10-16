export type SceneType =
  | 'intro'
  | 'capability-showcase'
  | 'process-flow'
  | 'concept-explainer'
  | 'code-spotlight'
  | 'getting-started'
  | 'summary';

export type ExplanationLevel = 'beginner' | 'intermediate' | 'technical';

export interface VisualEntity {
  id: string;
  label: string;
  role: 'input' | 'process' | 'store' | 'output' | 'service';
  description: string;
  iconName?: string;
  status?: string;
  colorTheme?: string;
}

export interface EntityRelationship {
  from: string;
  to: string;
  label?: string;
  type?: 'data' | 'call' | 'transform';
}

export interface AnimationStep {
  stepNumber: number;
  title: string;
  description: string;
  activeEntityIds: string[];
  animatedStateDescription?: string;
}

export interface SourceReference {
  filePath: string;
  startLine?: number;
  endLine?: number;
  description: string;
  snippet?: string;
}

export interface CodeSnippet {
  filePath: string;
  language: string;
  code: string;
  highlightedLines: number[];
  explanation: string;
  functionName?: string;
}

export interface CapabilityDemo {
  inputLabel: string;
  sampleInputs: string[];
  transformationDescription: string;
  outputResult: string;
  interactivePresets?: Array<{
    label: string;
    input: string;
    output: string;
    stageSteps: string[];
  }>;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  learningObjective: string;
  plainEnglishExplanation: string;
  sceneType: SceneType;
  visualEntities: VisualEntity[];
  relationships: EntityRelationship[];
  orderedAnimationSteps: AnimationStep[];
  relevantConcepts: string[];
  sourceReferences: SourceReference[];
  codeSnippet?: CodeSnippet;
  capabilityDemo?: CapabilityDemo;
  takeawayMessage: string;
}

export interface ConceptSummary {
  id: string;
  name: string;
  oneLineHook: string;
  category: string;
  relatedChapterIds?: string[];
}

export interface ConceptDeepDive {
  conceptId: string;
  name: string;
  level: ExplanationLevel;
  analogy: string;
  coreMechanism: string;
  inThisRepository: string;
  visualSteps: Array<{
    title: string;
    explanation: string;
    visualElement: string;
  }>;
  codeReference?: {
    filePath: string;
    code: string;
    explanation: string;
  };
}

export interface GettingStartedGuide {
  prerequisites: Array<{
    item: string;
    isVerified: boolean;
    note?: string;
  }>;
  installCommands: Array<{
    command: string;
    description: string;
    isVerified: boolean;
  }>;
  envVariables: Array<{
    key: string;
    description: string;
    example?: string;
    isRequired: boolean;
  }>;
  runCommand: {
    command: string;
    description: string;
    isVerified: boolean;
  };
  firstUsageExample: {
    code: string;
    language: string;
    description: string;
  };
  limitations: string[];
  liveDemoUrl?: string;
}

export interface RepoMetadata {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  defaultBranch: string;
  commitSha: string;
  license?: string;
  topics?: string[];
}

export interface RepoLesson {
  id: string;
  repo: RepoMetadata;
  summary: {
    tagline: string;
    plainEnglishPurpose: string;
    primaryProblemSolved: string;
    targetAudience: string;
  };
  chapters: Chapter[];
  concepts: ConceptSummary[];
  gettingStarted: GettingStartedGuide;
  metadata: {
    generatedAt: string;
    model: string;
    cacheHit: boolean;
    durationMs: number;
    tokensEstimated?: number;
    isDemoFallback?: boolean;
    notice?: string;
  };
}

export interface AskAnswer {
  question: string;
  answer: string;
  groundedInFiles: string[];
  simplifiedTakeaway: string;
  relatedConcepts: string[];
}
