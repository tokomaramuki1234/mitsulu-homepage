import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel Serverless Function (Proxy to Xserver PHP)
// URL: https://www.mitsulu.style/api/contact
//
// ブラウザ → Vercel API Route（同一オリジン、CORS不要）
// Vercel API Route → Xserver PHP（サーバー間通信、CORSチェックなし）
//
// この方式により、外部サービス不要でCORS問題を完全に解決

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORSヘッダー（念のため）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POSTのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'POSTリクエストのみ受け付けます'
    });
  }

  try {
    // Xserver PHPにプロキシ（サーバー間通信なのでCORSなし）
    const phpResponse = await fetch('https://form.mitsulu.style/contact.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const result = await phpResponse.json();

    // PHPからのレスポンスをそのまま返す
    return res.status(phpResponse.status).json(result);

  } catch (error) {
    console.error('Contact form proxy error:', error);
    return res.status(500).json({
      success: false,
      message: 'メール送信に失敗しました。時間をおいて再度お試しいただくか、mk@mitsulu.styleへ直接ご連絡ください。'
    });
  }
}
