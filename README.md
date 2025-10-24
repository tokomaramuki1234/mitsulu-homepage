# Mitsulu Homepage

> 小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん

## 🌐 公式URL

- **本番環境**: https://mitsulu.style
- **Vercel デフォルト URL**: https://mitsulu-homepage.vercel.app
- **GitHub リポジトリ**: https://github.com/tokomaramuki1234/mitsulu-homepage

## 📧 お問い合わせフォーム設定

### 現在のアーキテクチャ（Vercel API Route → Xserver PHP）

お問い合わせフォームは、Vercel API RouteがXserver PHPにプロキシする構成を採用しています。

```
ユーザー（ブラウザ）
  ↓ POST /api/contact
  ↓ ★同一オリジン（CORS不要）★
Vercel Next.js API Route（サーバーサイド）
  ↓ POST https://form.mitsulu.style/contact.php
  ↓ ★サーバー間通信（CORSチェックなし）★
Xserver PHP（contact.php）
  ↓ mb_send_mail()
メール送信（mk@mitsulu.style + 自動返信）
```

**重要なポイント:**
- フロントエンド → Vercel API Route: 同一オリジン（`/api/contact`）なのでCORS不要
- Vercel API Route → Xserver PHP: サーバー間通信なのでCORSチェックなし
- **外部サービス不使用**（Vercel + Xserver のみで完結）

**ファイル構成:**
- `pages/api/contact.ts`: Vercel Serverless Function（プロキシ）
- `/mitsulu.style/public_html/form/contact.php`: Xserver PHP（メール送信）

**エンドポイント:**
- フロントエンド呼び出し: `https://www.mitsulu.style/api/contact`
- バックエンド実体: `https://form.mitsulu.style/contact.php`

### DNS 設定

| ホスト名 | 種別 | 値 | 用途 |
|----------|------|----|------|
| @ | A | 216.198.79.1 | Vercel (メインサイト) |
| www | CNAME | db6751fc8be97914.vercel-dns-017.com | Vercel (www) |
| form | A | Xserver IP | Xserver (お問い合わせAPI) |
| @ | TXT | `v=spf1 +a:sv***.xserver.jp +mx ~all` | SPFレコード（設定済み） |

### Xserver 設定

1. サブドメイン `form` を作成
2. `/mitsulu.style/public_html/form/` に `contact.php` をアップロード
3. パーミッション：644

### メール設定（完了済み）

- ✅ **noreply@mitsulu.style**: 作成済み
- ✅ **SPFレコード**: Xserver DNS設定済み
- ✅ **文字エンコーディング**: contact.php に `mb_language('Japanese')` 設定済み
- ✅ **送信先**: mk@mitsulu.style
- ✅ **自動返信**: あり

---

## 🔧 CORS問題のトラブルシューティング

### 発生した問題と解決策

お問い合わせフォーム実装時に発生したCORS（Cross-Origin Resource Sharing）問題とその解決プロセスを記録します。

#### **問題1: 異なるオリジン間のCORSエラー（初期実装）**

**発生した問題:**
```
Access to fetch at 'https://form.mitsulu.style/contact.php' from origin 'https://www.mitsulu.style'
has been blocked by CORS policy
```

**原因:**
- フロントエンド: `https://www.mitsulu.style`（Vercel）
- バックエンドAPI: `https://form.mitsulu.style/contact.php`（Xserver）
- **異なるサブドメイン間の通信**は、ブラウザのセキュリティポリシーによりCORSチェックが発生

**失敗した解決試行:**
1. ❌ PHP側でCORSヘッダーを追加 → OPTIONSリクエストが処理されない
2. ❌ `.htaccess`でOPTIONSリクエストを処理 → Xserverの設定で上書きされる
3. ❌ `ob_start()`でヘッダー送信を制御 → それでも動作せず

**根本原因:**
- Xserverのサーバー設定（HTTPSリダイレクト等）がPHP実行前に動作
- サブドメイン間通信という構造そのものがCORS問題を複雑化

---

#### **問題2: 外部サービス（Resend）への依存（中間解決案）**

**試みた解決策:**
- Vercel Serverless FunctionでResend APIを使用してメール送信
- 同一オリジン通信でCORS問題を回避

**問題点:**
- ❌ **要件違反**: プロジェクト要件「Vercel + Xserver のみ、外部サービス不使用」に反する
- ❌ 外部APIキーの管理が必要
- ❌ 無料枠の制約

**即座にロールバック実施**

---

#### **最終解決策: Vercel API Routeをプロキシとして使用**

**参考記事:**
https://qiita.com/JZ8xNeXY/items/59e95e7ec92acac9cda4

**解決の鍵:**
> ブラウザからのリクエストはCORSチェックが発生するが、
> サーバー間通信（Vercel → Xserver）はCORSチェックが発生しない

**実装内容:**

```typescript
// pages/api/contact.ts
export default async function handler(req, res) {
  // フロントエンドからのリクエストを受ける（同一オリジン）

  // Xserver PHPにプロキシ（サーバー間通信、CORSなし）
  const phpResponse = await fetch('https://form.mitsulu.style/contact.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });

  // 結果をフロントエンドに返す
  return res.status(phpResponse.status).json(await phpResponse.json());
}
```

**メリット:**
- ✅ **CORS問題完全解決**（同一オリジン + サーバー間通信）
- ✅ **外部サービス不使用**（Vercel + Xserver のみ）
- ✅ **既存のXserver PHP**をそのまま使用可能
- ✅ **環境変数設定不要**
- ✅ **完全無料**

---

#### **問題3: APIルートの配置場所エラー**

