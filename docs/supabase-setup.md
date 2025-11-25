# Supabase セットアップガイド

このドキュメントは、勤怠管理システムで Supabase Database を使用するためのセットアップ手順と使い方を説明します。

## 目次

- [Supabase とは](#supabaseとは)
- [セットアップ手順](#セットアップ手順)
- [環境変数の設定](#環境変数の設定)
- [Supabase の使い方](#supabaseの使い方)
- [データ構造](#データ構造)
- [トラブルシューティング](#トラブルシューティング)

## Supabase とは

Supabase は、オープンソースの Firebase 代替として開発された BaaS（Backend as a Service）です。PostgreSQL データベースをベースに、リアルタイム機能、認証、ストレージなどを提供します。

### 主な特徴

- **PostgreSQL**: 強力なリレーショナルデータベース
- **リアルタイム同期**: データの変更が即座に反映されます
- **Row Level Security (RLS)**: 細かいアクセス制御が可能
- **オープンソース**: セルフホスティングも可能
- **無料プラン**: 開発・小規模プロジェクトに十分

## セットアップ手順

### 1. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com/) にアクセス
2. 「Start your project」または「Sign in」をクリック
3. GitHub アカウントでログイン（推奨）またはメールアドレスで登録
4. 「New Project」をクリック
5. プロジェクト情報を入力：
   - **Name**: プロジェクト名（例: `attendance-system`）
   - **Database Password**: データベースのパスワード（強力なパスワードを設定）
   - **Region**: リージョンを選択（例: `Northeast Asia (Tokyo)`）
6. 「Create new project」をクリック
7. プロジェクトの作成完了まで待つ（数分）

### 2. データベーステーブルの作成

1. Supabase Dashboard でプロジェクトを開く
2. 左メニューから「SQL Editor」を選択
3. 「New query」をクリック
4. `db/supabase.sql` の内容をコピー＆ペースト
5. 「Run」をクリックして実行
6. テーブルが正常に作成されたことを確認

**SQL ファイルの内容**:

```sql
create table if not exists public.attendance_records (
  id text primary key,
  date text unique not null,
  clock_in text,
  clock_out text,
  break_start text,
  break_end text,
  total_work_time integer,
  total_break_time integer,
  created_at timestamptz default timezone('utc'::text, now()),
  updated_at timestamptz default timezone('utc'::text, now())
);

create or replace function public.attendance_records_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists attendance_records_set_updated_at on public.attendance_records;
create trigger attendance_records_set_updated_at
before update on public.attendance_records
for each row execute function public.attendance_records_updated_at();

alter table public.attendance_records enable row level security;
```

### 3. Row Level Security (RLS) の設定

開発中は、匿名ユーザーが読み書きできるようにポリシーを設定します。

1. Supabase Dashboard で「Authentication」→「Policies」を開く
2. `attendance_records` テーブルを選択
3. 「New Policy」をクリック
4. ポリシーを作成：

**読み取りポリシー**:
- Policy name: `Allow anonymous read`
- Allowed operation: `SELECT`
- Policy definition: `true`

**書き込みポリシー**:
- Policy name: `Allow anonymous write`
- Allowed operation: `INSERT, UPDATE`
- Policy definition: `true`

**注意**: 本番環境では適切な認証とポリシーを設定してください。

### 4. API キーの取得

1. Supabase Dashboard で「Settings」→「API」を開く
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 環境変数の設定

### 環境変数の設定

1. プロジェクトルートに`.env.local`ファイルを作成
2. 以下の環境変数を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要**: `.env.local`ファイルは`.gitignore`に含まれているため、Git にコミットされません。

### 環境変数の確認

開発サーバーを起動する前に、環境変数が正しく設定されているか確認：

```bash
# 開発サーバー起動
npm run dev
```

ブラウザのコンソールでエラーが出ないことを確認してください。

## Supabase の使い方

### データの保存

`src/utils/storage.ts`の`saveRecord`関数を使用してデータを保存します：

```typescript
import { saveRecord } from "@/utils/storage";

// 今日の記録を更新
const records = await saveRecord("2024-01-15", {
  clockIn: "09:00",
  clockOut: "18:00",
  breakStart: "12:00",
  breakEnd: "13:00",
});
```

### データの読み込み

`loadRecords`関数を使用してデータを読み込みます：

```typescript
import { loadRecords } from "@/utils/storage";

// すべての記録を取得（日付の降順）
const records = await loadRecords();
```

### データ構造

Supabase のデータ構造は以下の通りです：

```
attendance_records (テーブル)
  ├── id: text (主キー、日付: YYYY-MM-DD)
  ├── date: text (ユニーク、日付: YYYY-MM-DD)
  ├── clock_in: text | null (出勤時刻: HH:mm)
  ├── clock_out: text | null (退勤時刻: HH:mm)
  ├── break_start: text | null (休憩開始時刻: HH:mm)
  ├── break_end: text | null (休憩終了時刻: HH:mm)
  ├── total_work_time: integer | null (総勤務時間: 分)
  ├── total_break_time: integer | null (総休憩時間: 分)
  ├── created_at: timestamptz (作成日時)
  └── updated_at: timestamptz (更新日時)
```

### データの自動計算

`saveRecord`関数は、以下の計算を自動的に行います：

- **勤務時間**: `clockOut - clockIn - 休憩時間`
- **休憩時間**: `breakEnd - breakStart`
- **タイムスタンプ**: `created_at`と`updated_at`を自動設定（PostgreSQL のトリガー）

## データ構造

### AttendanceRecord 型

```typescript
interface AttendanceRecord {
  id: string; // 主キー（日付: YYYY-MM-DD）
  date: string; // 日付 (YYYY-MM-DD)
  clockIn?: string; // 出勤時刻 (HH:mm)
  clockOut?: string; // 退勤時刻 (HH:mm)
  breakStart?: string; // 休憩開始時刻 (HH:mm)
  breakEnd?: string; // 休憩終了時刻 (HH:mm)
  totalWorkTime?: number; // 総勤務時間（分）
  totalBreakTime?: number; // 総休憩時間（分）
}
```

### Supabase のメタデータ

Supabase には以下のメタデータも保存されます：

- `created_at`: レコード作成日時（PostgreSQL のデフォルト値）
- `updated_at`: レコード更新日時（PostgreSQL のトリガーで自動更新）

## トラブルシューティング

### エラー: "Row Level Security policy violation"

**原因**: RLS ポリシーでアクセスが拒否されています。

**解決方法**:

1. Supabase Dashboard で「Authentication」→「Policies」を開く
2. `attendance_records`テーブルのポリシーを確認
3. 開発中は一時的に匿名ユーザーが読み書きできるポリシーを追加（本番では削除）

### エラー: "Supabase URL/anon key is not set"

**原因**: 環境変数が正しく設定されていません。

**解決方法**:

1. `.env.local`ファイルが存在するか確認
2. 環境変数が正しく設定されているか確認
3. 開発サーバーを再起動

### データが保存されない

**原因**: ネットワークエラーまたは Supabase の設定問題。

**解決方法**:

1. ブラウザのコンソールでエラーを確認
2. Supabase Dashboard でテーブルが存在するか確認
3. RLS ポリシーを確認
4. ネットワーク接続を確認

### 環境変数が読み込まれない

**原因**: Next.js の環境変数の命名規則に従っていない。

**解決方法**:

1. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
2. `.env.local`ファイルがプロジェクトルートにあるか確認
3. 開発サーバーを再起動

### テーブルが見つからない

**原因**: SQL が実行されていない、またはテーブル名が間違っている。

**解決方法**:

1. Supabase Dashboard の「Table Editor」でテーブルが存在するか確認
2. `db/supabase.sql`を再度実行
3. テーブル名が`attendance_records`であることを確認

## 次のステップ

### 認証機能の追加

将来的に認証機能を追加する場合：

1. Supabase Authentication を有効化
2. `src/utils/auth.ts`を作成
3. RLS ポリシーを更新して認証済みユーザーのみアクセス可能にする
4. コンポーネントで認証状態を管理

### リアルタイム更新

Supabase のリアルタイム機能を使用して、データをリアルタイムで更新：

```typescript
import { getSupabaseClient } from "@/utils/supabaseClient";

const supabase = getSupabaseClient();

// リアルタイムでデータを監視
supabase
  .channel("attendance_records")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "attendance_records",
    },
    (payload) => {
      // データが変更されたときの処理
      console.log("Change received!", payload);
    }
  )
  .subscribe();
```

### オフライン対応の強化

現在の実装は基本的なオフライン対応がありますが、以下の改善が可能です：

- オフライン時のデータキューイング
- 同期状態の表示
- 競合解決の実装

## 参考リンク

- [Supabase ドキュメント](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL ドキュメント](https://www.postgresql.org/docs/)
- [Next.js 環境変数](https://nextjs.org/docs/basic-features/environment-variables)

## まとめ

Supabase を使用することで、以下のメリットがあります：

- データの永続化（PostgreSQL データベース）
- 複数デバイス間での同期
- リアルタイム機能
- 強力なアクセス制御（RLS）
- オープンソース

適切にセットアップすれば、より堅牢でスケーラブルな勤怠管理システムを構築できます。

