# アーキテクチャ説明

## 概要

勤怠管理システムは、Next.js 14 の App Router を使用したクライアントサイドアプリケーションです。データは Firestore Database に保存され、複数デバイス間で同期されます。

## アーキテクチャパターン

### 全体構造

```
┌─────────────────────────────────────────┐
│         Next.js App Router              │
│  (page.tsx - エントリーポイント)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      AttendanceSystem (Container)       │
│  - 状態管理 (useState)                  │
│  - ビジネスロジック                     │
│  - データ永続化                         │
└──────────────┬──────────────────────────┘
               │
       ┌───────┼───────┐
       ▼       ▼       ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Button  │ │ Summary  │ │ Calendar │
│ Component│ │ Component│ │ Component│
└──────────┘ └──────────┘ └──────────┘
```

## レイヤー構造

### 1. プレゼンテーション層 (Components)

**責務**: UI の表示とユーザーインタラクション

- `AttendanceSystem.tsx`: メインコンテナコンポーネント
- `AttendanceButton.tsx`: 出退勤ボタン
- `TodaySummary.tsx`: 本日の勤務サマリー
- `MonthlyCalendar.tsx`: 月次カレンダー表示
- `HistoryList.tsx`: 勤務履歴リスト

**特徴**:

- すべてのコンポーネントは`'use client'`ディレクティブを使用
- Props 経由でデータを受け取り、表示のみを担当
- ビジネスロジックは含まない

### 2. ビジネスロジック層 (AttendanceSystem)

**責務**: アプリケーションの状態管理とビジネスルール

**主要な処理**:

- 出退勤記録の作成・更新
- 勤務時間・休憩時間の計算
- 状態の管理（出勤中、休憩中など）

**状態管理**:

```typescript
interface AttendanceState {
  records: AttendanceRecord[]; // 全記録
  isClockedIn: boolean; // 出勤中フラグ
  isOnBreak: boolean; // 休憩中フラグ
}
```

### 3. データアクセス層 (Utils)

**責務**: データの永続化と時間処理

#### storage.ts

- `saveRecord()`: Firestore への保存
- `loadRecords()`: Firestore からの読み込み

#### time.ts

- `getCurrentTime()`: 現在時刻の取得 (HH:mm 形式)
- `getCurrentDate()`: 現在日付の取得 (YYYY-MM-DD 形式)
- `formatTime()`: 時刻のフォーマット
- `formatMinutes()`: 分数を時間表示に変換
- `calculateMinutes()`: 2 つの時刻間の分数を計算

### 4. 型定義層 (Types)

**責務**: TypeScript 型定義

```typescript
interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  clockIn?: string; // HH:mm
  clockOut?: string; // HH:mm
  breakStart?: string; // HH:mm
  breakEnd?: string; // HH:mm
  totalWorkTime?: number; // minutes
  totalBreakTime?: number; // minutes
}
```

## データフロー

### 出勤処理の流れ

```
1. ユーザーが「出勤」ボタンをクリック
   ↓
2. AttendanceSystem.handleClockIn() が呼ばれる
   ↓
3. updateRecord({ clockIn: getCurrentTime() }) が実行
   ↓
4. 今日の記録を検索・作成・更新
   ↓
5. 勤務時間を計算（退勤済みの場合）
   ↓
6. saveRecord() で Firestore に保存
   ↓
7. setState() で状態を更新
   ↓
8. コンポーネントが再レンダリング
```

### データ読み込みの流れ

```
1. AttendanceSystem がマウント
   ↓
2. useEffect が実行
   ↓
3. loadRecords() で Firestore から読み込み
   ↓
4. 今日の記録を検索
   ↓
5. 状態を判定（出勤中、休憩中）
   ↓
6. setState() で状態を更新
   ↓
7. コンポーネントがレンダリング
```

## 状態管理

### 現在のアプローチ

- **React useState**: コンポーネント内の状態管理
- **Firestore**: データの永続化と同期
- **Props Drilling**: 親から子へのデータ受け渡し

### 状態の更新パターン

```typescript
// 1. 記録の更新
const updateRecord = (updates: Partial<AttendanceRecord>) => {
  // 記録の検索・作成・更新
  // 計算処理
  // 保存
  // 状態更新
};

// 2. 状態の同期
useEffect(() => {
  const records = loadRecords();
  // 状態の初期化
}, []);
```

## 設計原則

### 1. 単一責任の原則

各コンポーネント・関数は 1 つの責務のみを持つ：

- `AttendanceButton`: ボタンの表示とクリック処理
- `TodaySummary`: 本日の情報表示
- `MonthlyCalendar`: カレンダー表示
- `HistoryList`: 履歴リスト表示

### 2. 関心の分離

- **UI**: Components 層
- **ビジネスロジック**: AttendanceSystem
- **データアクセス**: Utils 層
- **型定義**: Types 層

### 3. DRY 原則

共通の処理はユーティリティ関数に抽出：

- 時間フォーマット: `formatTime()`
- 時間計算: `calculateMinutes()`
- データ保存: `saveRecord()`

## パフォーマンス考慮事項

### 現在の実装

- **再レンダリング**: 状態更新時に必要なコンポーネントのみ再レンダリング
- **メモ化**: 未実装（改善の余地あり）

### 改善の余地

- `getTodayRecord()`のメモ化（useMemo）
- コンポーネントのメモ化（React.memo）
- 仮想スクロール（HistoryList が長い場合）

## 拡張性

### 将来の拡張ポイント

1. **状態管理ライブラリの導入**

   - Zustand や Jotai の検討
   - 複雑な状態管理が必要になった場合

2. **カスタムフックの抽出**

   - `useAttendance()`: 出退勤ロジック
   - `useRecords()`: 記録管理ロジック

3. **認証機能の追加**

   - Firebase Authentication の統合
   - Firestore Security Rules の更新
   - ユーザー別データ管理

4. **オフライン対応の強化**
   - オフライン時のデータキューイング
   - 同期状態の表示
   - 競合解決の実装

## セキュリティ考慮事項

### 現在の実装

- クライアントサイドの処理
- Firestore への保存（クラウドベース）

### 注意点

- Firestore Security Rules で適切なアクセス制御を設定
- 環境変数の管理（`.env.local`に保存）
- XSS 対策は Next.js のデフォルト設定に依存

## テスト戦略

### 推奨されるテスト

1. **ユニットテスト**

   - ユーティリティ関数（time.ts, storage.ts）
   - 計算ロジック

2. **コンポーネントテスト**

   - 各コンポーネントの表示確認
   - インタラクションテスト

3. **統合テスト**
   - 出退勤フローのテスト
   - データ永続化のテスト

## まとめ

現在のアーキテクチャは、シンプルで理解しやすい構造になっています。小規模なアプリケーションには適していますが、機能が増えるにつれて、状態管理やコード構造の見直しが必要になる可能性があります。

改善点については [IMPROVEMENTS.md](../IMPROVEMENTS.md) を参照してください。