**発生した問題:**
```
405 Method Not Allowed
```

**原因:**
- ❌ `api/contact.ts`（ルートディレクトリ）に配置
- ✅ `pages/api/contact.ts`（正しい配置場所）に配置すべき

**解決:**
```bash
# 正しいディレクトリ構造
mitsulu-homepage/
├── pages/
│   ├── api/
│   │   └── contact.ts  ← ここに配置
│   └── index.tsx
```

Next.js 16（Pages Router）では、APIルートは必ず`pages/api/`に配置する必要があります。

---

#### **問題4: 型定義パッケージの不足**

**発生した問題:**
```
Cannot find module '@vercel/node' or its corresponding type declarations.
```

**解決:**
```bash
npm install --save-dev @vercel/node
```

Vercel API Routeの型定義（`VercelRequest`, `VercelResponse`）を使用するには、`@vercel/node`パッケージが必要です。

---

### デバッグ手順まとめ

#### **1. CORSエラーが発生した場合**

**ブラウザで確認:**
```
F12 → Console タブ
エラーメッセージを確認:
- "blocked by CORS policy" → CORS問題
- "405 Method Not Allowed" → APIルート問題
- "404 Not Found" → エンドポイントURL問題
```

**ネットワークタブで確認:**
```
F12 → Network タブ → フォーム送信
リクエスト先を確認:
- /api/contact → 正しい（同一オリジン）
- form.mitsulu.style/contact.php → 古い実装（CORS発生）
```

#### **2. Vercelデプロイ状況の確認**

```
https://vercel.com/dashboard
→ プロジェクト選択
→ Deployments タブ
→ 最新デプロイが "Ready" になっているか確認
```

**ビルドエラーが発生している場合:**
- Build Logs を確認
- エラーメッセージから問題を特定
- 修正後、再プッシュで自動デプロイ

#### **3. APIエンドポイントの動作確認**

**ブラウザで直接アクセス:**
```
https://www.mitsulu.style/api/contact
```

**期待される結果:**
```json
{"success":false,"message":"POSTリクエストのみ受け付けます"}
```

**404エラーが出る場合:**
- APIファイルが`pages/api/`に配置されていない
- デプロイが完了していない
- ブラウザキャッシュが古い

#### **4. ブラウザキャッシュのクリア**

デプロイ後も古いコードが動作する場合：

**ハードリフレッシュ:**
- Windows: `Ctrl + Shift + R` または `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**キャッシュ完全削除:**
- Chrome: `Ctrl + Shift + Delete` → キャッシュ削除

**シークレットモードでテスト:**
- Chrome: `Ctrl + Shift + N`

---

### 学んだ教訓

1. **CORS問題は構造から解決する**
   - クライアント側の設定だけでは解決困難
   - サーバーサイドプロキシという構造的解決が有効

2. **要件を常に意識する**
   - 「外部サービス不使用」という要件を見落とさない
   - 解決策が要件に沿っているか常に確認

3. **Next.jsのディレクトリ構造を理解する**
   - Pages Router: `pages/api/`
   - App Router: `app/api/route.ts`
   - バージョンによって異なるので注意

4. **デプロイとキャッシュの関係**
   - デプロイ完了後もブラウザキャッシュで古いコードが動作する
   - ハードリフレッシュやシークレットモードでテスト

5. **段階的な問題解決**
   - CORSエラー → プロキシ実装 → 配置場所エラー → 型定義エラー
   - 一つずつ確実に解決していく

---

## 📊 プロジェクト概要

### プロジェクト名
**Mitsulu Homepage（みつる ホームページ）**

### 目的
- 小規模組織・個人事業主向けのIT課題解決サービスの提供
- Webサイト制作、システム開発、業務効率化などの横断的サポート
- 手が回らないお困りごとを柔軟に解決する何でも屋としての活動

### 技術スタック
- **フレームワーク**: Next.js（React ベース）
- **言語**: TypeScript / JavaScript
- **スタイリング**: CSS Modules / Tailwind CSS（予定）
- **ホスティング**: Vercel
- **ドメイン**: mitsulu.style（Xserver で取得）
- **ソース管理**: GitHub

---

## 🚀 現在の構築状況

### ✅ 完了済み

1. **プロジェクトセットアップ**
   - [x] Next.js プロジェクト作成（2025年実施）
   - [x] Git リポジトリ初期化
   - [x] GitHub リポジトリ連携（`tokomaramuki1234/mitsulu-homepage`）
   - [x] 初回コミット & プッシュ完了

2. **デプロイ環境構築**
   - [x] Vercel アカウント連携（GitHub OAuth）
   - [x] Vercel プロジェクト作成
   - [x] 自動デプロイ設定完了
   - [x] 初回デプロイ成功（`https://mitsulu-homepage.vercel.app`）

3. **カスタムドメイン設定**
   - [x] Xserver でドメイン取得（`mitsulu.style`）
   - [x] Vercel にカスタムドメイン追加
   - [x] DNS レコード設定（A レコード: `216.198.79.1`）
   - [x] DNS レコード設定（CNAME レコード: `www` → `db6751fc8be97914.vercel-dns-017.com`）
   - [x] Xserver サーバーパネルで DNS 設定変更完了

### ✅ 完了済み（追加）

5. **静的LPサイト制作**
   - [x] 三流（Mitsulu）LPサイト設計
   - [x] HTML構造作成（セマンティック対応）
   - [x] CSS スタイルシート作成（フラット・モダンデザイン）
   - [x] JavaScript インタラクション実装
   - [x] レスポンシブデザイン対応（PC/タブレット/スマホ）
   - [x] アクセシビリティ対応（ARIA、キーボードナビゲーション）
   - [x] SEO 基本対策（メタタグ、構造化）

