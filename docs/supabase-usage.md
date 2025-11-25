# Supabase 実践ガイド

このドキュメントは、勤怠管理システムで Supabase を実際に使うための実践的なガイドです。

## 目次

- [クイックスタート](#クイックスタート)
- [基本的な使い方](#基本的な使い方)
- [データの操作](#データの操作)
- [よくある操作](#よくある操作)
- [トラブルシューティング](#トラブルシューティング)

## クイックスタート

### 1. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com/) にアクセスしてサインアップ/ログイン
2. 「New Project」をクリック
3. プロジェクト情報を入力して作成
4. プロジェクトが作成されるまで待つ（2-3 分）

### 2. データベーステーブルの作成

1. Supabase Dashboard でプロジェクトを開く
2. 左メニューから「SQL Editor」を選択
3. 「New query」をクリック
4. `db/supabase.sql`の内容をコピー＆ペースト
5. 「Run」ボタンをクリック
6. 「Success. No rows returned」と表示されれば成功

### 3. 環境変数の設定

1. Supabase Dashboard で「Settings」→「API」を開く
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. プロジェクトルートに`.env.local`ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. RLS（Row Level Security）ポリシーの設定

開発中は、匿名ユーザーが読み書きできるようにします：

1. Supabase Dashboard で「Authentication」→「Policies」を開く
2. `attendance_records`テーブルを選択
3. 「New Policy」をクリック

**読み取りポリシー**:

- Policy name: `Allow anonymous read`
- Allowed operation: `SELECT`
- Policy definition: `true`
- 「Review」→「Save policy」

**書き込みポリシー**:

- Policy name: `Allow anonymous write`
- Allowed operation: `INSERT, UPDATE`
- Policy definition: `true`
- 「Review」→「Save policy」

### 5. 動作確認

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開き、エラーが出ないことを確認してください。

## 基本的な使い方

### Supabase クライアントの取得

```typescript
import { getSupabaseClient } from "@/utils/supabaseClient";

const supabase = getSupabaseClient();
```

### データの読み込み

```typescript
import { loadRecords } from "@/utils/storage";

// すべての記録を取得（日付の降順）
const records = await loadRecords();
```

### データの保存

```typescript
import { saveRecord } from "@/utils/storage";

// 今日の記録を更新
const records = await saveRecord("2024-01-15", {
  clockIn: "09:00",
  clockOut: "18:00",
});
```

## データの操作

### 現在の実装

このプロジェクトでは、`src/utils/storage.ts`に以下の関数が実装されています：

#### `loadRecords()`

すべての勤務記録を取得します。

```typescript
const records = await loadRecords();
// 戻り値: AttendanceRecord[]（日付の降順でソート）
```

**内部処理**:

1. Supabase クライアントを取得
2. `attendance_records`テーブルから全データを取得
3. 日付の降順でソート
4. TypeScript 型に変換して返す

#### `saveRecord(date, updates)`

指定日の記録を保存または更新します。

```typescript
const records = await saveRecord("2024-01-15", {
  clockIn: "09:00",
  clockOut: "18:00",
  breakStart: "12:00",
  breakEnd: "13:00",
});
// 戻り値: AttendanceRecord[]（更新後の全記録）
```

**内部処理**:

1. 既存の記録を検索
2. 更新内容をマージ
3. 勤務時間・休憩時間を自動計算
4. Supabase に保存（upsert）
5. 更新後の全記録を返す

### コンポーネントでの使用例

```typescript
"use client";

import { useState, useEffect } from "react";
import { loadRecords, saveRecord } from "@/utils/storage";
import { getCurrentDate, getCurrentTime } from "@/utils/time";

export default function MyComponent() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // データの読み込み
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadRecords();
        setRecords(data);
      } catch (error) {
        console.error("読み込みエラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // データの保存
  const handleSave = async () => {
    try {
      const updated = await saveRecord(getCurrentDate(), {
        clockIn: getCurrentTime(),
      });
      setRecords(updated);
    } catch (error) {
      console.error("保存エラー:", error);
    }
  };

  if (loading) return <div>読み込み中...</div>;

  return <div>{/* コンテンツ */}</div>;
}
```

## よくある操作

### 1. 今日の記録を取得

```typescript
import { loadRecords } from "@/utils/storage";
import { getCurrentDate } from "@/utils/time";

const records = await loadRecords();
const today = getCurrentDate();
const todayRecord = records.find((r) => r.date === today);
```

### 2. 特定の日の記録を更新

```typescript
import { saveRecord } from "@/utils/storage";

// 2024年1月15日の記録を更新
await saveRecord("2024-01-15", {
  clockIn: "09:00",
  clockOut: "18:00",
});
```

### 3. 月間の記録を取得

```typescript
import { loadRecords } from "@/utils/storage";
import { format, parse } from "date-fns";

const records = await loadRecords();
const targetMonth = "2024-01";

const monthlyRecords = records.filter((record) => {
  const recordDate = parse(record.date, "yyyy-MM-dd", new Date());
  return format(recordDate, "yyyy-MM") === targetMonth;
});
```

### 4. 直接 Supabase クライアントを使用する

より高度な操作が必要な場合：

```typescript
import { getSupabaseClient } from "@/utils/supabaseClient";

const supabase = getSupabaseClient();

// 特定の条件で検索
const { data, error } = await supabase
  .from("attendance_records")
  .select("*")
  .eq("date", "2024-01-15")
  .single();

// 複数の条件で検索
const { data, error } = await supabase
  .from("attendance_records")
  .select("*")
  .gte("total_work_time", 480) // 8時間以上
  .order("date", { ascending: false });
```

## Supabase Dashboard での確認

### データの確認

1. Supabase Dashboard でプロジェクトを開く
2. 左メニューから「Table Editor」を選択
3. `attendance_records`テーブルを選択
4. 保存されたデータを確認

### SQL クエリの実行

1. 「SQL Editor」を開く
2. クエリを入力：

```sql
-- すべての記録を取得
SELECT * FROM attendance_records ORDER BY date DESC;

-- 特定の月の記録を取得
SELECT * FROM attendance_records
WHERE date LIKE '2024-01%'
ORDER BY date DESC;

-- 勤務時間の合計を計算
SELECT
  date,
  total_work_time,
  total_break_time
FROM attendance_records
WHERE total_work_time IS NOT NULL
ORDER BY date DESC;
```

3. 「Run」をクリック

## トラブルシューティング

### エラー: "Supabase URL/anon key is not set"

**原因**: 環境変数が設定されていません。

**解決方法**:

1. `.env.local`ファイルが存在するか確認
2. 環境変数名が正しいか確認（`NEXT_PUBLIC_`で始まる）
3. 開発サーバーを再起動

### エラー: "Row Level Security policy violation"

**原因**: RLS ポリシーでアクセスが拒否されています。

**解決方法**:

1. Supabase Dashboard で「Authentication」→「Policies」を確認
2. 開発中は匿名ユーザーが読み書きできるポリシーを追加
3. 本番環境では適切な認証とポリシーを設定

### データが保存されない

**原因**: ネットワークエラーまたは RLS ポリシーの問題。

**解決方法**:

1. ブラウザのコンソールでエラーを確認
2. Supabase Dashboard でテーブルが存在するか確認
3. RLS ポリシーを確認
4. ネットワーク接続を確認

### テーブルが見つからない

**原因**: SQL が実行されていない。

**解決方法**:

1. Supabase Dashboard の「Table Editor」でテーブルを確認
2. `db/supabase.sql`を再度実行
3. エラーメッセージを確認

## 実践的な使用例

### 例 1: 出勤ボタンをクリックしたとき

```typescript
const handleClockIn = async () => {
  try {
    // 現在の日付と時刻を取得
    const today = getCurrentDate(); // '2024-01-15'
    const now = getCurrentTime(); // '09:00'

    // 記録を保存
    const records = await saveRecord(today, {
      clockIn: now,
    });

    // 状態を更新
    setRecords(records);
  } catch (error) {
    console.error("出勤記録の保存に失敗:", error);
  }
};
```

### 例 2: 月間の勤務時間を集計

```typescript
import { loadRecords } from "@/utils/storage";
import { format, parse } from "date-fns";

const calculateMonthlyTotal = async (year: number, month: number) => {
  const records = await loadRecords();
  const targetMonth = `${year}-${String(month).padStart(2, "0")}`;

  const monthlyRecords = records.filter((record) => {
    return record.date.startsWith(targetMonth);
  });

  const totalMinutes = monthlyRecords.reduce((sum, record) => {
    return sum + (record.totalWorkTime || 0);
  }, 0);

  return totalMinutes;
};

// 使用例
const januaryTotal = await calculateMonthlyTotal(2024, 1);
console.log(`1月の総勤務時間: ${januaryTotal}分`);
```

### 例 3: エラーハンドリング付きのデータ読み込み

```typescript
const fetchRecordsWithErrorHandling = async () => {
  try {
    const records = await loadRecords();
    return { success: true, data: records };
  } catch (error: any) {
    if (error.message?.includes("Row Level Security")) {
      return {
        success: false,
        error: "アクセス権限がありません。RLSポリシーを確認してください。",
      };
    }
    if (error.message?.includes("network")) {
      return {
        success: false,
        error: "ネットワークエラーが発生しました。接続を確認してください。",
      };
    }
    return {
      success: false,
      error: "データの取得に失敗しました。",
    };
  }
};
```

## データベース構造の確認

### テーブル構造

```
attendance_records
├── id (text, PRIMARY KEY)          # 日付: YYYY-MM-DD
├── date (text, UNIQUE, NOT NULL)    # 日付: YYYY-MM-DD
├── clock_in (text, nullable)       # 出勤時刻: HH:mm
├── clock_out (text, nullable)      # 退勤時刻: HH:mm
├── break_start (text, nullable)    # 休憩開始: HH:mm
├── break_end (text, nullable)      # 休憩終了: HH:mm
├── total_work_time (integer, nullable)  # 総勤務時間（分）
├── total_break_time (integer, nullable) # 総休憩時間（分）
├── created_at (timestamptz)        # 作成日時（自動）
└── updated_at (timestamptz)        # 更新日時（自動）
```

### インデックス

現在はインデックスは設定されていませんが、大量のデータがある場合は以下を追加すると良いでしょう：

```sql
-- 日付で検索を高速化
CREATE INDEX IF NOT EXISTS idx_attendance_records_date
ON attendance_records(date);

-- 日付の範囲検索を高速化
CREATE INDEX IF NOT EXISTS idx_attendance_records_date_desc
ON attendance_records(date DESC);
```

## 次のステップ

### 認証機能の追加

1. Supabase Dashboard で「Authentication」を有効化
2. 認証方法を設定（Email、Google、GitHub など）
3. RLS ポリシーを更新して認証済みユーザーのみアクセス可能にする

### リアルタイム更新

Supabase のリアルタイム機能を使用：

```typescript
import { getSupabaseClient } from "@/utils/supabaseClient";

const supabase = getSupabaseClient();

// リアルタイムでデータを監視
supabase
  .channel("attendance_changes")
  .on(
    "postgres_changes",
    {
      event: "*", // INSERT, UPDATE, DELETE
      schema: "public",
      table: "attendance_records",
    },
    (payload) => {
      console.log("データが変更されました:", payload);
      // 状態を更新
    }
  )
  .subscribe();
```

### データのエクスポート

```typescript
import { loadRecords } from "@/utils/storage";

const exportToJSON = async () => {
  const records = await loadRecords();
  const json = JSON.stringify(records, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance-${new Date().toISOString()}.json`;
  a.click();
};
```

## まとめ

Supabase を使うことで：

- **データの永続化**: PostgreSQL データベースに安全に保存
- **簡単な操作**: `loadRecords()`と`saveRecord()`で簡単に操作
- **自動計算**: 勤務時間・休憩時間が自動計算される
- **エラーハンドリング**: 適切なエラーハンドリングが実装済み

詳細は [supabase-setup.md](./supabase-setup.md) も参照してください。
