# ドキュメント

このディレクトリには、プロジェクトのすべての技術ドキュメントが含まれています。

## ドキュメント構成

```
docs/
├── README.md                    # このファイル（ナビゲーション）
├── architecture.md              # システムアーキテクチャ
├── code-structure.md             # コード構造とファイル説明
├── supabase-setup.md            # Supabase セットアップガイド
├── supabase-usage.md            # Supabase 実践ガイド
├── ai-development-guide.md      # AI開発者向けガイド
├── design-guide.md              # デザインガイドライン
└── improvements.md             # 改善点リスト
```

## ドキュメント一覧

### アーキテクチャ・設計

#### [architecture.md](./architecture.md)

システムの全体構造と設計思想を説明します。

**内容**:

- アーキテクチャパターン
- レイヤー構造（プレゼンテーション層、ビジネスロジック層、データアクセス層）
- データフロー
- 設計原則（単一責任、関心の分離、DRY）
- 拡張性とセキュリティ考慮事項

**読むべき人**: システム全体を理解したい開発者、アーキテクチャを変更する開発者

---

#### [code-structure.md](./code-structure.md)

ファイル構成と各モジュールの詳細な説明を提供します。

**内容**:

- ディレクトリ構造
- 各ファイルの役割と実装詳細
- データフロー
- コーディング規約
- パフォーマンス最適化のヒント

**読むべき人**: 新しい機能を追加する開発者、コードを理解したい開発者

---

#### [supabase-setup.md](./supabase-setup.md)

Supabase Database のセットアップと使い方を説明します。

**内容**:

- Supabase とは
- セットアップ手順（Supabase プロジェクト作成、テーブル作成）
- 環境変数の設定
- データの保存・読み込み方法
- データ構造
- トラブルシューティング

**読むべき人**: Supabase を初めて使う開発者、データベース設定を行う開発者

---

#### [supabase-usage.md](./supabase-usage.md)

Supabase の実践的な使い方を説明します。

**内容**:

- クイックスタート（5 分で始める）
- 基本的な使い方（データの読み書き）
- よくある操作（今日の記録、月間集計など）
- 実践的な使用例
- トラブルシューティング

**読むべき人**: Supabase の使い方がわからない開発者、実際にコードを書く開発者

---

### 開発ガイド

#### [ai-development-guide.md](./ai-development-guide.md)

AI（Cursor AI、GitHub Copilot など）が効率的に開発できるためのガイドラインです。

**内容**:

- コーディング規約とベストプラクティス
- コンポーネント作成ガイド
- エラーハンドリングパターン
- スタイリングガイドライン
- よくあるタスクとチェックリスト
- デバッグのヒント

**読むべき人**: AI 開発者、コード生成を行う開発者

---

### デザイン

#### [design-guide.md](./design-guide.md)

UI/UX デザインのガイドラインとスタイリング規約です。

**内容**:

- デザイン哲学
- カラーパレット
- タイポグラフィ
- コンポーネントスタイル
- レスポンシブデザイン
- アニメーションとインタラクション

**読むべき人**: UI を変更する開発者、新しいコンポーネントを作成する開発者

---

### プロジェクト管理

#### [improvements.md](./improvements.md)

既知の改善点と優先順位をまとめています。

**内容**:

- 高優先度の改善点（バグ修正）
- 中優先度の改善点（UX・アクセシビリティ）
- 低優先度の改善点（最適化・機能追加）
- 実装優先順位の推奨
- コードレビューポイント

**読むべき人**: 改善に取り組む開発者、プロジェクトマネージャー

---

## クイックナビゲーション

### 新しい開発者向け

1. **[../README.md](../README.md)** - プロジェクト概要とセットアップ
2. **[architecture.md](./architecture.md)** - システムの全体像を理解
3. **[code-structure.md](./code-structure.md)** - コード構造を理解
4. **[design-guide.md](./design-guide.md)** - デザインガイドラインを確認

### AI 開発者向け