### ⏳ 今後の展開

6. **Next.js への統合**
   - [ ] 静的LPをNext.jsプロジェクトに統合
   - [ ] コンポーネント化
   - [ ] 動的コンテンツ機能追加

7. **追加ページ制作**
   - [ ] サービス詳細ページ
   - [ ] 実績・ポートフォリオページ
   - [ ] 料金プラン・お見積もりページ
   - [ ] よくある質問（FAQ）ページ
   - [ ] ブログ/お知らせ機能

8. **機能拡張**
   - [x] お問い合わせフォーム基本実装（PHP + React）
   - [ ] お問い合わせフォーム機能強化（reCAPTCHA追加等）
   - [ ] チャットボット導入検討
   - [ ] 事例紹介ギャラリー
   - [ ] お客様の声・レビュー機能
   - [ ] SNS 連携

---

## ⚠️ 重要：インフラ構成の理解（必読）

### 🚨 開発時の注意事項

このプロジェクトは **ハイブリッド構成** を採用しています：

#### **1. メインサイト：Vercel（Next.js）**
- **URL**: `https://mitsulu.style`
- **ホスティング**: Vercel
- **技術**: Next.js / React / TypeScript
- **DNS設定**: A レコード `@` → `216.198.79.1` (Vercel IP)
- **特徴**: 
  - ✅ Next.js アプリケーションが動作
  - ❌ **PHP は動作しない**
  - ❌ **直接 PHP ファイルをアップロードできない**

#### **2. フォームAPI：Xserver（PHP）**
- **URL**: `https://form.mitsulu.style`
- **ホスティング**: Xserver
- **技術**: PHP 8.3+
- **DNS設定**: A レコード `form` → Xserver IP
- **特徴**:
  - ✅ PHP が動作する
  - ✅ `mb_send_mail()` でメール送信可能
  - ✅ Xserver のメールサーバーを利用可能

#### **3. ドメイン管理：Xserver**
- **ドメイン**: `mitsulu.style`
- **DNS管理**: Xserver
- **特徴**:
  - ドメイン自体は Xserver で取得・管理
  - DNS レコードで振り分け先を制御
  - サブドメインも Xserver で設定可能

---

### ❌ よくある誤解と注意点

#### **誤解1: mitsulu.style に PHP ファイルをアップロードできる**
❌ **間違い**: `https://mitsulu.style/contact.php` にアクセスできる  
✅ **正解**: メインドメインは Vercel なので PHP は動作しない

#### **誤解2: Xserver に何もホストしていない**
❌ **間違い**: Xserver はドメイン管理だけで、ファイルはアップロードできない  
✅ **正解**: サブドメイン (`form.mitsulu.style`) を使えば Xserver に PHP をホストできる

#### **誤解3: Vercel で PHP が動く**
❌ **間違い**: Vercel に PHP ファイルをデプロイすれば動作する  
✅ **正解**: Vercel は Node.js ベース。PHP は動作しない（Serverless Functions を使う必要がある）

#### **誤解4: すべてのファイルを Xserver にアップロードする**
❌ **間違い**: Next.js のファイルを FTP で Xserver にアップロード  
✅ **正解**: Next.js は GitHub → Vercel の自動デプロイ。Xserver には PHP だけ

---

### ✅ 正しい開発フロー

#### **Next.js（メインサイト）を変更する場合**
```bash
# ローカルで編集
code components/ContactSection.tsx

# GitHub にプッシュ
git add .
git commit -m "Update contact section"
git push origin main

# Vercel が自動デプロイ（2〜5分）
# https://mitsulu.style に自動反映
```

#### **PHP（フォームAPI）を変更する場合**
```bash
# ローカルで編集
code contact.php

# FileZilla で Xserver にアップロード
# アップロード先: /mitsulu.style/public_html/form/contact.php
# パーミッション: 644

# すぐに反映
# https://form.mitsulu.style/contact.php
```

---

### 🔍 トラブルシューティング：環境の確認方法

#### **現在どのサーバーにアクセスしているか確認**

**方法1: ブラウザの開発者ツール**
```
F12 → Network タブ → ファイルをクリック → Headers
Response Headers を確認:
- server: Vercel → Vercel にアクセス中
- server: nginx → Xserver にアクセス中
```

**方法2: コマンドライン**
```bash
# Windows
nslookup mitsulu.style
# → 216.198.79.1 (Vercel)

nslookup form.mitsulu.style
# → Xserver IP
```

---

### 📊 DNS レコード一覧（重要）

| ホスト名 | 種別 | 値 | 接続先 | 用途 |
|----------|------|-----|--------|------|
| `@` (mitsulu.style) | A | `216.198.79.1` | **Vercel** | Next.js メインサイト |
| `www` | CNAME | `db6751fc8be97914.vercel-dns-017.com` | **Vercel** | www サブドメイン |
| `form` | A | Xserver IP | **Xserver** | PHP フォームAPI |

**ポイント**:
- メインドメイン (`mitsulu.style`) = Vercel
- サブドメイン (`form.mitsulu.style`) = Xserver
- 両方とも同じドメインだが、**別のサーバー**

---

### 🎯 今後の開発での注意点

#### **新しいAPI機能を追加する場合**

**選択肢1: Next.js API Routes（推奨）**
- Next.js の機能を使う
- ファイル: `/pages/api/xxx.ts`
- URL: `https://mitsulu.style/api/xxx`
- 言語: TypeScript / JavaScript
- 用途: データ取得、簡単な処理

