# メール送信設定ガイド

## 現在の問題

### 問題1: 迷惑メールフォルダに届く
**原因**: SPFレコードが未設定または不十分

### 問題2: メール本文が文字化け（???????表示）
**原因**: PHPの文字エンコーディング設定が不足

**✅ 解決済み**: `mb_language('Japanese')` と `mb_internal_encoding('UTF-8')` を追加

---

## SPFレコード設定（迷惑メール対策）

### SPFとは？

**SPF (Sender Policy Framework)**: 送信元メールサーバーを認証する仕組み

- メール送信者が正当であることを証明
- 迷惑メール判定を回避
- メール到達率を向上

### 設定方法

#### 1. Xserverサーバーパネルにログイン

https://www.xserver.ne.jp/login_server.php

#### 2. DNSレコード設定に移動

```
ドメイン → DNSレコード設定 → mitsulu.style を選択
```

#### 3. 既存のSPFレコードを確認

**ホスト名: @（または空欄）**
**種別: TXT**

既存の値を確認（例: `v=spf1 +a:sv12345.xserver.jp +mx ~all`）

#### 4. SPFレコードの追加・修正

**既存レコードがある場合:**

現在の値に追加する形で修正します。

**例1: Xserverのデフォルト値のみの場合**
```
v=spf1 +a:sv12345.xserver.jp +mx ~all
```

**例2: 既に複数の送信元を許可している場合**
```
v=spf1 +a:sv12345.xserver.jp +mx include:_spf.google.com ~all
```

**重要**: `sv12345.xserver.jp` の部分は自分のXserverのホスト名に置き換えてください。

Xserverのホスト名確認方法:
1. Xserverサーバーパネル → サーバー情報
2. 「ホスト名」をコピー（例: `sv12345.xserver.jp`）

#### 5. 設定例

**ホスト名**: `@` または空欄
**種別**: TXT
**内容**: `v=spf1 +a:sv12345.xserver.jp +mx ~all`
**優先度**: 0

#### 6. 確認画面へ進む → 追加する

---

## SPFレコードの確認方法

### コマンドラインで確認（Windows）

```bash
nslookup -type=TXT mitsulu.style
```

**期待される結果:**
```
mitsulu.style   text = "v=spf1 +a:sv12345.xserver.jp +mx ~all"
```

### オンラインツールで確認

https://mxtoolbox.com/spf.aspx にアクセスし、`mitsulu.style` を入力

**期待される結果**: SPF Record found

---

## SPFレコードの意味

```
v=spf1 +a:sv12345.xserver.jp +mx ~all
```

- `v=spf1`: SPFバージョン1
- `+a:sv12345.xserver.jp`: このホストからの送信を許可
- `+mx`: MXレコードに登録されたサーバーからの送信を許可
- `~all`: それ以外は「ソフトフェイル」（疑わしいが拒否しない）

**オプション:**
- `+all`: すべて許可（非推奨）
- `-all`: それ以外は完全拒否（厳格）
- `~all`: それ以外はソフトフェイル（推奨）

---

## 文字化け対策（完了済み）

### contact.phpに追加した設定

```php
// 文字エンコーディング設定（重要！）
mb_language('Japanese');
mb_internal_encoding('UTF-8');
```

**説明:**
- `mb_language('Japanese')`: 日本語メール用の設定
- `mb_internal_encoding('UTF-8')`: 内部エンコーディングをUTF-8に設定

これにより、`mb_send_mail()` が正しくUTF-8でメールを送信します。

---

## テスト手順

### 1. contact.phpを再アップロード

FileZillaで修正版をアップロード:
- 場所: `/mitsulu.style/public_html/form/contact.php`
- パーミッション: 644

### 2. SPFレコード設定（Xserver DNS）

上記手順に従ってSPFレコードを設定

### 3. DNS変更の反映を待つ

**通常: 数分〜1時間**
**最大: 24時間**

確認方法:
```bash
nslookup -type=TXT mitsulu.style
```

### 4. テスト送信

https://www.mitsulu.style/#contact からテスト送信

### 5. 結果確認

**チェック項目:**
- ✅ メールが届く
- ✅ **受信トレイ**に届く（迷惑メールフォルダではない）
- ✅ 日本語が正しく表示される
- ✅ 自動返信メールが届く

---

## トラブルシューティング

### 問題1: まだ迷惑メールフォルダに届く

**原因:**
- SPFレコードの設定ミス
- DNS変更がまだ反映されていない
- 受信側のメールサーバーのフィルター設定

**対策:**
1. SPFレコードを再確認
2. 24時間待つ
3. 受信側で「迷惑メールではない」と登録

### 問題2: メールが届かない

**原因:**
- PHPの`mb_send_mail()`エラー
- Xserverのメール送信制限
- 受信側のメールサーバーが拒否

**対策:**
1. Xserverのエラーログを確認
2. 送信先メールアドレスを確認
3. 受信側の迷惑メール設定を確認

### 問題3: 文字化けが直らない

**原因:**
- contact.phpの修正版がアップロードされていない
- ファイルが正しく保存されていない（BOM付きUTF-8など）

**対策:**
1. FileZillaで上書きアップロード
2. ファイルエンコーディングを「UTF-8 (BOMなし)」で保存
3. ブラウザキャッシュをクリア（Ctrl+Shift+R）

---

## 補足: DKIMとDMARC（オプション）

さらにメール到達率を向上させたい場合、以下も設定可能です：

### DKIM (DomainKeys Identified Mail)
電子署名でメールの真正性を証明

### DMARC (Domain-based Message Authentication, Reporting and Conformance)
SPFとDKIMの結果を基にメール処理ポリシーを定義

**現時点では不要:**
SPFレコード設定だけで十分に迷惑メール判定を回避できます。

---

## まとめ

### 必須設定

1. ✅ **文字エンコーディング設定**: `contact.php`に追加済み
2. ⏳ **SPFレコード設定**: Xserver DNSで設定が必要

### 設定完了後の効果

- ✅ 日本語メールが正しく表示される
- ✅ 迷惑メールフォルダではなく受信トレイに届く
- ✅ メール到達率の向上
- ✅ 送信元の信頼性向上

### 次のステップ

1. contact.phpを再アップロード（文字エンコーディング修正版）
2. Xserver DNSでSPFレコードを設定
3. DNS反映を待つ（数分〜24時間）
4. テスト送信して確認
