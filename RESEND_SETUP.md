# Resend セットアップガイド

## 概要

Vercel Serverless Functionsでメール送信を行うため、Resend APIを使用します。
完全無料（無料枠: 3,000通/月、1日100通まで）で、XserverのPHPよりもシンプルで確実です。

## なぜResendに切り替えたか

### 問題点（旧: Xserver PHP + CORS）
- ❌ 異なるサブドメイン間通信でCORS問題が発生
- ❌ `.htaccess`設定が複雑
- ❌ Xserverの設定に依存
- ❌ デバッグが困難

### 解決策（新: Vercel Serverless Functions + Resend）
- ✅ 同一オリジン（`/api/contact`）でCORS不要
- ✅ GitHubプッシュで自動デプロイ
- ✅ Vercel + Resend両方とも無料枠で十分
- ✅ サーバー設定不要

---

## ステップ1: Resendアカウント作成

### 1-1. Resend公式サイトにアクセス

https://resend.com

### 1-2. Sign Upをクリック

右上の「Sign Up」ボタンをクリック

### 1-3. アカウント登録

以下の方法で登録可能：
- **GitHubアカウントで登録**（推奨）
- Googleアカウントで登録
- メールアドレスで登録

**推奨**: GitHubアカウントで登録すると、Vercelとの連携もスムーズです。

### 1-4. メール認証

登録したメールアドレスに確認メールが届くので、リンクをクリックして認証完了

---

## ステップ2: ドメイン認証

### 2-1. Resendダッシュボードにログイン

https://resend.com/overview

### 2-2. 「Domains」をクリック

左サイドバーの「Domains」メニューをクリック

### 2-3. 「Add Domain」をクリック

### 2-4. ドメイン名を入力

```
mitsulu.style
```

「Add Domain」ボタンをクリック

### 2-5. DNS設定情報をコピー

ResendがDNS設定情報を表示します。以下の3つのレコードが表示されます：

**表示例:**
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqG... (長い文字列)

Type: TXT
Name: @ (または mitsulu.style)
Value: v=spf1 include:_spf.resend.com ~all

Type: CNAME (オプション)
Name: bounce
Value: feedback-smtp.resend.com
```

---

## ステップ3: Xserver DNS設定

### 3-1. Xserverサーバーパネルにログイン

https://www.xserver.ne.jp/login_server.php

### 3-2. 「DNSレコード設定」をクリック

ドメイン設定 → DNSレコード設定

### 3-3. mitsulu.styleを選択

### 3-4. DNSレコードを追加

**レコード1: DKIMキー（必須）**
- 種別: **TXT**
- ホスト名: **resend._domainkey**
- 内容: **（Resendからコピーした長い文字列）**
- 優先度: 0

**レコード2: SPFレコード（必須）**
- 種別: **TXT**
- ホスト名: **@** または空欄
- 内容: **v=spf1 include:_spf.resend.com ~all**
- 優先度: 0

**レコード3: バウンスハンドリング（オプション）**
- 種別: **CNAME**
- ホスト名: **bounce**
- 内容: **feedback-smtp.resend.com**
- 優先度: 0

### 3-5. 「確認画面へ進む」→「追加する」

---

## ステップ4: ドメイン認証確認

### 4-1. Resendに戻る

DNS設定後、Resendダッシュボードに戻る

### 4-2. 「Verify Domain」をクリック

ドメイン認証には **数分〜最大24時間** かかる場合があります。

### 4-3. 認証完了を確認

ステータスが「Verified」になれば完了

---

## ステップ5: API キー取得

### 5-1. 「API Keys」をクリック

左サイドバーの「API Keys」メニュー

### 5-2. 「Create API Key」をクリック

### 5-3. API Key名を入力

```
Mitsulu Production
```

**Permission**: `Full access` または `Sending access` を選択

### 5-4. 「Create」をクリック

### 5-5. API Keyをコピー

**重要**: この画面でしか表示されないので、必ずコピーして保存してください。

形式: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## ステップ6: Vercel環境変数設定

### 6-1. Vercelダッシュボードにログイン

https://vercel.com/dashboard

### 6-2. mitsulu-homepageプロジェクトを選択

### 6-3. 「Settings」→「Environment Variables」

### 6-4. 環境変数を追加

- **Key**: `RESEND_API_KEY`
- **Value**: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`（ステップ5-5でコピーしたAPIキー）
- **Environment**: `Production`, `Preview`, `Development` すべてにチェック

### 6-5. 「Save」をクリック

---

## ステップ7: デプロイとテスト

### 7-1. GitHubにプッシュ

```bash
cd "C:\Users\Endeavor\Documents\009-三流\mitsulu-web\mitsulu-homepage"
git add .
git commit -m "Switch to Vercel Serverless Functions with Resend API"
git push origin main
```

### 7-2. Vercel自動デプロイ

Vercelが自動的にデプロイを開始（2〜5分）

### 7-3. デプロイ完了確認

Vercelダッシュボードで「Deployment」が「Ready」になることを確認

### 7-4. 実際にテスト

1. https://www.mitsulu.style/#contact にアクセス
2. お問い合わせフォームに入力
3. 送信ボタンをクリック
4. 成功メッセージが表示されることを確認
5. mk@mitsulu.style に管理者メールが届くことを確認
6. 入力したメールアドレスに自動返信が届くことを確認

---

## トラブルシューティング

### エラー: Domain not verified

**原因**: DNS設定が完了していない、または伝播待ち

**解決策**:
1. Xserver DNS設定を再確認
2. 最大24時間待つ（通常は数分〜1時間）
3. `nslookup -type=TXT resend._domainkey.mitsulu.style` で確認

### エラー: 403 Forbidden from Resend API

**原因**: APIキーが正しく設定されていない

**解決策**:
1. Vercelの環境変数を再確認
2. APIキーが正しくコピーされているか確認
3. APIキーのPermissionを確認（Sending access以上）

### エラー: メールが届かない

**原因**: SPFレコードの設定ミス、または迷惑メールフォルダ

**解決策**:
1. 迷惑メールフォルダを確認
2. `nslookup -type=TXT mitsulu.style` でSPFレコードを確認
3. Resendダッシュボードの「Logs」でメール送信履歴を確認

---

## 料金プラン

### 無料プラン（Free）
- ✅ 月間3,000通まで
- ✅ 1日100通まで
- ✅ 独自ドメインメール送信可能
- ✅ API アクセス
- ✅ メール送信ログ30日間保存

**三流の想定使用量**: 月間10〜50通 → **無料枠で十分**

### 有料プラン（Pro: $20/月）
- 月間50,000通まで
- より高い送信レート
- メール送信ログ90日間保存

---

## まとめ

1. Resendアカウント作成（無料）
2. ドメイン認証（DNS設定）
3. APIキー取得
4. Vercel環境変数に設定
5. GitHubプッシュで自動デプロイ
6. テスト送信

これでCORS問題は完全に解消され、シンプルで確実なメール送信システムが完成します。
