# コード構造ガイド

このドキュメントは、プロジェクトのファイル構成と各モジュールの詳細な説明を提供します。

## ディレクトリ構造

```
Attendance/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # ホームページ
│   │   └── globals.css         # グローバルスタイル
│   ├── components/             # Reactコンポーネント
│   │   ├── AttendanceSystem.tsx
│   │   ├── AttendanceButton.tsx
│   │   ├── TodaySummary.tsx
│   │   ├── MonthlyCalendar.tsx
│   │   └── HistoryList.tsx
│   ├── types/                  # TypeScript型定義
│   │   └── attendance.ts
│   └── utils/                  # ユーティリティ関数
│       ├── storage.ts
│       └── time.ts
├── docs/                       # ドキュメント
├── public/                     # 静的ファイル（現在なし）
└── 設定ファイル
```

## ファイル詳細

### App Router (`src/app/`)

#### `layout.tsx`

**役割**: Next.js のルートレイアウトコンポーネント

**主な内容**:

- HTML の基本構造
- メタデータの定義
- グローバル CSS の読み込み

**重要なポイント**:

- `lang="ja"`で日本語設定
- メタデータで SEO 対応

#### `page.tsx`

**役割**: アプリケーションのエントリーポイント

**主な内容**:

- `AttendanceSystem`コンポーネントの呼び出し
- ページレイアウト（パディング、レスポンシブ対応）

**コード例**:

```typescript
export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 sm:py-14">
      <AttendanceSystem />
    </main>
  );
}
```

#### `globals.css`

**役割**: グローバルスタイルの定義

**主な内容**:

- Tailwind CSS のインポート
- カスタムフォント（Manrope）の設定
- 背景グラデーションの定義
- フォントスムージング設定

### Components (`src/components/`)

#### `AttendanceSystem.tsx`

**役割**: メインコンテナコンポーネント。アプリケーションの状態管理とビジネスロジックを担当

**主要な機能**:

- 状態管理（`useState`）
- データの読み込み（`useEffect`）
- 出退勤処理のハンドラー
- 記録の更新ロジック

**状態**:

```typescript
interface AttendanceState {
  records: AttendanceRecord[];
  isClockedIn: boolean;
  isOnBreak: boolean;
}
```

**主要な関数**:

- `getTodayRecord()`: 今日の記録を取得
- `updateRecord()`: 記録を更新（作成・更新・計算）
- `handleClockIn()`: 出勤処理
- `handleClockOut()`: 退勤処理
- `handleBreakStart()`: 休憩開始処理
- `handleBreakEnd()`: 休憩終了処理

**子コンポーネント**:

- `TodaySummary`: 本日のサマリー
- `AttendanceButton`: 出退勤ボタン（4 つ）
- `MonthlyCalendar`: 月次カレンダー
- `HistoryList`: 履歴リスト

#### `AttendanceButton.tsx`

**役割**: 出退勤・休憩ボタンコンポーネント

**Props**:

```typescript
interface AttendanceButtonProps {
  label: string; // ボタンラベル
  onClick: () => void; // クリックハンドラー
  disabled: boolean; // 無効化フラグ
  variant: "primary" | "secondary" | "warning" | "info";
  time?: string; // 記録された時刻
}
```

**バリアント**:

- `primary`: 出勤ボタン（グラデーション）
- `secondary`: 退勤ボタン（白背景）
- `warning`: 休憩開始ボタン（アンバー）
- `info`: 休憩終了ボタン（エメラルド）

**スタイル**:

- 無効化時: グレーアウト、破線ボーダー
- 有効時: バリアントに応じた色とホバー効果

#### `TodaySummary.tsx`

**役割**: 本日の勤務状況をサマリー表示

**Props**:

```typescript
interface TodaySummaryProps {
  record?: AttendanceRecord;
}
```

**表示内容**:

- 出勤時刻
- 退勤時刻
- 勤務時間（計算済み）
- 休憩時間（計算済み）

**レイアウト**:

- 4 カラムグリッド（モバイル: 2 カラム）
- 各情報カードは`bg-slate-50/60`で統一

#### `MonthlyCalendar.tsx`

**役割**: 月次カレンダーで勤務状況を表示

**Props**:

```typescript
interface MonthlyCalendarProps {
  records: AttendanceRecord[];
}
```

**機能**:

- 月の切り替え（前月・次月）
- 今日の日付を強調表示
- 記録がある日付をエメラルド色で表示
- 各日の勤務時間を表示

**状態**:

- `currentMonth`: 表示中の月（Date 型）

**主要な関数**:

- `getRecordForDate()`: 指定日の記録を取得
- `goToPreviousMonth()`: 前月に移動
- `goToNextMonth()`: 次月に移動

#### `HistoryList.tsx`

**役割**: 勤務履歴をリスト表示

**Props**:

```typescript
interface HistoryListProps {
  records: AttendanceRecord[];
}
```

**機能**:

- 記録を日付の降順でソート
- 各記録の詳細情報を表示
- スクロール可能（最大高さ: 96 = 384px）

**表示内容**:

- 日付（日本語形式）
- 勤務時間
- 出勤・退勤時刻
- 休憩時間（ある場合）

### Types (`src/types/`)

#### `attendance.ts`

**役割**: TypeScript 型定義

**型定義**:

