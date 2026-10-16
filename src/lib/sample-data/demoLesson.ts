import { RepoLesson } from '../types/lesson';

export const DEMO_REPO_LESSON: RepoLesson = {
  id: 'lesson-docquery-ai-main-v1',
  repo: {
    owner: 'docquery-ai',
    name: 'pdf-rag-agent',
    fullName: 'docquery-ai/pdf-rag-agent',
    description: 'Local-first agentic pipeline for fast semantic Q&A and table extraction over multi-page PDF documents.',
    stars: 3420,
    forks: 412,
    language: 'TypeScript',
    url: 'https://github.com/docquery-ai/pdf-rag-agent',
    defaultBranch: 'main',
    commitSha: '9b4f2a1',
    license: 'Apache-2.0',
    topics: ['rag', 'pdf-extraction', 'vector-search', 'embeddings', 'gemini-api', 'typescript'],
  },
  summary: {
    tagline: 'Turn dense PDF documents into interactive, conversational knowledge bases.',
    plainEnglishPurpose: 'DocQuery AI lets you drop in research papers, legal agreements, or product manuals and ask complex questions in natural English. It breaks down documents into digestible segments, finds the most relevant paragraphs instantly using vector similarity, and synthesizes accurate, cited answers.',
    primaryProblemSolved: 'People spend hours manually skimming long technical PDFs to locate answers. Traditional keyword search fails when users search for conceptual meanings rather than exact words.',
    targetAudience: 'Researchers, legal analysts, curious readers, and developers building semantic document assistants.',
  },
  chapters: [
    {
      id: 'chapter-1',
      chapterNumber: 1,
      title: 'Meet DocQuery AI',
      learningObjective: 'Understand the primary workflow: Document Ingestion → Semantic Search → Grounded Answer.',
      plainEnglishExplanation: 'Instead of searching for exact keywords, DocQuery transforms your documents into meaning-based concepts. When you ask a question, it identifies the exact paragraphs that answer it and delivers a human-friendly summary with page citations.',
      sceneType: 'intro',
      takeawayMessage: 'DocQuery solves information overload by answering questions directly from your own PDFs without hallucinating.',
      visualEntities: [
        {
          id: 'ent-pdf',
          label: 'PDF Document',
          role: 'input',
          description: 'A 45-page technical report or contract.',
          iconName: 'FileText',
          colorTheme: 'blue',
        },
        {
          id: 'ent-extractor',
          label: 'Chunking Engine',
          role: 'process',
          description: 'Splits text into coherent 500-token sections with 50-token overlap.',
          iconName: 'Cpu',
          colorTheme: 'violet',
        },
        {
          id: 'ent-vectorstore',
          label: 'Semantic Vector Store',
          role: 'store',
          description: 'Indexed numerical embeddings representing meaning.',
          iconName: 'Database',
          colorTheme: 'emerald',
        },
        {
          id: 'ent-answer',
          label: 'Grounded Answer',
          role: 'output',
          description: 'Precise answer with page & paragraph citations.',
          iconName: 'Sparkles',
          colorTheme: 'lime',
        },
      ],
      relationships: [
        { from: 'ent-pdf', to: 'ent-extractor', label: 'Parse & chunk', type: 'data' },
        { from: 'ent-extractor', to: 'ent-vectorstore', label: 'Embed & store', type: 'transform' },
        { from: 'ent-vectorstore', to: 'ent-answer', label: 'Retrieve & synthesize', type: 'call' },
      ],
      orderedAnimationSteps: [
        {
          stepNumber: 1,
          title: 'Document Upload',
          description: 'You upload a PDF. DocQuery reads the raw text, headers, and tables.',
          activeEntityIds: ['ent-pdf'],
          animatedStateDescription: 'Document is loaded and parsed into clean text tokens.',
        },
        {
          stepNumber: 2,
          title: 'Intelligent Chunking',
          description: 'Text is divided into digestible paragraphs so context is preserved without exceeding token limits.',
          activeEntityIds: ['ent-extractor'],
          animatedStateDescription: 'Text splits into overlapping chunks.',
        },
        {
          stepNumber: 3,
          title: 'Semantic Vector Indexing',
          description: 'Each paragraph is transformed into a 768-dimensional vector capturing semantic ideas.',
          activeEntityIds: ['ent-vectorstore'],
          animatedStateDescription: 'Vectors are stored in memory for lightning-fast cosine similarity.',
        },
        {
          stepNumber: 4,
          title: 'Instant Grounded Answer',
          description: 'When you ask a question, the most relevant passages are retrieved to generate an accurate cited answer.',
          activeEntityIds: ['ent-answer'],
          animatedStateDescription: 'Cited answer produced with zero guesswork.',
        },
      ],
      relevantConcepts: ['rag-architecture', 'document-chunking', 'vector-embeddings'],
      sourceReferences: [
        {
          filePath: 'src/pipeline/ingest.ts',
          startLine: 18,
          endLine: 42,
          description: 'Defines the primary document parsing and chunking pipeline.',
        },
        {
          filePath: 'src/index.ts',
          startLine: 1,
          endLine: 25,
          description: 'Application entry point coordinating the user prompt and response stream.',
        },
      ],
    },
    {
      id: 'chapter-2',
      chapterNumber: 2,
      title: 'See What It Can Do',
      learningObjective: 'Observe how semantic understanding outperforms ordinary keyword search.',
      plainEnglishExplanation: 'Traditional keyword search fails if you ask "How much revenue did the company make?" and the document says "Total gross turnover was $4.2M". DocQuery bridges that vocabulary gap by searching on conceptual similarity.',
      sceneType: 'capability-showcase',
      takeawayMessage: 'Conceptual matching finds relevant answers even when the words used in the question are completely different from words in the document.',
      visualEntities: [],
      relationships: [],
      orderedAnimationSteps: [
        {
          stepNumber: 1,
          title: 'Select Sample Question',
          description: 'Pick from typical real-world questions on financial or technical documents.',
          activeEntityIds: [],
        },
        {
          stepNumber: 2,
          title: 'Semantic Match Execution',
          description: 'Observe how the retriever matches concepts rather than raw strings.',
          activeEntityIds: [],
        },
      ],
      relevantConcepts: ['semantic-search', 'cosine-similarity'],
      sourceReferences: [
        {
          filePath: 'src/retriever/search.ts',
          startLine: 12,
          endLine: 38,
          description: 'Vector similarity search over document chunks.',
        },
      ],
      capabilityDemo: {
        inputLabel: 'Try an inquiry on an Annual Report PDF',
        sampleInputs: [
          'What were the chief financial risks in Q3?',
          'What is the company policy on remote international work?',
          'How does the battery management system prevent thermal runaway?',
        ],
        transformationDescription: 'Queries are embedded into vector space and ranked against 1,200 indexed document segments.',
        outputResult: 'Rank 1 (94% confidence): Section 4.2: Foreign currency fluctuations and supply chain lead times increased operational risk by 12%.',
        interactivePresets: [
          {
            label: 'Financial Risks',
            input: 'What were the chief financial risks in Q3?',
            output: 'Identified Page 14, Paragraph 3: Currency volatility and semiconductor supply chain delays impacted European margins by 3.4%.',
            stageSteps: ['Embedding query', 'Scanning 45 document chunks', 'Selecting top 3 passages', 'Synthesizing verified citation'],
          },
          {
            label: 'Remote Work Policy',
            input: 'What is the company policy on remote international work?',
            output: 'Identified Page 28, Section 8: Employees may work up to 90 days annually outside their home country with prior team lead authorization.',
            stageSteps: ['Embedding query', 'Scanning HR policy handbook', 'Matching Section 8 (89% similarity)', 'Generating policy summary'],
          },
          {
            label: 'Battery Safety',
            input: 'How does the battery management system prevent thermal runaway?',
            output: 'Identified Page 7, Diagram 2: Active cooling loops trigger when any cell exceeds 45°C, with pyrotechnic disconnect fuses at 60°C.',
            stageSteps: ['Embedding query', 'Scanning engineering spec sheet', 'Matching thermal safety thresholds', 'Extracting exact specifications'],
          },
        ],
      },
    },
    {
      id: 'chapter-3',
      chapterNumber: 3,
      title: 'Under the Hood: The Retrieval Pipeline',
      learningObjective: 'Follow data as it flows through the 4 stages of Retrieval-Augmented Generation (RAG).',
      plainEnglishExplanation: 'The magic happens in four synchronized steps: 1) Chunking breaks raw text into meaningful segments; 2) Embedding converts chunks to numbers; 3) Vector indexing finds the top matches; 4) The AI synthesizer writes the answer using only those matches.',
      sceneType: 'process-flow',
      takeawayMessage: 'By feeding only relevant excerpts to the AI model, DocQuery stays fast, cheap, and immune to factual hallucinations.',
      visualEntities: [
        {
          id: 'node-raw',
          label: '1. Raw PDF',
          role: 'input',
          description: 'Multi-column formatting, tables, and paragraphs extracted.',
          iconName: 'FileText',
          colorTheme: 'blue',
        },
        {
          id: 'node-chunk',
          label: '2. Sliding Window Chunks',
          role: 'process',
          description: '500-character segments with 10% overlap to preserve sentence boundaries.',
          iconName: 'Layers',
          colorTheme: 'violet',
        },
        {
          id: 'node-embed',
          label: '3. Vector Embeddings',
          role: 'process',
          description: 'Calculates high-dimensional semantic coordinates.',
          iconName: 'Cpu',
          colorTheme: 'purple',
        },
        {
          id: 'node-search',
          label: '4. Cosine Match',
          role: 'store',
          description: 'Finds top-k closest vectors to your question in under 12ms.',
          iconName: 'Search',
          colorTheme: 'cyan',
        },
        {
          id: 'node-synth',
          label: '5. LLM Synthesis',
          role: 'output',
          description: 'Generates concise answer referencing only the verified chunks.',
          iconName: 'CheckCircle2',
          colorTheme: 'lime',
        },
      ],
      relationships: [
        { from: 'node-raw', to: 'node-chunk', label: 'Extract & boundary split', type: 'data' },
        { from: 'node-chunk', to: 'node-embed', label: 'Text to vectors', type: 'transform' },
        { from: 'node-embed', to: 'node-search', label: 'Index & query distance', type: 'call' },
        { from: 'node-search', to: 'node-synth', label: 'Grounded prompt', type: 'data' },
      ],
      orderedAnimationSteps: [
        {
          stepNumber: 1,
          title: 'Text Extraction & Cleaning',
          description: 'DocQuery removes headers, footers, and page numbers to isolate clean sentences.',
          activeEntityIds: ['node-raw', 'node-chunk'],
        },
        {
          stepNumber: 2,
          title: 'Vector Math Conversion',
          description: 'Each text chunk is turned into an array of 768 floating point numbers representing its core meaning.',
          activeEntityIds: ['node-chunk', 'node-embed'],
        },
        {
          stepNumber: 3,
          title: 'Semantic Distance Calculation',
          description: 'When a query arrives, vector dot-products determine which passages are conceptually closest.',
          activeEntityIds: ['node-embed', 'node-search'],
        },
        {
          stepNumber: 4,
          title: 'Strict Grounded Synthesis',
          description: 'The AI answers the query using only the retrieved excerpts, adding page citations for transparency.',
          activeEntityIds: ['node-search', 'node-synth'],
        },
      ],
      relevantConcepts: ['rag-architecture', 'vector-embeddings', 'cosine-similarity'],
      sourceReferences: [
        {
          filePath: 'src/pipeline/ragPipeline.ts',
          startLine: 15,
          endLine: 65,
          description: 'Complete orchestration from query input to final cited stream.',
        },
      ],
    },
    {
      id: 'chapter-4',
      chapterNumber: 4,
      title: 'Deep Dive: Vector Embeddings in Action',
      learningObjective: 'Visualize how text transforms into numbers in multidimensional concept space.',
      plainEnglishExplanation: 'Computers do not understand language the way humans do; they understand geometry. An embedding model places similar phrases near each other in a mathematical space. Words like "king" and "queen" or "revenue" and "profit" live in the exact same semantic neighborhood.',
      sceneType: 'concept-explainer',
      takeawayMessage: 'Embeddings turn the subjective meaning of text into measurable geometric distances that computers can compare in milliseconds.',
      visualEntities: [
        {
          id: 'ent-text-chunk',
          label: '"Net profit increased by 14%"',
          role: 'input',
          description: 'Natural language phrase from the PDF.',
          iconName: 'Type',
          colorTheme: 'blue',
        },
        {
          id: 'ent-vector-rep',
          label: '[0.284, -0.612, 0.915, ...]',
          role: 'process',
          description: 'Numerical coordinate array representing semantic position.',
          iconName: 'Binary',
          colorTheme: 'purple',
        },
        {
          id: 'ent-sim-match',
          label: 'Cosine Angle: 0.93 (High Match)',
          role: 'output',
          description: 'Geometric angle between your question vector and this chunk vector.',
          iconName: 'Compass',
          colorTheme: 'lime',
        },
      ],
      relationships: [
        { from: 'ent-text-chunk', to: 'ent-vector-rep', label: 'Embedding Model', type: 'transform' },
        { from: 'ent-vector-rep', to: 'ent-sim-match', label: 'Dot Product', type: 'call' },
      ],
      orderedAnimationSteps: [
        {
          stepNumber: 1,
          title: 'Input Sentence',
          description: 'Text is parsed and tokenized into subword tokens.',
          activeEntityIds: ['ent-text-chunk'],
        },
        {
          stepNumber: 2,
          title: 'Mapping into Concept Dimensions',
          description: 'The embedding neural net projects the tokens into a 768-dimensional vector.',
          activeEntityIds: ['ent-vector-rep'],
        },
        {
          stepNumber: 3,
          title: 'Angle Measurement (Cosine Similarity)',
          description: 'The smaller the angle between vectors, the closer the meaning of the two passages.',
          activeEntityIds: ['ent-sim-match'],
        },
      ],
      relevantConcepts: ['vector-embeddings', 'cosine-similarity', 'high-dimensional-space'],
      sourceReferences: [
        {
          filePath: 'src/embeddings/embedder.ts',
          startLine: 10,
          endLine: 34,
          description: 'Wraps the embedding model API call and batch caching.',
        },
      ],
    },
    {
      id: 'chapter-5',
      chapterNumber: 5,
      title: 'The Engine Room: Inspecting the Retriever',
      learningObjective: 'Inspect the exact lines of code that perform the similarity search.',
      plainEnglishExplanation: 'Here is the real source file responsible for scoring passages. Notice how concise modern vector search is: it calculates the dot product between the query vector and every chunk, then sorts to return the top 3 highest scoring chunks.',
      sceneType: 'code-spotlight',
      takeawayMessage: 'Clean architecture separates the embedding math from the user interface, making the search engine modular and testable.',
      visualEntities: [],
      relationships: [],
      orderedAnimationSteps: [
        {
          stepNumber: 1,
          title: 'Vector Calculation',
          description: 'Lines 18-24 calculate the cosine dot product for each stored chunk.',
          activeEntityIds: [],
        },
        {
          stepNumber: 2,
          title: 'Top-K Ranking',
          description: 'Lines 26-30 sort chunks descending by score and slice the top k results.',
          activeEntityIds: [],
        },
      ],
      relevantConcepts: ['cosine-similarity', 'vector-embeddings'],
      sourceReferences: [
        {
          filePath: 'src/retriever/search.ts',
          startLine: 14,
          endLine: 35,
          description: 'Core similarity search logic.',
        },
      ],
      codeSnippet: {
        filePath: 'src/retriever/search.ts',
        language: 'typescript',
        functionName: 'findSimilarChunks',
        explanation: 'This function accepts a user query vector and returns the top 3 highest matching document passages.',
        highlightedLines: [18, 19, 20, 21, 26, 27],
        code: `export async function findSimilarChunks(
  queryVector: number[],
  chunks: DocumentChunk[],
  topK: number = 3
): Promise<ScoredChunk[]> {
  // 1. Calculate cosine similarity for every document chunk
  const scored = chunks.map((chunk) => {
    const similarity = cosineSimilarity(queryVector, chunk.embedding);
    return {
      chunk,
      similarityScore: similarity,
      pageNumber: chunk.metadata.pageNumber,
    };
  });

  // 2. Sort descending: highest semantic relevance first
  scored.sort((a, b) => b.similarityScore - a.similarityScore);

  // 3. Return the top-k most relevant excerpts with confidence scores
  return scored.slice(0, topK);
}`,
      },
    },
    {
      id: 'chapter-6',
      chapterNumber: 6,
      title: "Let's Use It: Quickstart Guide",
      learningObjective: 'Run DocQuery AI locally on your computer in 3 straightforward steps.',
      plainEnglishExplanation: 'You do not need deep machine learning knowledge to run this project. As long as you have Node.js 18+ and an API key for your chosen model, you can launch the interactive terminal or local web UI.',
      sceneType: 'getting-started',
      takeawayMessage: 'With 3 shell commands, you can begin querying your own PDFs locally.',
      visualEntities: [],
      relationships: [],
      orderedAnimationSteps: [],
      relevantConcepts: ['local-setup', 'environment-variables'],
      sourceReferences: [
        {
          filePath: 'package.json',
          startLine: 1,
          endLine: 30,
          description: 'Verified package scripts and dependencies.',
        },
        {
          filePath: 'README.md',
          startLine: 40,
          endLine: 75,
          description: 'Official installation and execution instructions.',
        },
      ],
    },
    {
      id: 'chapter-7',
      chapterNumber: 7,
      title: 'Journey Complete: What You Learned',
      learningObjective: 'Celebrate completing the DocQuery AI visual learning journey!',
      plainEnglishExplanation: 'You now understand how modern Retrieval-Augmented Generation works: from document parsing and sliding window chunking to high-dimensional embeddings and cosine similarity search.',
      sceneType: 'summary',
      takeawayMessage: 'You are now equipped to run, explore, and modify this project with confidence.',
      visualEntities: [],
      relationships: [],
      orderedAnimationSteps: [],
      relevantConcepts: ['rag-architecture', 'vector-embeddings', 'semantic-search'],
      sourceReferences: [
        {
          filePath: 'https://github.com/docquery-ai/pdf-rag-agent',
          description: 'Official GitHub Repository.',
        },
      ],
    },
  ],
  concepts: [
    {
      id: 'rag-architecture',
      name: 'RAG (Retrieval-Augmented Generation)',
      oneLineHook: 'Giving AI models an open-book exam instead of relying on memory alone.',
      category: 'System Architecture',
      relatedChapterIds: ['chapter-1', 'chapter-3'],
    },
    {
      id: 'document-chunking',
      name: 'Document Chunking',
      oneLineHook: 'Slicing massive books into bite-sized paragraphs with overlap to keep context intact.',
      category: 'Data Processing',
      relatedChapterIds: ['chapter-1', 'chapter-3'],
    },
    {
      id: 'vector-embeddings',
      name: 'Vector Embeddings',
      oneLineHook: 'Converting human thoughts and sentences into geometric points in conceptual space.',
      category: 'Machine Learning',
      relatedChapterIds: ['chapter-3', 'chapter-4', 'chapter-5'],
    },
    {
      id: 'cosine-similarity',
      name: 'Cosine Similarity',
      oneLineHook: 'Measuring the angle between two thoughts: 0 degrees means identical meaning.',
      category: 'Mathematics',
      relatedChapterIds: ['chapter-2', 'chapter-4', 'chapter-5'],
    },
  ],
  gettingStarted: {
    prerequisites: [
      { item: 'Node.js v18 or newer', isVerified: true, note: 'Required to run TypeScript runtime.' },
      { item: 'npm or pnpm package manager', isVerified: true },
      { item: 'Google Gemini or OpenAI API Key', isVerified: true, note: 'Used for text embedding and answer generation.' },
    ],
    installCommands: [
      {
        command: 'git clone https://github.com/docquery-ai/pdf-rag-agent.git',
        description: 'Clone the repository to your local machine.',
        isVerified: true,
      },
      {
        command: 'cd pdf-rag-agent && npm install',
        description: 'Install project dependencies.',
        isVerified: true,
      },
      {
        command: 'cp .env.example .env.local',
        description: 'Create your local environment file.',
        isVerified: true,
      },
    ],
    envVariables: [
      {
        key: 'GEMINI_API_KEY',
        description: 'Your Google Gemini API key from AI Studio.',
        example: 'AIzaSy...',
        isRequired: true,
      },
      {
        key: 'CHUNK_SIZE',
        description: 'Maximum characters per document slice.',
        example: '500',
        isRequired: false,
      },
    ],
    runCommand: {
      command: 'npm run dev',
      description: 'Starts the local interactive web interface on http://localhost:3000.',
      isVerified: true,
    },
    firstUsageExample: {
      language: 'bash',
      code: `npx ts-node src/cli.ts query \\
  --file=./sample_docs/quarterly_report.pdf \\
  --ask="Summarize the key growth drivers in Q3"`,
      description: 'Quick CLI command to test document ingestion and answer synthesis in one command.',
    },
    limitations: [
      'Scanned image-only PDFs require an external OCR tool (e.g. Tesseract) before ingestion.',
      'Passages longer than 2,000 characters may lose fine-grained nuances if chunk size is set too high.',
    ],
    liveDemoUrl: 'https://docquery-demo.example.com',
  },
  metadata: {
    generatedAt: new Date().toISOString(),
    model: 'Featured Sample Journey',
    cacheHit: true,
    durationMs: 45,
    tokensEstimated: 3200,
    isDemoFallback: true,
    notice: 'Featured Sample Journey: Demonstrating an authentic PDF Document Q&A AI agent.',
  },
};
