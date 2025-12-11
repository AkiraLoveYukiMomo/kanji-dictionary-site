// =========================
//  🔐 パスワード認証部分
// =========================

// ログインで使うパスワード（ハッシュ化されたやつ）
const HASHED_PASSWORD = "eab9862175afae2661a64aa00e2ee73f2f8d00d27f9a5e276c45bb8915cb242e";

// 入力パスワードをチェック
async function checkPassword() {
    const input = document.getElementById('passInput').value;
    const hashedInput = await hashString(input);
    const loginMessage = document.getElementById('login-message');

    if (hashedInput === HASHED_PASSWORD) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('search-container').style.display = 'block';
    } else {
        loginMessage.textContent = 'パスワードが違います。';
    }
}

// SHA-256
async function hashString(str) {
    const data = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}



// =========================
//  🔌 Supabase 接続設定
// =========================

const SUPABASE_URL = "https://ezmeralrtkicxbfmaocw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bWVyYWxydGtpY3hiZm1hb2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MzQxOTUsImV4cCI6MjA4MTAxMDE5NX0.QreLL2vOhRe1U-zR-UkKtdKwY0F1CtvsRDCgy1vA1W4";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



// =========================
//  🔍 漢字検索（Supabase版）
// =========================

async function searchKanji() {
    const input = document.getElementById("searchInput").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!input) {
        resultDiv.innerHTML = "漢字を入力してください。";
        return;
    }

    const kanjiList = input.split(/[\s　\t]+/).filter(x => x.length > 0);
    let output = [];

    for (const kanji of kanjiList) {

        // Supabase で検索！
        const { data, error } = await supabase
            .from("kanji_pages")
            .select("page")
            .eq("kanji", kanji)
            .maybeSingle();

        if (error) {
            console.error(error);
            output.push(`「${kanji}」の検索中にエラーが発生しました。`);
            continue;
        }

        if (data) {
            output.push(`「${kanji}」は【${data.page}】ページにあります。`);
        } else {
            output.push(`「${kanji}」は見つかりませんでした。`);
        }
    }

    resultDiv.innerHTML = output.join("<br>");
}

