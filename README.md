# 勤怠管理システム

Next.js で構築されたモダンな勤怠管理システムです。シンプルで使いやすい UI で、日々の出退勤を管理できます。

## 目次

- [機能](#機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [開発](#開発)
- [プロジェクト構造](#プロジェクト構造)
- [ドキュメント](#ドキュメント)
- [ライセンス](#ライセンス)

## 機能

- 出勤・退勤の記録
- 休憩時間の記録
- 日次・月次の勤務時間の表示
- カレンダービューでの勤務状況確認
- 勤務履歴の一覧表示
- 複数回の休憩記録と後編集（モバイルでも見やすいフォーム）
- データの Supabase (PostgreSQL) への保存
- レスポンシブデザイン対応

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **データベース**: Supabase (PostgreSQL)
- **スタイリング**: Tailwind CSS
- **日付処理**: date-fns
- **フォント**: Manrope (Google Fonts)

## セットアップ

### 前提条件

- Node.js 18 以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install
```

### Supabase の準備（必須）

1. Supabase プロジェクトを作成し、`.env.example` を参考に `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定。
2. Supabase の SQL エディタで `db/supabase.sql` を実行して `attendance_records` テーブルを作成（複数休憩用の `break_sessions` 列を含みます）。
3. `npm install` を実行（`@supabase/supabase-js` を利用します）。
4. RLS を有効化したままの場合は、匿名キーで read/write できるポリシーを開発用に追加するか、適切な認証を設定してください。

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド

```bash
# 本番用ビルド
npm run build

# 本番サーバーの起動
npm start
```

### リント

```bash
npm run lint
```

## プロジェクト構造

```
Attendance/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # ルートレイアウト
│   │   ├── page.tsx      # ホームページ
│   │   └── globals.css   # グローバルスタイル
│   ├── components/        # Reactコンポーネント
│   │   ├── AttendanceSystem.tsx  # メインコンポーネント
│   │   ├── AttendanceButton.tsx  # 出退勤ボタン
│   │   ├── TodaySummary.tsx      # 本日のサマリー
│   │   ├── MonthlyCalendar.tsx   # 月次カレンダー
│   │   └── HistoryList.tsx        # 履歴リスト
│   ├── types/            # TypeScript型定義
│   │   └── attendance.ts
│   └── utils/            # ユーティリティ関数
│       ├── supabaseClient.ts # Supabase クライアント初期化
│       ├── storage.ts    # Supabase 読み書き
│       └── time.ts       # 時間処理
├── db/                   # DB スキーマ
│   └── supabase.sql
├── .env.example          # 環境変数のサンプル（Supabase）
├── docs/                 # ドキュメント
│   ├── architecture.md    # アーキテクチャ説明
│   ├── code-structure.md # コード構造ガイド
│   ├── ai-development-guide.md # AI開発ガイド
│   ├── design-guide.md   # デザインガイドライン
│   └── improvements.md    # 改善点リスト
└── CONTRIBUTING.md       # コントリビューションガイド
```

## ドキュメント

詳細なドキュメントは以下のファイルを参照してください：

- **[アーキテクチャ説明](./docs/architecture.md)** - システムの全体構造と設計思想
- **[コード構造ガイド](./docs/code-structure.md)** - ファイル構成と各モジュールの説明
- **[Supabase セットアップガイド](./docs/supabase-setup.md)** - Supabase Database のセットアップと使い方
- **[Supabase 実践ガイド](./docs/supabase-usage.md)** - Supabase の実践的な使い方とコード例
- **[Vercel 環境変数設定ガイド](./docs/vercel-setup.md)** - Vercel での環境変数設定方法
- **[デザインガイド](./docs/design-guide.md)** - UI/UX デザインのガイドライン
- **[改善点リスト](./docs/improvements.md)** - 既知の改善点と優先順位
- **[AI 開発ガイド](./docs/ai-development-guide.md)** - AI 開発者向けのガイドライン
- **[コントリビューションガイド](./CONTRIBUTING.md)** - 開発への参加方法

## デザイン

モダンでクリーンなデザインを採用しています。ガラスモーフィズム効果とグラデーション背景を使用した、視覚的に魅力的な UI です。

詳細は [design-guide.md](./docs/design-guide.md) を参照してください。

## 開発

### コードスタイル

- TypeScript の strict モードを有効化
- ESLint を使用したコード品質チェック
- Prettier（推奨）によるコードフォーマット

### ブランチ戦略

- `main`: 本番環境用ブランチ
- `develop`: 開発用ブランチ（推奨）
- `feature/*`: 機能追加用ブランチ

### コミットメッセージ

以下の形式を推奨します：

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイルの変更
refactor: リファクタリング
test: テストの追加・修正
chore: その他の変更
```

## 既知の問題

現在の改善点については [improvements.md](./docs/improvements.md) を参照してください。

## ライセンス

このプロジェクトはプライベートプロジェクトです。

## コントリビューション

コントリビューションを歓迎します！詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## サポート

問題や質問がある場合は、Issue を作成してください。
