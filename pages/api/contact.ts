import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', 'https://mitsulu.style');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTリクエストのみ許可
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  const { name, email, phone, company, category, message } = req.body;

  // データ検証
  if (!name || !email || !message || !category) {
    res.status(400).json({ success: false, message: '必須項目が入力されていません' });
    return;
  }

  // メールアドレスの検証
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ success: false, message: '有効なメールアドレスを入力してください' });
    return;
  }

  // カテゴリー変換
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

  const categoryDisplay = categoryMap[category] || category;

  // Nodemailer設定（Xserverのメールサーバーを使用）
  const transporter = nodemailer.createTransporter({
    host: 'mitsulu.style',  // Xserverのメールサーバー
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,  // 環境変数に設定
      pass: process.env.SMTP_PASS   // 環境変数に設定
    }
  });

  // 管理者向けメール
  const adminMailOptions = {
    from: '"三流お問い合わせフォーム" <noreply@mitsulu.style>',
    to: 'mk@mitsulu.style',
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
送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
`
  };

  // 自動返信メール
  const replyMailOptions = {
    from: '"三流" <noreply@mitsulu.style>',
    to: email,
    subject: '【三流】お問い合わせを受け付けました',
    text: `${name} 様

この度は三流にお問い合わせいただき、誠にありがとうございます。
以下の内容で受け付けました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【受付内容】

お問い合わせ種類: ${categoryDisplay}

お問い合わせ内容:
${message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

内容を確認次第、1〜2営業日以内にご返信いたします。
今しばらくお待ちくださいませ。

※このメールは自動送信されています。
※このメールに返信されても確認できませんのでご了承ください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
三流（Mitsulu）
様々な悩みの受け皿に
https://mitsulu.style
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
  };

  try {
    // メール送信
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(replyMailOptions);

    res.status(200).json({
      success: true,
      message: 'お問い合わせを受け付けました。ご入力いただいたメールアドレス宛に確認メールをお送りしました。'
    });
  } catch (error) {
    console.error('メール送信エラー:', error);
    res.status(500).json({
      success: false,
      message: 'メール送信に失敗しました。時間をおいて再度お試しください。'
    });
  }
}
