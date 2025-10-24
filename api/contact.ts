import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Vercel Serverless Function
// URL: https://www.mitsulu.style/api/contact
// CORS不要（同一オリジン）

const resend = new Resend(process.env.RESEND_API_KEY);

// お問い合わせ種類の変換
const categoryMap: { [key: string]: string } = {
  facilitation: 'ファシリテーション',
  planning: '企画・研修',
  design: 'デザイン・制作',
  web: 'Web構築・開発・運用',
  pm: '進行管理',
  education: '教育・講習',
  experience: '体験サポート',
  estimate: '料金見積もり',
  other: 'その他'
};

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

  const { name, email, phone, company, category, message } = req.body;

  // バリデーション
  if (!name || !email || !message || !category) {
    return res.status(400).json({
      success: false,
      message: '必須項目が入力されていません'
    });
  }

  // メールアドレスの検証
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: '有効なメールアドレスを入力してください'
    });
  }

  const categoryDisplay = categoryMap[category] || category;
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  try {
    // 管理者向けメール送信
    await resend.emails.send({
      from: '三流お問い合わせフォーム <noreply@mitsulu.style>',
      to: ['mk@mitsulu.style'],
      replyTo: email,
      subject: `【三流】お問い合わせ - ${categoryDisplay}`,
      text: `三流のWebサイトからお問い合わせがありました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ お名前
${name}

■ メールアドレス
${email}

${phone ? `■ 電話番号\n${phone}\n\n` : ''}${company ? `■ 会社名・団体名\n${company}\n\n` : ''}■ お問い合わせ種類
${categoryDisplay}

■ お問い合わせ内容
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

---
送信日時: ${now}`
    });

    // 自動返信メール送信
    await resend.emails.send({
      from: '三流 <noreply@mitsulu.style>',
      to: [email],
      replyTo: 'mk@mitsulu.style',
      subject: '【三流】お問い合わせを受け付けました',
      text: `${name} 様

この度は三流（Mitsulu）にお問い合わせいただき、誠にありがとうございます。
以下の内容でお問い合わせを受け付けました。
24時間以内に担当者よりご連絡いたしますので、今しばらくお待ちください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【お問い合わせ内容の確認】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【お名前】
${name}

【メールアドレス】
${email}

${phone ? `【電話番号】\n${phone}\n\n` : ''}${company ? `【会社名・団体名】\n${company}\n\n` : ''}【お問い合わせ種類】
${categoryDisplay}

【お問い合わせ内容】
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

■ 注意事項

・このメールは自動送信されています。このメールへの返信は受け付けておりません。
・担当者から改めてご連絡いたしますので、今しばらくお待ちください。
・迷惑メールフォルダに振り分けられる場合がございます。
  メールが届かない場合は、迷惑メールフォルダをご確認ください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
三流（Mitsulu）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん

【公式サイト】
https://mitsulu.style

【お問い合わせ】
mk@mitsulu.style

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    });

    return res.status(200).json({
      success: true,
      message: 'お問い合わせを受け付けました。確認メールをお送りしましたのでご確認ください。'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'メール送信に失敗しました。時間をおいて再度お試しいただくか、mk@mitsulu.styleへ直接ご連絡ください。'
    });
  }
}
