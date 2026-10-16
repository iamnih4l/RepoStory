import { parseGitHubUrl } from '../src/lib/github/parser';
import { redactSecrets } from '../src/lib/github/analyzer';
import { memoryCache } from '../src/lib/cache/memoryCache';
import { DEMO_REPO_LESSON } from '../src/lib/sample-data/demoLesson';
import {
  RepoLessonPayloadSchema,
  ConceptDeepDiveSchema,
  AskAnswerSchema,
} from '../src/lib/ai/schemas';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${msg}`);
}

console.log('\n--- 1. Testing GitHub URL Parser ---');
{
  const test1 = parseGitHubUrl('https://github.com/facebook/react');
  assert(test1.success && test1.data.owner === 'facebook' && test1.data.repo === 'react', 'Standard HTTPS URL');

  const test2 = parseGitHubUrl('github.com/langchain-ai/langchain.git');
  assert(test2.success && test2.data.owner === 'langchain-ai' && test2.data.repo === 'langchain', 'URL with .git');

  const test3 = parseGitHubUrl('fastapi/fastapi');
  assert(test3.success && test3.data.owner === 'fastapi' && test3.data.repo === 'fastapi', 'Shorthand owner/repo');

  const test4 = parseGitHubUrl('https://github.com/ggerganov/llama.cpp/tree/master/examples');
  assert(test4.success && test4.data.owner === 'ggerganov' && test4.data.repo === 'llama.cpp' && test4.data.branch === 'master', 'URL with branch/tree');

  const testInvalid1 = parseGitHubUrl('https://gitlab.com/user/project');
  assert(!testInvalid1.success, 'Rejects non-GitHub host');

  const testInvalid2 = parseGitHubUrl('https://github.com/invalid');
  assert(!testInvalid2.success, 'Rejects single-token repo path');
}

console.log('\n--- 2. Testing Secret Redactor ---');
{
  const textWithSecrets = 'apiKey="sk-12345678901234567890123456789012" and token="ghp_123456789012345678901234567890123456"';
  const redacted = redactSecrets(textWithSecrets);
  assert(!redacted.includes('sk-1234567890'), 'Redacted OpenAI key');
  assert(!redacted.includes('ghp_1234567890'), 'Redacted GitHub token');
  assert(redacted.includes('[REDACTED_AI_KEY]'), 'Includes AI key placeholder');
}

console.log('\n--- 3. Testing Zod Lesson Schema Validation ---');
{
  const lessonValidation = RepoLessonPayloadSchema.safeParse({
    summary: DEMO_REPO_LESSON.summary,
    chapters: DEMO_REPO_LESSON.chapters,
    concepts: DEMO_REPO_LESSON.concepts,
    gettingStarted: DEMO_REPO_LESSON.gettingStarted,
  });
  assert(lessonValidation.success, 'DEMO_REPO_LESSON strictly matches RepoLessonPayloadSchema');

  const conceptValidation = ConceptDeepDiveSchema.safeParse({
    conceptId: 'test-concept',
    name: 'Test Concept',
    level: 'beginner',
    analogy: 'Like sorting mail',
    coreMechanism: 'Hash maps provide O(1) lookups',
    inThisRepository: 'Used in index file',
    visualSteps: [{ title: 'Step 1', explanation: 'Hash calculation', visualElement: 'Hash node' }],
  });
  assert(conceptValidation.success, 'ConceptDeepDiveSchema validates properly');

  const askValidation = AskAnswerSchema.safeParse({
    question: 'How do I run tests?',
    answer: 'Run npm test in terminal',
    groundedInFiles: ['package.json'],
    simplifiedTakeaway: 'Run tests via npm',
    relatedConcepts: ['Testing'],
  });
  assert(askValidation.success, 'AskAnswerSchema validates properly');
}

console.log('\n--- 4. Testing Memory Cache & Metrics ---');
{
  memoryCache.clear();
  memoryCache.set('test:key', { foo: 'bar' });
  assert(memoryCache.has('test:key'), 'Cache has key after set');
  const val = memoryCache.get<{ foo: string }>('test:key');
  assert(val?.foo === 'bar', 'Cache returns correct data');

  const miss = memoryCache.get('nonexistent:key');
  assert(miss === null, 'Cache returns null for missing key');

  const metrics = memoryCache.getMetrics();
  assert(metrics.totalHits >= 1 && metrics.totalMisses >= 1, 'Cache records hit and miss metrics');
}

console.log('\n✨ ALL ENGINE VERIFICATION CHECKS PASSED!\n');