**選択肢2: PHP（Xserver）**
- サブドメインを使う
- ファイル: `/form/xxx.php`
- URL: `https://form.mitsulu.style/xxx.php`
- 言語: PHP
- 用途: メール送信、既存PHP資産の活用

**選択肢3: 外部API**
- SendGrid, Formspree など
- サーバーレス
- 用途: 専門的な機能（メール、決済など）

---

## 🏗️ システム構成

### インフラ構成図（詳細版）

```
┌──────────────────────────────────────────────────────────────┐
│                    開発者（まことさん）                        │
│  ├─ ローカル環境（Next.js 開発）                              │
│  └─ Visual Studio Code / エディタ                            │
└──────────────────────────────────────────────────────────────┘
         ↓ git push                      ↓ FTP upload
         ↓                               ↓
┌─────────────────────────┐    ┌──────────────────────────────┐
│   GitHub                │    │   Xserver FTP                │
│   mitsulu-homepage      │    │   /form/contact.php          │
│   - Next.js ソース      │    │   - PHP ファイルのみ          │
│   - React コンポーネント │    └──────────────────────────────┘
└─────────────────────────┘              ↓
         ↓ Webhook                       ↓
         ↓                               ↓
┌─────────────────────────┐    ┌──────────────────────────────┐
│   Vercel                │    │   Xserver                    │
│   ホスティング           │    │   サブドメイン用             │
│   - 自動ビルド          │    │   - PHP 8.3 実行             │
│   - CDN 配信            │    │   - メール送信               │
│   - SSL 証明書          │    │   - mb_send_mail()           │
└─────────────────────────┘    └──────────────────────────────┘
         ↓                               ↓
         ↓                               ↓
┌──────────────────────────────────────────────────────────────┐
│                    DNS（Xserver 管理）                        │
│  ┌────────────────────────┐  ┌────────────────────────────┐ │
│  │ @ (mitsulu.style)      │  │ form.mitsulu.style         │ │
│  │ A → 216.198.79.1       │  │ A → Xserver IP             │ │
│  │ → Vercel へ            │  │ → Xserver へ               │ │
│  └────────────────────────┘  └────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
         ↓                               ↓
         ↓                               ↓
┌─────────────────────────┐    ┌──────────────────────────────┐
│   本番環境（Next.js）    │    │   本番環境（PHP）             │
│   https://mitsulu.style │    │   https://form.mitsulu.style │
│   - トップページ        │    │   - contact.php              │
│   - サービス紹介        │    │   - メール送信API            │
│   - お問い合わせUI      │────┼──→ フォーム送信先          │
└─────────────────────────┘    └──────────────────────────────┘

【重要ポイント】
✅ mitsulu.style = Vercel（Next.js）← PHPは動かない！
✅ form.mitsulu.style = Xserver（PHP）← PHPが動く！
✅ 両方とも DNS は Xserver で管理
✅ ドメインは同じだが、サーバーは別物
```

---

## 🔧 DNS 設定詳細

### Xserver DNS レコード

| ホスト名 | 種別 | 値 | TTL | 用途 |
|----------|------|----|-----|------|
| @ (mitsulu.style) | A | 216.198.79.1 | 3600 | メインドメイン → Vercel |
| www | CNAME | db6751fc8be97914.vercel-dns-017.com | 3600 | www サブドメイン → Vercel |

### Vercel 側設定

- **プロジェクト名**: mitsulu-homepage
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x（デフォルト）

---

## 🔄 自動デプロイフロー

### Git Push からデプロイまで

```
1. ローカルでコード編集
   ↓
2. git add . && git commit -m "メッセージ"
   ↓
3. git push origin main
   ↓
4. GitHub にコードが反映
   ↓
5. Vercel が自動検知（Webhook）
   ↓
6. 自動ビルド開始
   ├─ 依存関係インストール（npm install）
   ├─ Next.js ビルド（npm run build）
   └─ 静的ファイル生成
   ↓
7. デプロイ完了（通常 1〜3 分）
   ↓
8. https://mitsulu.style に自動反映
```

**所要時間**: コミットから本番反映まで約 2〜5 分

---

## 📁 プロジェクト構造

```
mitsulu-homepage/
├── .next/                  # Next.js ビルド出力（自動生成）
├── node_modules/           # 依存パッケージ（自動生成）
├── pages/                  # ページコンポーネント（Next.js）
│   ├── _app.tsx           # アプリケーションルート
│   ├── _document.tsx      # HTML ドキュメント設定
│   ├── index.tsx          # トップページ（/）
│   └── api/               # API ルート（サーバーレス関数）
├── public/                 # 静的ファイル（画像、フォントなど）
│   ├── favicon.ico
│   └── images/
│       └── topimg.svg     # ヒーローセクションのロゴ画像
├── styles/                 # スタイルシート（Next.js用）
│   ├── globals.css        # グローバルスタイル
│   └── Home.module.css    # モジュール CSS
├── components/             # React コンポーネント ✨
│   ├── HeroSection.tsx            # ヒーローセクション
│   ├── ServicesSection.tsx        # サービス一覧（7カテゴリ）
│   ├── ProposalsSection.tsx       # 提案例（10項目）
│   ├── ConcernsSection.tsx        # お悩み事例（50項目、アコーディオン）
│   ├── PhilosophySection.tsx      # 三流の哲学
│   ├── ContactSection.tsx         # お問い合わせ
│   ├── Footer.tsx                 # フッター
│   ├── ScrollProgress.tsx         # スクロール進行状況バー
│   └── BackToTop.tsx              # トップへ戻るボタン
├── hooks/                  # カスタムフック ✨NEW
│   └── useIntersectionObserver.ts # スクロールアニメーション用
├── css/                    # 静的LPサイト用CSS（アーカイブ）
│   └── style.css          # 三流LPスタイルシート
├── js/                     # 静的LPサイト用JavaScript（アーカイブ）
│   └── main.js            # インタラクション・アニメーション
├── index.html             # 静的LPサイト（三流、アーカイブ）
├── contact.php            # お問い合わせフォームAPI（Xserver用）✨NEW
├── fixlist.md             # LP改善提案書 ✨NEW
├── CONTACT_FORM_SETUP.md  # お問い合わせフォーム完全セットアップガイド ✨NEW
├── .gitignore             # Git 除外設定
├── package.json           # 依存関係定義
├── package-lock.json      # 依存関係ロックファイル
├── tsconfig.json          # TypeScript 設定
├── next.config.js         # Next.js 設定
└── README.md              # このファイル
```

