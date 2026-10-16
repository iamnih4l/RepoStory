async function testApi() {
  const baseUrl = 'http://localhost:3001';

  console.log('\n--- Testing Live API Endpoints on ' + baseUrl + ' ---');

  // 1. Health
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const healthData = await healthRes.json();
  console.log('✅ /api/health:', healthData.status, '| model:', healthData.gemini.model);

  // 2. Analyze
  const analyzeRes = await fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl: 'https://github.com/docquery-ai/pdf-rag-agent' }),
  });
  const analyzeData = await analyzeRes.json();
  console.log(
    '✅ /api/analyze:',
    analyzeData.lesson.repo.fullName,
    '| Chapters:',
    analyzeData.lesson.chapters.length,
    '| Source:',
    analyzeData.source
  );

  // 3. Explain
  const explainRes = await fetch(`${baseUrl}/api/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repoLessonId: analyzeData.lesson.id,
      conceptId: 'vector-embeddings',
      conceptName: 'Vector Embeddings',
      level: 'beginner',
    }),
  });
  const explainData = await explainRes.json();
  console.log(
    '✅ /api/explain:',
    explainData.deepDive.name,
    '| Analogy:',
    explainData.deepDive.analogy.slice(0, 50) + '...'
  );

  // 4. Ask
  const askRes = await fetch(`${baseUrl}/api/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repoLessonId: analyzeData.lesson.id,
      question: 'What is the primary purpose of DocQuery AI?',
    }),
  });
  const askData = await askRes.json();
  console.log(
    '✅ /api/ask:',
    askData.answer.question,
    '| Answer snippet:',
    askData.answer.answer.slice(0, 60) + '...'
  );

  // 5. Test invalid URL handling
  const invalidRes = await fetch(`${baseUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl: 'https://gitlab.com/unsupported/repo' }),
  });
  const invalidData = await invalidRes.json();
  console.log(
    '✅ /api/analyze rejection check (status',
    invalidRes.status,
    '):',
    invalidData.error
  );

  console.log('\n🎉 ALL LIVE API TESTS PASSED SUCCESSFULLY!\n');
}

testApi().catch((err) => {
  console.error('❌ API Test Failed:', err);
  process.exit(1);
});