```typescript
// 勤務記録
export interface AttendanceRecord {
  id: string; // 一意のID
  date: string; // 日付 (YYYY-MM-DD)
  clockIn?: string; // 出勤時刻 (HH:mm)
  clockOut?: string; // 退勤時刻 (HH:mm)
  breakStart?: string; // 休憩開始時刻 (HH:mm)
  breakEnd?: string; // 休憩終了時刻 (HH:mm)
  totalWorkTime?: number; // 総勤務時間（分）
  totalBreakTime?: number; // 総休憩時間（分）
}

// アプリケーション状態
export interface AttendanceState {
  records: AttendanceRecord[]; // 全記録
  isClockedIn: boolean; // 出勤中フラグ
  isOnBreak: boolean; // 休憩中フラグ
}
```

### Utils (`src/utils/`)

#### `storage.ts`

**役割**: Supabase へのデータ保存・読み込み

**関数**:

```typescript
// 記録を保存（非同期）
export const saveRecord = async (
  date: string,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord[]>

// 記録を読み込み（非同期）
export const loadRecords = async (): Promise<AttendanceRecord[]>
```

**実装の詳細**:

- Supabase のテーブル `attendance_records` を使用
- 日付（YYYY-MM-DD）を主キーとして使用
- 自動的に勤務時間・休憩時間を計算
- PostgreSQL のタイムスタンプ（`created_at`, `updated_at`）を自動設定
- エラーハンドリング（try-catch）

**テーブル名**: `'attendance_records'`

#### `time.ts`

**役割**: 時間処理のユーティリティ関数

**関数**:

```typescript
// 時刻をフォーマット (HH:mm)
export const formatTime = (time: string | undefined): string

// 現在時刻を取得 (HH:mm)
export const getCurrentTime = (): string

// 現在日付を取得 (YYYY-MM-DD)
export const getCurrentDate = (): string

// 2つの時刻間の分数を計算
export const calculateMinutes = (
  start: string | undefined,
  end: string | undefined
): number

// 分数を時間表示に変換 (例: "8時間30分")
export const formatMinutes = (minutes: number): string
```

**使用ライブラリ**: `date-fns`

**注意点**:

- `calculateMinutes`は日付を跨ぐ場合の処理が不完全（改善の余地あり）

## データフロー

### 記録の更新フロー

```
1. ユーザーアクション
   ↓
2. AttendanceSystem のハンドラー
   ↓
3. updateRecord() で記録を更新
   ↓
4. 計算処理（勤務時間・休憩時間）
   ↓
5. saveRecord() で Supabase に保存
   ↓
6. setState() で状態を更新
   ↓
7. 子コンポーネントが再レンダリング
```

### データ読み込みフロー

```
1. AttendanceSystem がマウント
   ↓
2. useEffect が実行
   ↓
3. loadRecords() で Supabase から読み込み
   ↓
4. 今日の記録を検索
   ↓
5. 状態を判定（isClockedIn, isOnBreak）
   ↓
6. setState() で状態を更新
   ↓
7. コンポーネントがレンダリング
```

## スタイリング

### Tailwind CSS の使用

すべてのコンポーネントで Tailwind CSS を使用：

- ユーティリティクラスベース
- レスポンシブデザイン（`sm:`, `md:`, `lg:`プレフィックス）
- カスタムカラーパレット（slate, blue, emerald, amber）

### デザインパターン

- **ガラスモーフィズム**: `bg-white/80 backdrop-blur`
- **角丸**: `rounded-2xl`, `rounded-3xl`
- **影**: `shadow-sm`, `shadow-md`
- **ホバー効果**: `hover:-translate-y-0.5`

詳細は [DESIGN_GUIDE.md](../DESIGN_GUIDE.md) を参照してください。

## コードの読み方

### 新しい機能を追加する場合

1. **型定義を追加** (`src/types/attendance.ts`)
2. **ユーティリティ関数を追加** (`src/utils/`)
3. **コンポーネントを作成** (`src/components/`)
4. **AttendanceSystem に統合**

### バグを修正する場合

1. **問題の箇所を特定**（コンポーネント or ユーティリティ）
2. **関連する型定義を確認**
3. **テストケースを考える**
4. **修正を実装**

## コーディング規約

### 命名規則

- **コンポーネント**: PascalCase (`AttendanceSystem`)
- **関数**: camelCase (`getCurrentTime`)
- **型・インターフェース**: PascalCase (`AttendanceRecord`)
- **定数**: UPPER_SNAKE_CASE (`STORAGE_KEY`)

### ファイル構造

- 1 ファイル 1 コンポーネント（デフォルトエクスポート）
- 型定義は`types/`に集約
- ユーティリティは`utils/`に集約

### インポート順序

1. React 関連
2. 外部ライブラリ
3. 内部モジュール（`@/`エイリアス）
4. 相対パス

## パフォーマンス最適化のヒント

### 現在の実装

- 状態更新時に必要なコンポーネントのみ再レンダリング
- 大きな配列操作は最小限

### 改善の余地

- `getTodayRecord()`を`useMemo`でメモ化
- コンポーネントを`React.memo`でメモ化
- `HistoryList`に仮想スクロールを実装（大量データ時）

## 関連ドキュメント

- [ARCHITECTURE.md](./ARCHITECTURE.md) - アーキテクチャの詳細
- [DESIGN_GUIDE.md](../DESIGN_GUIDE.md) - デザインガイドライン
- [AI_DEVELOPMENT_GUIDE.md](./AI_DEVELOPMENT_GUIDE.md) - AI 開発ガイド
