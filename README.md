# Mitsulu Homepage

> 小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん

## 🌐 公式URL

- **本番環境**: https://mitsulu.style
- **Vercel デフォルト URL**: https://mitsulu-homepage.vercel.app
- **GitHub リポジトリ**: https://github.com/tokomaramuki1234/mitsulu-homepage

---

## 📊 プロジェクト概要

### プロジェクト名
**Mitsulu Homepage（みつる ホームページ）**

### 目的
- 小規模組織・個人事業主向けのIT課題解決サービスの提供
- Webサイト制作、システム開発、業務効率化などの横断的サポート
- 一流・二流ではない「三流」の視点から、身の丈に合った実用的なソリューションを提案
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
   - [x] DNS レコード設定（CNAME レコード: `www` → `cname.vercel-dns.com`）
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
   - [ ] お問い合わせフォーム機能強化
   - [ ] チャットボット導入検討
   - [ ] 事例紹介ギャラリー
   - [ ] お客様の声・レビュー機能
   - [ ] SNS 連携

---

## 🏗️ システム構成

### インフラ構成図

```
┌─────────────────────────────────────────┐
│ 開発者（まことさん）                     │
│ ├─ ローカル環境（Next.js 開発）          │
│ └─ Visual Studio Code / エディタ        │
└─────────────────────────────────────────┘
              ↓ git push
┌─────────────────────────────────────────┐
│ GitHub                                  │
│ └─ tokomaramuki1234/mitsulu-homepage    │
│    ├─ main ブランチ                     │
│    └─ ソースコード管理                   │
└─────────────────────────────────────────┘
              ↓ Webhook（自動デプロイ）
┌─────────────────────────────────────────┐
│ Vercel（ホスティング）                   │
│ ├─ 自動ビルド（Next.js）                │
│ ├─ CDN 配信（グローバル）               │
│ ├─ SSL 証明書自動発行                   │
│ └─ https://mitsulu-homepage.vercel.app  │
└─────────────────────────────────────────┘
              ↓ カスタムドメイン
┌─────────────────────────────────────────┐
│ DNS（Xserver）                          │
│ ├─ A レコード: @ → 216.198.79.1        │
│ └─ CNAME: www → cname.vercel-dns.com   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 本番環境                                │
│ └─ https://mitsulu.style                │
└─────────────────────────────────────────┘
```

---

## 🔧 DNS 設定詳細

### Xserver DNS レコード

| ホスト名 | 種別 | 値 | TTL | 用途 |
|----------|------|----|-----|------|
| @ (mitsulu.style) | A | 216.198.79.1 | 3600 | メインドメイン → Vercel |
| www | CNAME | cname.vercel-dns.com | 3600 | www サブドメイン → Vercel |

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
├── styles/                 # スタイルシート（Next.js用）
│   ├── globals.css        # グローバルスタイル
│   └── Home.module.css    # モジュール CSS
├── components/             # React コンポーネント（今後追加）
├── css/                    # 静的LPサイト用CSS ✨NEW
│   └── style.css          # 三流LPスタイルシート
├── js/                     # 静的LPサイト用JavaScript ✨NEW
│   └── main.js            # インタラクション・アニメーション
├── index.html             # 静的LPサイト（三流）✨NEW
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

### 📱 PC作業待ち（iPhone操作中のため）
- [ ] **Gensparkで作成したReactファイルをローカルにダウンロード**
- [ ] **ローカルリポジトリに配置**
- [ ] **GitHub へプッシュ**
- [ ] **Vercel で自動デプロイ確認**
- [ ] **https://mitsulu.style で動作確認**

### 今後の拡張予定
- [ ] サービス詳細ページ追加
- [ ] 実績紹介ページ追加
- [ ] ブログ機能実装
- [ ] お問い合わせフォーム機能強化
- [ ] 料金プラン・見積もり機能

---

**Last Updated**: 2025-10-22  
**Version**: 0.3.0 (React/Next.js Conversion Completed)  
**Status**: ✅ React版完成 → 📱 PC作業待ち（ローカル統合→GitHub Push）

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
- Vercel ダッシュボード: https://vercel.com/tokomaramuki1234/mitsulu-homepage
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
