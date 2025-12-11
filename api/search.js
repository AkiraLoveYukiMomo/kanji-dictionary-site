import { createClient } from '@supabase/supabase-js';

export async function onRequestPost({ request }) {
  const { text } = await request.json();

  const terms = text.split(/[\s　\t]+/).filter(Boolean);

  //
  const client = createClient(
    'https://ezmeralrtkicxbfmaocw.supabase.co',
    '<SERVICE_ROLE_KEY>'
  );

  let results = [];

  for (const kanji of terms) {
    const { data } = await client
      .from('kanji_pages')
      .select('page')
      .eq('kanji', kanji)
      .single();

    if (data) {
      results.push(`「${kanji}」 → ${data.page} ページ`);
    } else {
      results.push(`「${kanji}」は見つかりませんでした。`);
    }
  }

  return new Response(
    JSON.stringify({ result: results.join("<br>") }),
    { headers: { "Content-Type": "application/json" } }
  );
}