### 静的LPサイト仕様

**ファイル**: `index.html`, `css/style.css`, `js/main.js`

- **コンセプト**: 「三流」= 一流・二流ではない、身の丈に合った実用的なアプローチ
- **デザイン**: フラット・シンプル・モダン
- **技術**: HTML5 + CSS3 + Vanilla JavaScript
- **フォント**: Noto Sans JP (Google Fonts)
- **アイコン**: Font Awesome 6.4.0
- **レスポンシブ**: PC/タブレット/スマホ完全対応
- **アニメーション**: Intersection Observer API
- **アクセシビリティ**: ARIA、キーボードナビゲーション対応

---

## 🎯 今後の開発計画

### Phase 1: サイト基盤構築（完了予定: DNS 反映後すぐ）

- [x] Next.js プロジェクトセットアップ
- [x] GitHub リポジトリ作成
- [x] Vercel デプロイ環境構築
- [ ] DNS 反映完了確認
- [ ] HTTPS アクセス確認
- [ ] 基本的なページ構成設計

### Phase 2: コンテンツ制作（1〜2週間）

#### トップページ
- [ ] ヒーローセクション（キービジュアル + キャッチコピー）
- [ ] サービス紹介セクション（7つの主要サービス）
- [ ] 提案例セクション（具体的な解決事例）
- [ ] お悩み事例セクション（50項目のFAQ）
- [ ] 三流の哲学セクション
- [ ] お問い合わせセクション
- [ ] フッター（SNS リンク、お問い合わせ）

#### サブページ
- [ ] About（サービス概要・理念）
- [ ] Services（サービス詳細）
- [ ] Portfolio（実績紹介）
- [ ] Pricing（料金プラン）
- [ ] FAQ（よくある質問）
- [ ] Contact（お問い合わせ）

### Phase 3: 機能拡張（2〜4週間）

- [ ] ブログ機能（Markdown ベース）
- [ ] 実績紹介ギャラリー（ポートフォリオ）
- [ ] お客様の声・レビュー機能
- [ ] お問い合わせフォーム（FormSpree/Netlify Forms）
- [ ] 料金シミュレーター
- [ ] Google Analytics 導入
- [ ] SEO 最適化（メタタグ、OGP 設定）

### Phase 4: マーケティング・運用（継続）

- [ ] SNS 連携・シェアボタン
- [ ] お問い合わせ導線の最適化
- [ ] Google Search Console 登録
- [ ] パフォーマンス最適化
- [ ] アクセス解析・改善
- [ ] コンテンツマーケティング（ブログ記事執筆）

---

## 💻 開発環境

### 必要なツール

- **Node.js**: v18.x 以上
- **npm**: v9.x 以上
- **Git**: v2.x 以上
- **エディタ**: Visual Studio Code（推奨）

### ローカル開発サーバー起動

```bash
# プロジェクトディレクトリに移動
cd mitsulu-homepage

# 依存パッケージインストール（初回のみ）
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
```

### ビルド・デプロイ

```bash
# 本番用ビルド
npm run build

# 本番サーバー起動（ローカルテスト）
npm run start

# GitHub にプッシュ（自動デプロイ）
git add .
git commit -m "Update content"
git push origin main
```

---

## 📚 技術ドキュメント

### 参考リンク

- **Next.js 公式**: https://nextjs.org/docs
- **Vercel 公式**: https://vercel.com/docs
- **React 公式**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs（導入予定）

### 重要な設定ファイル

#### `package.json` スクリプト
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

#### `next.config.js` 基本設定
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // 外部画像ドメイン
  },
}

module.exports = nextConfig
```

---

## 🐛 トラブルシューティング

### DNS が反映されない場合

```bash
# DNS キャッシュクリア（Windows）
ipconfig /flushdns

# DNS 確認
nslookup mitsulu.style 8.8.8.8