1. **[ai-development-guide.md](./ai-development-guide.md)** - AI 開発ガイドを読む
2. **[../.cursorrules](../.cursorrules)** - Cursor AI のルールを確認
3. **[code-structure.md](./code-structure.md)** - コード構造を理解
4. **[design-guide.md](./design-guide.md)** - スタイリングガイドを確認

### コントリビューター向け

1. **[../CONTRIBUTING.md](../CONTRIBUTING.md)** - コントリビューションガイド
2. **[improvements.md](./improvements.md)** - 改善点を確認
3. **[architecture.md](./architecture.md)** - アーキテクチャを理解

### 機能追加時

1. **[code-structure.md](./code-structure.md)** - ファイル構造を確認
2. **[design-guide.md](./design-guide.md)** - デザインガイドラインを確認
3. **[ai-development-guide.md](./ai-development-guide.md)** - コーディング規約を確認

### Supabase 設定時

1. **[supabase-setup.md](./supabase-setup.md)** - Supabase セットアップガイドを読む
2. **[supabase-usage.md](./supabase-usage.md)** - Supabase 実践ガイドを読む（使い方がわからない場合）
3. Supabase Dashboard でプロジェクトを作成
4. テーブルを作成（SQL を実行）
5. 環境変数を設定
6. RLS ポリシーを設定

### バグ修正時

1. **[improvements.md](./improvements.md)** - 既知の問題を確認
2. **[code-structure.md](./code-structure.md)** - 関連コードを確認
3. **[architecture.md](./architecture.md)** - データフローを理解

---

## ドキュメントの更新

ドキュメントを更新する際は：

1. **該当するドキュメントを編集**
2. **関連するドキュメントも更新**（必要に応じて）
3. **この README.md のリンクを確認**
4. **変更内容をコミットメッセージに記載**

### ドキュメント更新のチェックリスト

- [ ] 該当ドキュメントを更新
- [ ] 関連ドキュメントのリンクを確認
- [ ] この README.md の内容が最新か確認
- [ ] ルートの README.md のリンクを確認（必要に応じて）

---

## 外部リソース

### 公式ドキュメント

- [Next.js ドキュメント](https://nextjs.org/docs) - App Router、API Routes
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs) - ユーティリティクラス
- [date-fns ドキュメント](https://date-fns.org) - 日付処理
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/) - 型システム

### ベストプラクティス

- [React ベストプラクティス](https://react.dev/learn) - React 公式ガイド
- [Next.js ベストプラクティス](https://nextjs.org/docs/app/building-your-application/routing) - ルーティングとパフォーマンス

---

## ドキュメントマップ

```
プロジェクト開始
    ↓
[README.md] (ルート)
    ├─→ セットアップ
    ├─→ クイックスタート
    └─→ ドキュメントへのリンク
         ↓
    [docs/README.md] (このファイル)
         ├─→ [architecture.md] ─→ システム設計
         ├─→ [code-structure.md] ─→ コード理解
         ├─→ [ai-development-guide.md] ─→ AI開発
         ├─→ [design-guide.md] ─→ UI/UX
         └─→ [improvements.md] ─→ 改善点
```

---

## よくある質問

### Q: どのドキュメントから読み始めればいいですか？

**A**: プロジェクトの目的によって異なります：

- **新規参加者**: README.md → architecture.md → code-structure.md
- **AI 開発者**: ai-development-guide.md → code-structure.md
- **UI 開発者**: design-guide.md → code-structure.md
- **バグ修正**: improvements.md → code-structure.md

### Q: ドキュメントが見つからない場合は？

**A**: この README.md の「ドキュメント一覧」セクションを確認してください。すべてのドキュメントがリストされています。

### Q: ドキュメントに誤りを見つけた場合は？

**A**: Issue を作成するか、直接修正してプルリクエストを送ってください。

---

## まとめ

このディレクトリには、プロジェクトを理解し、効率的に開発するために必要なすべての情報が含まれています。

**重要なポイント**:

- すべての技術ドキュメントは`docs/`ディレクトリに集約
- ルートの README.md と CONTRIBUTING.md はプロジェクト概要とコントリビューションガイド
- 各ドキュメントは相互にリンクされており、関連情報に素早くアクセス可能

質問や改善提案がある場合は、Issue を作成してください。
