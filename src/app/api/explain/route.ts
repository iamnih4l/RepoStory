import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/ai/gemini';
import { memoryCache } from '@/lib/cache/memoryCache';
import { ConceptDeepDive, ExplanationLevel, RepoLesson } from '@/lib/types/lesson';
import { AnalyzedRepoContext } from '@/lib/github/analyzer';
import { DEMO_REPO_LESSON } from '@/lib/sample-data/demoLesson';

// Verified precomputed explanations for demo concepts
const DEMO_CONCEPT_EXPLANATIONS: Record<string, Record<ExplanationLevel, ConceptDeepDive>> = {
  'vector-embeddings': {
    beginner: {
      conceptId: 'vector-embeddings',
      name: 'Vector Embeddings',
      level: 'beginner',
      analogy: 'Imagine a giant supermarket where similar foods are on the same aisle. Apples sit near oranges; milk sits near cheese. An embedding model places similar sentences on the same conceptual aisle.',
      coreMechanism: 'Every sentence is turned into a list of 768 numbers. If two sentences mean roughly the same thing, their numbers will be almost identical, making comparisons as simple as measuring distance on a map.',
      inThisRepository: 'DocQuery AI calculates an embedding for every 500-character paragraph in your PDF. When you ask a question, it finds the paragraphs whose coordinates are closest to your question.',
      visualSteps: [
        {
          title: '1. Human Text In',
          explanation: '"Net income rose 14% year over year."',
          visualElement: 'Raw text block passing into the tokenizer.',
        },
        {
          title: '2. Numerical Coordinate Calculation',
          explanation: 'The neural network generates [0.24, -0.81, 0.55, ...]',
          visualElement: 'A floating 3D coordinate vector.',
        },
        {
          title: '3. Proximity Matching',
          explanation: 'The question "Did profits grow?" lands right next to this vector.',
          visualElement: 'Two coordinate arrows with an acute angle between them.',
        },
      ],
      codeReference: {
        filePath: 'src/embeddings/embedder.ts',
        code: `const embedding = await ai.embedContent({
  model: 'text-embedding-004',
  content: chunk.text
});`,
        explanation: 'Generates semantic coordinates for the chunk via Google embedding model.',
      },
    },
    intermediate: {
      conceptId: 'vector-embeddings',
      name: 'Vector Embeddings',
      level: 'intermediate',
      analogy: 'A compressed geometric fingerprint of semantic meaning.',
      coreMechanism: 'Dense vector representations project discrete token sequences into continuous latent space where semantic similarity corresponds to geometric distance.',
      inThisRepository: 'Vectors are stored in an in-memory index. Cosine distance queries return top-k matches in O(N) or approximate nearest neighbor O(log N) time.',
      visualSteps: [
        {
          title: '1. Tokenization & Attention',
          explanation: 'Tokens pass through transformer layers to aggregate contextual meaning.',
          visualElement: 'Multi-head attention matrix.',
        },
        {
          title: '2. Pooling Layer',
          explanation: 'Mean-pooling produces a fixed 768-dimensional float32 vector.',
          visualElement: 'Fixed-width array of normalized floats.',
        },
        {
          title: '3. Dot Product Comparison',
          explanation: 'Fast matrix multiplication scores all stored vectors simultaneously.',
          visualElement: 'Cosine similarity heatmap.',
        },
      ],
    },
    technical: {
      conceptId: 'vector-embeddings',
      name: 'Vector Embeddings',
      level: 'technical',
      analogy: 'Unit-normalized vector projections on an n-dimensional hypersphere.',
      coreMechanism: 'High-dimensional embeddings represent semantic relationships such that cosine similarity = dot(A, B) / (||A|| * ||B||). With L2 normalization, this reduces to pure dot product.',
      inThisRepository: 'Chunks are indexed with Float32Array representations, enabling SIMD-accelerated dot product calculations across thousands of passages in sub-millisecond time.',
      visualSteps: [
        {
          title: '1. Hyperplane Projection',
          explanation: 'Dense embeddings map text onto a 768-D hypersphere.',
          visualElement: 'Hypersphere projection diagram.',
        },
        {
          title: '2. SIMD Vector Dot Product',
          explanation: 'Fast vector instructions compute similarity scores.',
          visualElement: 'Register-level SIMD operations.',
        },
      ],
    },
  },
  'cosine-similarity': {
    beginner: {
      conceptId: 'cosine-similarity',
      name: 'Cosine Similarity',
      level: 'beginner',
      analogy: 'Imagine two flashlight beams pointing in the dark. If both beams point in the exact same direction, the angle is 0 degrees (100% agreement). If they point in opposite directions, they disagree completely.',
      coreMechanism: 'Cosine similarity measures the angle between two lists of numbers, ignoring how long or short the sentences are.',
      inThisRepository: 'Used in src/retriever/search.ts to rank candidate document chunks from best match to worst match.',
      visualSteps: [
        {
          title: '1. Query Arrow',
          explanation: 'Direction vector of your question.',
          visualElement: 'Arrow pointing northeast.',
        },
        {
          title: '2. Passage Arrow',
          explanation: 'Direction vector of a document paragraph.',
          visualElement: 'Arrow pointing in a similar angle.',
        },
        {
          title: '3. Angle Calculation',
          explanation: 'Angle is narrow (12 degrees) = 98% match.',
          visualElement: 'Angle measurement gauge showing high alignment.',
        },
      ],
    },
    intermediate: {
      conceptId: 'cosine-similarity',
      name: 'Cosine Similarity',
      level: 'intermediate',
      analogy: 'Directional alignment independent of magnitude.',
      coreMechanism: 'cos(θ) = (A · B) / (||A|| ||B||), producing values between -1 (diametrically opposed) and 1 (identical orientation).',
      inThisRepository: 'Filters out irrelevant paragraphs that do not meet the minimum similarity threshold of 0.72.',
      visualSteps: [
        {
          title: '1. Normalize Vectors',
          explanation: 'Divide vectors by Euclidean norms.',
          visualElement: 'Unit circle projection.',
        },
        {
          title: '2. Dot Product Sum',
          explanation: 'Multiply corresponding dimensions and sum.',
          visualElement: 'Summation formula execution.',
        },
      ],
    },
    technical: {
      conceptId: 'cosine-similarity',
      name: 'Cosine Similarity',
      level: 'technical',
      analogy: 'Inner product in Hilbert space.',
      coreMechanism: 'Evaluates the cosine of the angle between two non-zero vectors in an inner product space. Insensitive to document length variations.',
      inThisRepository: 'Implemented with branchless loop unrolling for high-throughput in-memory search.',
      visualSteps: [
        {
          title: '1. Inner Product',
          explanation: 'Float32 multiplication across vector dimensions.',
          visualElement: 'Parallel accumulator registers.',
        },
      ],
    },
  },
  'document-chunking': {
    beginner: {
      conceptId: 'document-chunking',
      name: 'Document Chunking',
      level: 'beginner',
      analogy: 'Instead of trying to eat a giant 10-layer sandwich in one bite, you cut it into manageable bite-sized pieces so you can digest each one properly.',
      coreMechanism: 'Splits huge 50-page documents into 3-5 sentence chunks with a little bit of overlap so no ideas are cut in half.',
      inThisRepository: 'Keeps each chunk under 500 characters so the AI search engine stays instant and never runs out of memory.',
      visualSteps: [
        {
          title: '1. 50-Page PDF',
          explanation: 'Huge monolithic wall of text.',
          visualElement: 'Full document block.',
        },
        {
          title: '2. Sliding Window Split',
          explanation: 'Cut at sentence endings with 10% overlap.',
          visualElement: 'Multiple overlapping cards.',
        },
        {
          title: '3. Independent Search Chunks',
          explanation: 'Each chunk gets its own page citation.',
          visualElement: 'Labeled cards with page numbers.',
        },
      ],
    },
    intermediate: {
      conceptId: 'document-chunking',
      name: 'Document Chunking',
      level: 'intermediate',
      analogy: 'Context-window optimization and semantic boundary preservation.',
      coreMechanism: 'Recursive character text splitting prioritizes paragraphs, newlines, and sentences to maintain semantic coherence.',
      inThisRepository: 'Implemented in src/pipeline/ingest.ts with a 500-token window and 50-token stride.',
      visualSteps: [
        {
          title: '1. Structural Parsing',
          explanation: 'Identifies headers, lists, and paragraphs.',
          visualElement: 'Markdown AST tree.',
        },
        {
          title: '2. Recursive Splitting',
          explanation: 'Splits on paragraph breaks first, falling back to sentences.',
          visualElement: 'Split decision tree.',
        },
      ],
    },
    technical: {
      conceptId: 'document-chunking',
      name: 'Document Chunking',
      level: 'technical',
      analogy: 'Token-bounded semantic segmentation.',
      coreMechanism: 'Preserves discourse structure while enforcing hard upper bounds matching the embedding model context limit.',
      inThisRepository: 'Employs tiktoken-compatible subword token counting to avoid middle-of-token truncation.',
      visualSteps: [
        {
          title: '1. Token Boundary Detection',
          explanation: 'Tokenizes raw text to track true token budget.',
          visualElement: 'Token stream with boundary markers.',
        },
      ],
    },
  },
  'rag-architecture': {
    beginner: {
      conceptId: 'rag-architecture',
      name: 'RAG (Retrieval-Augmented Generation)',
      level: 'beginner',
      analogy: 'Giving a student an open-book exam with the exact page bookmark, instead of asking them to memorize everything they read 3 years ago.',
      coreMechanism: 'First we find the exact 2 or 3 paragraphs in your document that answer the question, then we hand only those paragraphs to the AI to write a clean summary.',
      inThisRepository: 'Ensures DocQuery AI gives 100% faithful answers with exact page numbers and never makes up facts.',
      visualSteps: [
        {
          title: '1. You Ask A Question',
          explanation: '"What is the return policy?"',
          visualElement: 'Chat bubble input.',
        },
        {
          title: '2. Quick Search',
          explanation: 'The system grabs Page 12, Paragraph 2.',
          visualElement: 'Magnifying glass picking one card.',
        },
        {
          title: '3. Grounded Answer',
          explanation: '"Per Page 12: Returns are accepted within 30 days."',
          visualElement: 'Cited answer box with green checkmark.',
        },
      ],
    },
    intermediate: {
      conceptId: 'rag-architecture',
      name: 'RAG (Retrieval-Augmented Generation)',
      level: 'intermediate',
      analogy: 'Combining search retrieval with generative reasoning.',
      coreMechanism: 'Decouples domain knowledge retrieval from parametric language model weights, grounding answers in verifiable external documents.',
      inThisRepository: 'Orchestrated in src/pipeline/ragPipeline.ts connecting vector search output to Gemini synthesis.',
      visualSteps: [
        {
          title: '1. Retrieval Phase',
          explanation: 'Fetch top-k passages via vector index.',
          visualElement: 'Vector index fetch.',
        },
        {
          title: '2. Context Injection',
          explanation: 'Inject retrieved passages into system prompt.',
          visualElement: 'Grounded prompt assembler.',
        },
        {
          title: '3. Generation',
          explanation: 'Language model generates citations.',
          visualElement: 'Streaming synthesized response.',
        },
      ],
    },
    technical: {
      conceptId: 'rag-architecture',
      name: 'RAG (Retrieval-Augmented Generation)',
      level: 'technical',
      analogy: 'Dual-phase non-parametric knowledge retrieval and conditional generation.',
      coreMechanism: 'Maximizes P(Answer | Query, Retrieved_Context) while minimizing hallucination risk via strict negative constraints in the system prompt.',
      inThisRepository: 'Constructs grounded prompt payloads with strict provenance tracking across chunk IDs.',
      visualSteps: [
        {
          title: '1. Context Assembly',
          explanation: 'Dynamic context assembly with token budget allocation.',
          visualElement: 'Prompt layout with slot limits.',
        },
      ],
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      repoLessonId,
      conceptId,
      conceptName = 'Concept',
      level = 'beginner',
    } = body as {
      repoLessonId: string;
      conceptId: string;
      conceptName?: string;
      level?: ExplanationLevel;
    };

    const customGeminiKey = req.headers.get('x-gemini-key') || (body as { userGeminiKey?: string }).userGeminiKey;

    if (!conceptId) {
      return NextResponse.json({ error: 'Concept ID is required.' }, { status: 400 });
    }

    const cacheKey = `concept:${repoLessonId || 'default'}:${conceptId}:${level}`;
    const cached = memoryCache.get<ConceptDeepDive>(cacheKey);
    if (cached) {
      return NextResponse.json({ deepDive: cached, isCached: true });
    }

    // Check precomputed explanations
    if (DEMO_CONCEPT_EXPLANATIONS[conceptId] && DEMO_CONCEPT_EXPLANATIONS[conceptId][level]) {
      const precomputed = DEMO_CONCEPT_EXPLANATIONS[conceptId][level];
      memoryCache.set(cacheKey, precomputed);
      return NextResponse.json({ deepDive: precomputed, isCached: false });
    }

    // Check if Gemini is configured (server or user-provided)
    if (!geminiService.isConfigured(customGeminiKey)) {
      // Fallback: create dynamic generic explanation
      const fallbackDeepDive: ConceptDeepDive = {
        conceptId,
        name: conceptName,
        level,
        analogy: `Think of ${conceptName} as an essential building block that makes this repository's primary workflow possible.`,
        coreMechanism: `${conceptName} handles specialized data processing within the architecture, coordinating with surrounding components to deliver reliable results.`,
        inThisRepository: `Referenced across key modules to decouple responsibilities and maintain high performance.`,
        visualSteps: [
          {
            title: `1. Input Stage`,
            explanation: `Data is prepared and fed into the ${conceptName} handler.`,
            visualElement: 'Data preparation card.',
          },
          {
            title: `2. Processing Stage`,
            explanation: `The core ${conceptName} logic executes transformations and validation.`,
            visualElement: 'Transformation pipeline.',
          },
          {
            title: `3. Output Integration`,
            explanation: `The resulting output connects to downstream modules.`,
            visualElement: 'Verified output stage.',
          },
        ],
      };

      memoryCache.set(cacheKey, fallbackDeepDive);
      return NextResponse.json({ deepDive: fallbackDeepDive, isCached: false });
    }

    // Retrieve cached repo context for targeted LLM call
    const contextKey = `context:${repoLessonId}`;
    const repoContext = memoryCache.get<AnalyzedRepoContext>(contextKey);

    const lesson: RepoLesson = memoryCache.get<RepoLesson>(`lesson:${repoLessonId}`) || DEMO_REPO_LESSON;

    if (repoContext) {
      const deepDive = await geminiService.generateConceptDeepDive(
        conceptId,
        conceptName,
        level,
        lesson,
        repoContext,
        customGeminiKey
      );
      memoryCache.set(cacheKey, deepDive);
      return NextResponse.json({ deepDive, isCached: false });
    }

    // Default fallback if context expired
    const simpleFallback: ConceptDeepDive = {
      conceptId,
      name: conceptName,
      level,
      analogy: `Imagine a specialized mechanism designed to make this software fast and reliable.`,
      coreMechanism: `${conceptName} isolates complexity into a dedicated layer.`,
      inThisRepository: `Used throughout the codebase to ensure maintainability.`,
      visualSteps: [
        {
          title: 'Operation',
          explanation: `Executes ${conceptName} workflow efficiently.`,
          visualElement: 'Active process icon.',
        },
      ],
    };

    return NextResponse.json({ deepDive: simpleFallback, isCached: false });
  } catch (err: unknown) {
    console.error('Explain route error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate concept deep dive.' },
      { status: 500 }
    );
  }
}