# オンラインで確認
# https://www.whatsmydns.net/ で mitsulu.style を検索
```

### ビルドエラーが出る場合

```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュをクリアしてビルド
npm run build -- --no-cache
```

### Vercel デプロイが失敗する場合

1. Vercel ダッシュボードで **Deployments** タブを開く
2. 失敗したデプロイをクリック
3. **Build Logs** でエラー内容を確認
4. エラーに応じて修正 → GitHub に push

---

## 📞 お問い合わせ・サポート

### プロジェクト管理者
- **サービス名**: Mitsulu（三流）
- **コンセプト**: 小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん
- **提供サービス**: Webサイト制作、システム開発、業務効率化、IT相談など

### 関連リンク
- **GitHub**: https://github.com/tokomaramuki1234
- **本サイト**: https://mitsulu.style

---

## 📄 ライセンス

このプロジェクトは個人プロジェクトです。
商用利用・再配布については管理者にお問い合わせください。

---

## 🎉 謝辞

- **Vercel**: 無料ホスティングサービスの提供
- **Next.js コミュニティ**: 優れたフレームワークの開発
- **Xserver**: ドメイン管理サービス
- **GitHub**: ソースコード管理プラットフォーム

---

## 📝 更新履歴

### 2025-10-22（初日）
- ✅ Next.js プロジェクト作成
- ✅ GitHub リポジトリ初期化・初回プッシュ
- ✅ Vercel プロジェクト作成・初回デプロイ
- ✅ カスタムドメイン `mitsulu.style` 追加
- ✅ Xserver で DNS レコード設定（A レコード、CNAME レコード）
- ✅ DNS 反映完了（`mitsulu.style` が Valid Configuration に）
- 📝 プロジェクト README.md 作成

### 2025-10-22（同日・LP制作 - 静的版）
- ✅ 三流（Mitsulu）LP サイト設計書作成
- ✅ 静的HTML/CSS/JavaScript実装
  - ✅ Hero セクション（キャッチコピー + CTA）
  - ✅ サービス一覧（7項目、指定カラー適用）
  - ✅ 提案例セクション（10の具体例）
  - ✅ お悩み事例（50項目、アコーディオン形式）
  - ✅ 哲学セクション（三流の価値）
  - ✅ お問い合わせセクション
  - ✅ フッター（SNS、著作権表示）
- ✅ レスポンシブデザイン実装（PC/タブレット/スマホ）
- ✅ スクロールアニメーション実装
- ✅ アクセシビリティ対応

### 2025-10-22（同日・React版への変換）
- ✅ 静的HTMLをReact/Next.jsコンポーネントに変換
- ✅ TypeScript対応
- ✅ コンポーネント分割（9個のReactコンポーネント）
  - ✅ `HeroSection.tsx`
  - ✅ `ServicesSection.tsx`
  - ✅ `ProposalsSection.tsx`
  - ✅ `ConcernsSection.tsx`
  - ✅ `PhilosophySection.tsx`
  - ✅ `ContactSection.tsx`
  - ✅ `Footer.tsx`
  - ✅ `ScrollProgress.tsx`
  - ✅ `BackToTop.tsx`
- ✅ カスタムフック作成（`useIntersectionObserver.ts`）
- ✅ CSS Modules対応（`Home.module.css`）
- ✅ グローバルスタイル更新（`globals.css`）

### 2025-10-22（同日・デザイン大幅リニューアル）
- ✅ **デザイン方針の変更**
  - 自己卑下表現を削除し、ポジティブなメッセージに変更
  - CMYKインスパイアから具体的なブランドカラーパレットへ移行
  - フラットデザイン徹底（カードレイアウト、シャドウ、グラデーションを排除）
- ✅ **カラーパレット定義**
  - Main Colors: Yellow (#EAE33C), Cyan (#248EC6), Magenta (#CD2272)
  - Semi-main Colors: Black (#0A0F0F), White (#FFFFFF)
  - Sub Colors: Navy (#1B2B59), Red (#D1221A), Green (#208B3B)
- ✅ **HeroSection リデザイン**
  - 左右分割レイアウトから中央配置単一カラムへ変更
  - ヒーロータイトル・サブタイトル削除、ロゴとCTAボタンのみに簡素化
  - ロゴ画像サイズを70%→50%に縮小
  - 背景色を#FFFFFFに統一
- ✅ **ServicesSection 更新**
  - 全7サービスに新カラーパレット適用
  - カラー配置: Cyan, Magenta, Yellow, Black, Navy, Red, Green
- ✅ **ConcernsSection 再構成**
  - 5カテゴリから7カテゴリへ拡張（ServicesSection と統一）
  - "(〇〇項目)" ラベル削除
  - 各カテゴリにServicesと同じカラーを適用（アイコンの色統一）
  - インラインスタイルでアイコンに色を適用
- ✅ **ProposalsSection コピー改善**
  - タイトル変更: "三流だからできること" → "三流の強み ― 横断的なサポート"
  - 自己卑下的な説明文をジェネラリストの強みを強調する内容に変更
- ✅ **Footer リニューアル**
  - タグライン変更: "深くはない。ただ、広い。" → "幅広く、柔軟に、あなたをサポート。"
  - 右側セクション追加（キーフレーズ表示）
  - 背景色を#0A0F0Fに変更
- ✅ **CSS全体最適化**
  - フラットデザイン徹底（box-shadow削除、border-radius簡素化）
  - 全カラー参照を新パレットに更新
  - CSS Module内のユニバーサルセレクタ（*）削除（ビルドエラー解消）
  - レスポンシブデザイン維持

### 2025-10-22（同日・LP専門分析・改善提案）
- ✅ **プロフェッショナルLP分析実施**
  - 全ページを4つの優先度レベルで評価（Critical, Major, Moderate, Minor）
  - 23項目の具体的な課題を洗い出し
  - 各課題に対する詳細な改善案・実装コード例を作成
- ✅ **fixlist.md 作成**（`/fixlist.md`）
  - 📋 **エグゼクティブサマリー**: 現状評価と推奨アクション
  - 🔴 **Critical Issues（3項目）**: 
    - ヒーローセクションCTA弱化
    - コンバージョンポイント不足（1箇所のみ）
    - スティッキーCTAボタンの欠如
  - 🟠 **Major Issues（6項目）**:
    - 実績・導入事例の不明瞭さ
    - お客様の声の欠如
    - 50項目お悩み事例の冗長性
    - 料金感の不透明性
    - モバイルUX問題（タップ領域・フォントサイズ）
  - 🟡 **Moderate Issues（5項目）**:
    - セクションタイトル、ビジュアルヒエラルキー、ナビゲーション、等
  - 🟢 **Minor Issues（6項目）**:
    - マイクロコピー、パフォーマンス、SEO、アクセシビリティ
  - 📝 **具体的な実装コード例**（TypeScript/React, CSS）
  - 🗓️ **3段階実装ロードマップ**:
    - Phase 1: クイックウィン（1週間、9時間）→ CV率+30〜50%
    - Phase 2: 信頼構築（2〜3週間、38時間）→ 問い合わせ率+20〜30%
    - Phase 3: UX最適化（1〜2ヶ月、70時間）→ 総合改善
  - 📈 **KPI設定とメトリクス**: コンバージョン率、直帰率、滞在時間等の目標値
- ✅ **GitHub へプッシュ完了**
  - コミットハッシュ: `5eb0941`
  - ブランチ: `main`

### 2025-10-24（お問い合わせフォーム完全実装）
- ✅ **お問い合わせフォーム完全実装**
  - **React フロントエンド更新** (`components/ContactSection.tsx`)
    - エラーハンドリング強化（通信エラー時の詳細メッセージ）
    - 送信成功時のスクロール位置自動調整
    - 成功メッセージの詳細化（確認メール案内、注意事項追加）
    - 「新しいお問い合わせ」ボタン追加
  - **PHP バックエンド完全実装** (`contact.php`)
    - Xserver へアップロード完了 (`/mitsulu.style/public_html/form/contact.php`)
    - 日本時間タイムゾーン設定
    - 管理者通知メール送信 (`mk@mitsulu.style`)
    - 自動返信メール送信 (`noreply@mitsulu.style`)
    - 詳細なエラーログ機能実装
    - バリデーション強化（サーバーサイド）
  - **CSS スタイル追加** (`styles/Home.module.css`)
    - `.noteText` - 注意事項テキストスタイル
    - `.newInquiryButton` - 新規お問い合わせボタン
    - ホバーエフェクト、アニメーション追加
  - **完全セットアップガイド作成** (`CONTACT_FORM_SETUP.md`)
    - システム構成図
    - セットアップ手順（Xserver、DNS、GitHub、Vercel）
    - **SPF レコード設定詳細手順**
    - 動作テスト手順（4種類のテストケース）
    - トラブルシューティング完全版
    - よくある質問（FAQ）
    - 完了チェックリスト
- ✅ **DNS レコード情報修正**
  - www CNAME レコード値を正確な値に更新
    - 誤: `cname.vercel-dns.com`
    - 正: `db6751fc8be97914.vercel-dns-017.com`
  - `README.md` と `CONTACT_FORM_SETUP.md` の4箇所を修正
- ✅ **SPF レコード確認**
  - Xserver で既に適切に設定済みを確認
  - 迷惑メール判定対策完了

### 📱 PC作業待ち（iPhone操作中のため）
- [ ] **Gensparkで作成したReactファイルをローカルにダウンロード**
- [ ] **ローカルリポジトリに配置**
- [ ] **GitHub へプッシュ**
- [ ] **Vercel で自動デプロイ確認**
- [ ] **https://mitsulu.style で動作確認**

### 今後の拡張予定
- [x] お問い合わせフォーム基本実装（PHP + React）
- [x] SPF レコード設定（迷惑メール対策）
- [ ] サービス詳細ページ追加
- [ ] 実績紹介ページ追加
- [ ] ブログ機能実装
- [ ] お問い合わせフォーム機能強化（reCAPTCHA、入力内容保存等）
- [ ] 料金プラン・見積もり機能
- [ ] **fixlist.md に記載された改善項目の段階的実装**（優先度順）

---

**Last Updated**: 2025-10-24
**Version**: 0.6.0 (Contact Form Implementation Completed)
**Status**: ✅ お問い合わせフォーム完全実装完了（PHP + React） → 🚀 デプロイ準備完了（GitHub Push待ち）

---

## 📊 LP改善提案について（fixlist.md）

### 概要

**fixlist.md** は、現在のランディングページの包括的な分析結果と改善ロードマップを記載したドキュメントです。

### 主な内容

#### 📋 課題の分類（23項目）

**🔴 Critical（緊急・必須） - 3項目**
1. ヒーローセクションのCTA弱化
2. コンバージョンポイントが1箇所のみ
3. スティッキーCTAボタンの欠如

**🟠 Major（重要・早急対応） - 6項目**
1. 実績・導入事例の不明瞭さ
2. お客様の声の欠如
3. 50項目お悩み事例の冗長性
4. 料金感の不透明性
5. モバイルタップ領域が小さい
6. フォントサイズが小さい箇所がある

**🟡 Moderate（改善推奨） - 5項目**
- セクションタイトル、ビジュアルヒエラルキー、ナビゲーション、等

**🟢 Minor（長期改善） - 6項目**
- マイクロコピー、パフォーマンス、SEO、アクセシビリティ、等

#### 🗓️ 実装ロードマップ

**Phase 1: クイックウィン（1週間、9時間）**
- ヒーローCTA強化
- スティッキーCTA追加
- 各セクション末尾にCTA追加
- モバイルUX改善
- **期待効果**: コンバージョン率 +30〜50%

**Phase 2: 信頼構築（2〜3週間、38時間）**
- お客様の声セクション追加
- 実績サマリー追加
- 料金目安セクション追加
- 導入事例ページ作成
- **期待効果**: 問い合わせ率 +20〜30%

**Phase 3: UX最適化（1〜2ヶ月、70時間）**
- ヘッダーナビゲーション追加
- サービス詳細ページ作成
- 簡易診断ツール実装
- お問い合わせフォーム強化
- 画像最適化・SEO対策
- **期待効果**: 総合的なユーザー体験向上

#### 📈 設定されたKPI目標

- **コンバージョン率**: 3〜5%
- **直帰率**: 50%以下
- **平均ページ滞在時間**: 3分以上
- **モバイルコンバージョン率**: 2〜4%
- **CTAクリック率**: 10%以上
- **ページ読み込み速度**: 2秒以下

### 活用方法

1. **優先度順に実装**: Critical → Major → Moderate → Minor
2. **効果測定**: Google Analytics、Hotjar等でKPI追跡
3. **A/Bテスト**: 改善前後の比較検証
4. **継続的改善**: データに基づいた段階的改善

### 次のアクション

- [ ] Google Analytics 4 設置（未設置の場合）
- [ ] ベースラインKPI測定開始
- [ ] Phase 1タスクの優先順位決定・実装開始

---

## 🚀 クイックスタート

### Next.js開発環境

```bash
# リポジトリをクローン
git clone https://github.com/tokomaramuki1234/mitsulu-homepage.git
cd mitsulu-homepage

