// Ad-hoc retrieval check: prints the top chunks kb_hybrid_search returns for sample questions.
// Run: npx ts-node src/scripts/probe-kb.ts

import { supabase } from '../server/services/supabase';
import { embedQuery } from '../server/services/kb/embed';

const cases: [string, string | null, string | null][] = [
  ['What is Vansh\'s professional experience?', null, 'personal'],
  ['What tech stack does Ursa use?', null, null],
  ['How does the RAG pipeline work?', 'ursa-ai', 'project'],
  ['Tell me about the Pizza Hut rebrand', null, null],
  ['Which projects involve fintech or loans?', null, null],
  ['What design tools does he know?', null, 'personal'],
];
(async () => {
  for (const [q, projectId, type] of cases) {
    const emb = await embedQuery(q);
    const { data, error } = await supabase.rpc('kb_hybrid_search', {
      query_text: q, query_embedding: emb, match_count: 4,
      filter_source_type: type, filter_project_id: projectId,
    });
    console.log(`\nQ: ${q}  [project=${projectId ?? '-'} type=${type ?? '-'}]`);
    if (error) { console.log('  ERROR', error.message); continue; }
    for (const r of data) console.log(`  ${r.score.toFixed(4)} sim=${r.similarity.toFixed(2)}  ${r.heading_path.slice(0, 95)}`);
  }
})();
