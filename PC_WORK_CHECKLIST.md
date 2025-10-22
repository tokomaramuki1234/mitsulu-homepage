# 📋 PC作業チェックリスト

> **作成日**: 2025-10-22  
> **作成者**: iPhone（Genspark経由）  
> **作業対象**: React/Next.js版 三流LPサイトの統合

---

## 🎯 目的

Gensparkで作成したReact/Next.jsコンポーネントをローカルリポジトリに統合し、GitHub経由でVercelにデプロイする。

---

## ✅ 作業チェックリスト

### **Phase 1: ダウンロード準備**

- [ ] PCでGensparkにアクセス
- [ ] プロジェクト「mitsulu-homepage」を開く
- [ ] 以下のファイルが存在することを確認

#### **必須ファイル一覧**

**Reactコンポーネント（9個）**:
- [ ] `components/HeroSection.tsx`
- [ ] `components/ServicesSection.tsx`
- [ ] `components/ProposalsSection.tsx`
- [ ] `components/ConcernsSection.tsx`
- [ ] `components/PhilosophySection.tsx`
- [ ] `components/ContactSection.tsx`
- [ ] `components/Footer.tsx`
- [ ] `components/ScrollProgress.tsx`
- [ ] `components/BackToTop.tsx`

**カスタムフック**:
- [ ] `hooks/useIntersectionObserver.ts`

**ページコンポーネント**:
- [ ] `pages/index.tsx`

**スタイルシート**:
- [ ] `styles/Home.module.css`
- [ ] `styles/globals.css`

**ドキュメント**:
- [ ] `README.md`（更新版）
- [ ] `PC_WORK_CHECKLIST.md`（このファイル）

---

### **Phase 2: ローカル統合**

- [ ] VSCodeまたはエディタを開く
- [ ] プロジェクトフォルダを開く
  ```
  C:\Users\tokomaramuki1234\Documents\W09-三悦\mitsulu-web\mitsulu-homepage
  ```

#### **フォルダ作成**
- [ ] `components/` フォルダを作成（存在しない場合）
- [ ] `hooks/` フォルダを作成（存在しない場合）

#### **ファイル配置**
- [ ] `pages/index.tsx` を配置（上書き）
- [ ] `components/` に9個のコンポーネントを配置
- [ ] `hooks/` にカスタムフックを配置
- [ ] `styles/Home.module.css` を配置（上書き）
- [ ] `styles/globals.css` を配置（上書き）
- [ ] `README.md` を配置（上書き）

---

### **Phase 3: 依存関係確認**

ターミナル/PowerShellで以下を実行:

```bash
cd mitsulu-homepage
npm install
```

- [ ] `npm install` が正常完了
- [ ] エラーメッセージがない

**TypeScript型定義が必要な場合**:
```bash
npm install --save-dev @types/react @types/node
```

- [ ] 型定義インストール完了

---

### **Phase 4: ローカルテスト**

```bash
npm run dev
```

- [ ] 開発サーバーが起動
- [ ] `http://localhost:3000` にアクセス
- [ ] ページが正常に表示される
- [ ] コンソールエラーがない

#### **動作確認項目**

**基本表示**:
- [ ] Heroセクション表示
- [ ] サービスカード（7個）表示
- [ ] 提案例（10個）表示
- [ ] お悩み事例アコーディオン表示
- [ ] 哲学セクション表示
- [ ] お問い合わせセクション表示
- [ ] フッター表示

**インタラクション**:
- [ ] スクロールアニメーション動作
- [ ] アコーディオン開閉動作
- [ ] ホバーエフェクト動作
- [ ] CTAボタンクリック動作
- [ ] トップに戻るボタン表示・動作
- [ ] スクロール進捗バー表示

**レスポンシブ**:
- [ ] PCビュー（1200px以上）正常
- [ ] タブレットビュー（768-1199px）正常
- [ ] スマホビュー（767px以下）正常

**ブラウザ開発者ツール確認**:
- [ ] JavaScriptエラーなし
- [ ] CSSエラーなし
- [ ] 404エラーなし

---

### **Phase 5: Git コミット**

```bash
# 状態確認
git status

# すべて追加
git add .

# コミット
git commit -m "Convert static LP to React/Next.js components

- Add 9 React components for all LP sections
- Add custom hook for scroll animations (useIntersectionObserver)
- Update styles to CSS Modules
- Full TypeScript support
- Maintain all original features: animations, accordion, responsive design
- SEO optimization with Next.js Head"
```

- [ ] `git add .` 実行完了
- [ ] `git commit` 実行完了
- [ ] コミットメッセージ確認

---

### **Phase 6: GitHub プッシュ**

```bash
git push origin main
```

- [ ] プッシュ成功
- [ ] エラーメッセージなし

**GitHubで確認**:
- [ ] https://github.com/tokomaramuki1234/mitsulu-homepage にアクセス
- [ ] 最新のコミットが表示される
- [ ] 新規ファイルが表示される（components/, hooks/）

---

### **Phase 7: Vercel デプロイ確認**

- [ ] Vercel ダッシュボードにアクセス
  - https://vercel.com/tokomaramuki1234/mitsulu-homepage
- [ ] 「Deployments」タブを開く
- [ ] 新しいデプロイが開始されている
- [ ] ビルドログを確認（エラーなし）
- [ ] デプロイ完了（通常2〜5分）

**デプロイステータス**:
- [ ] ビルド開始
- [ ] ビルド進行中
- [ ] ビルド成功
- [ ] デプロイ完了

---

### **Phase 8: 本番確認**

- [ ] https://mitsulu.style にアクセス
- [ ] ページが表示される
- [ ] HTTPSで接続される（🔒マーク）
- [ ] すべての機能が動作する

#### **本番環境確認項目**

**基本動作**:
- [ ] ページ読み込み速度が速い
- [ ] 画像が正常に表示される
- [ ] アニメーションがスムーズ
- [ ] アコーディオンが動作する
- [ ] ボタンが動作する

**レスポンシブ（実機確認）**:
- [ ] iPhone/スマホで表示確認
- [ ] タブレットで表示確認
- [ ] PCで表示確認

**SEO確認**:
- [ ] ページタイトル正常
- [ ] メタディスクリプション正常
- [ ] OGPタグ確認（可能であれば）

---

## 🎉 完了確認

すべてのチェックが完了したら:

- [ ] スクリーンショットを撮影（PC/スマホ）
- [ ] 動作確認動画を撮影（オプション）
- [ ] 作業完了報告

---

## 🆘 トラブルシューティング

### **問題A: ビルドエラー**

```bash
# node_modules 再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **問題B: TypeScriptエラー**

```bash
# 型定義追加
npm install --save-dev @types/react @types/node

# tsconfig.json を確認
# "strict": false に変更してテスト
```

### **問題C: Vercel デプロイ失敗**

1. Vercel の Build Logs を確認
2. エラーメッセージをコピー
3. 該当箇所を修正
4. 再度 `git push`

### **問題D: 画像が表示されない**

- via.placeholder.com の画像を実際の画像に差し替え
- Next.js Image コンポーネントの使用を検討

---

## 📝 作業メモ

**作業開始時刻**: __________

**作業完了時刻**: __________

**発生した問題**:


**解決方法**:


**その他メモ**:


---

**作成者より**: このチェックリストに従って作業すれば、スムーズにReact版LPサイトをデプロイできます。不明な点があれば README.md を参照してください。頑張ってください！🚀