# 依存パッケージインストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
```

### 静的LPサイトのプレビュー

```bash
# プロジェクトルートで index.html を開く
# または Live Server などを使用

# Python の簡易サーバー（Python 3）
python -m http.server 8000

# ブラウザで http://localhost:8000 にアクセス
```

---

## 📥 PC作業時の統合手順（重要）

### ⚠️ 現在の状態
- Gensparkで**React/Next.jsコンポーネント完成**
- iPhone操作中のため**ローカルダウンロード未実施**
- PC作業時に以下の手順で統合が必要

---

### Step 1: Gensparkからファイルをダウンロード

**必須ファイル（React版）**:
```
pages/
  └── index.tsx                      ← メインページ

components/                          ← 新規フォルダ
  ├── HeroSection.tsx
  ├── ServicesSection.tsx
  ├── ProposalsSection.tsx
  ├── ConcernsSection.tsx
  ├── PhilosophySection.tsx
  ├── ContactSection.tsx
  ├── Footer.tsx
  ├── ScrollProgress.tsx
  └── BackToTop.tsx

hooks/                               ← 新規フォルダ
  └── useIntersectionObserver.ts

styles/
  ├── Home.module.css                ← 上書き
  └── globals.css                    ← 上書き

README.md                            ← 上書き
```

---

### Step 2: ローカルに配置

```bash
# プロジェクトディレクトリに移動
cd C:\Users\tokomaramuki1234\Documents\W09-三悦\mitsulu-web\mitsulu-homepage

