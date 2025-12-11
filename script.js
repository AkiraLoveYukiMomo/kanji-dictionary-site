// ーーー Supabase 接続設定 ーーー
const SUPABASE_URL = "https://ezmeralrtkicxbfmaocw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bWVyYWxydGtpY3hiZm1hb2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MzQxOTUsImV4cCI6MjA4MTAxMDE5NX0.QreLL2vOhRe1U-zR-UkKtdKwY0F1CtvsRDCgy1vA1W4";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ----ここから下は検索処理の実装----

// Supabase からデータを読み込む検索関数
async function searchKanji() {
    const input = document.getElementById("searchInput").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!input) {
        resultDiv.innerHTML = "漢字を入力してください。";
        return;
    }

    const kanjiList = input.split(/\s+/);

    for (const kanji of kanjiList) {
        const { data, error } = await client
            .from("kanji_pages")
            .select("*")
            .eq("kanji", kanji)
            .single();

        const p = document.createElement("p");

        if (error || !data) {
            p.innerHTML = `『${kanji}』 → 見つかりません`;
        } else {
            p.innerHTML = `『${kanji}』 → <b>${data.page}ページ</b>`;
        }

        resultDiv.appendChild(p);
    }
}

// データ読み込み完了メッセージ
document.getElementById("searchButton").disabled = false;
document.getElementById("searchButton").textContent = "検索";