# フォルダ構成を確認
# ダウンロードしたファイルを適切な場所にコピー
```

**配置場所**:
- `pages/index.tsx` → `pages/` フォルダに上書き
- `components/*.tsx` → `components/` フォルダに配置（新規作成）
- `hooks/*.ts` → `hooks/` フォルダに配置（新規作成）
- `styles/*.css` → `styles/` フォルダに上書き

---

### Step 3: 依存関係の確認

```bash
# プロジェクトディレクトリで
npm install

# TypeScriptの型定義が必要な場合
npm install --save-dev @types/react @types/node
```

---

### Step 4: ローカルテスト

```bash
# 開発サーバー起動
npm run dev

# ブラウザで確認
# http://localhost:3000
```

**確認ポイント**:
- ✅ ページが正常に表示される
- ✅ スクロールアニメーションが動作する
- ✅ アコーディオンが開閉する
- ✅ レスポンシブデザインが機能する（ブラウザサイズ変更）
- ✅ コンソールエラーがない

---

### Step 5: Git コミット & プッシュ

```bash
# 変更を確認
git status

# すべての新規・変更ファイルを追加
git add .

# コミット
git commit -m "Convert static LP to React/Next.js components

- Add 9 React components for all LP sections
- Add custom hook for scroll animations (useIntersectionObserver)
- Update styles to CSS Modules
- Full TypeScript support
- Maintain all original features: animations, accordion, responsive design
- SEO optimization with Next.js Head"

# GitHub にプッシュ
git push origin main
```

---

### Step 6: Vercel 自動デプロイ確認

プッシュ後、自動的に：

1. **Vercel が変更検知** → Webhook トリガー
2. **ビルド開始** → `npm run build`
3. **デプロイ完了** → 2〜5分

**確認URL**:
- Vercel ダッシュボード: https://vercel.com/tokomaramukis-projects/mitsulu-homepage
- 本番サイト: https://mitsulu.style

---

### Step 7: 本番確認

https://mitsulu.style にアクセスして最終確認:
- ✅ React版LPが表示される
- ✅ すべての機能が動作する
- ✅ HTTPS で安全に接続される
- ✅ レスポンシブデザインが機能する（スマホ/タブレット/PC）

---

### 🆘 トラブルシューティング

#### **ビルドエラーが出る場合**

```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュをクリアしてビルド
npm run build
```

#### **TypeScriptエラーが出る場合**

```bash
# 型定義を追加
npm install --save-dev @types/react @types/node

# tsconfig.json を確認
# "strict": false に変更してビルドを試す
```

#### **Vercelデプロイが失敗する場合**

1. Vercel ダッシュボード → **Deployments** タブ
2. 失敗したデプロイをクリック
3. **Build Logs** でエラー内容を確認
4. エラーに応じて修正 → 再度 push

---

**開発を始める準備が整いました！** 🎊
