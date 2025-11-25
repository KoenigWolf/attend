# AI 開発ガイド

このドキュメントは、AI（特に Cursor AI や GitHub Copilot）が効率的に開発できるように設計されたガイドラインです。

## 目的

AI 開発者が以下を効率的に行えるようにする：

- コードベースの理解
- 適切なコード生成
- 一貫性のある実装
- バグの回避

## プロジェクト概要

### 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript (strict mode)
- **スタイリング**: Tailwind CSS
- **日付処理**: date-fns
- **状態管理**: React useState (Supabase 永続化)

### アーキテクチャパターン

- **コンポーネント構造**: プレゼンテーション層とコンテナ層の分離
- **データフロー**: 単方向データフロー（親 → 子）
- **状態管理**: コンポーネント内状態 + Supabase

## 重要な設計原則

### 1. 単一責任の原則

各コンポーネント・関数は 1 つの責務のみを持つ。

**良い例**:

```typescript
// 時刻をフォーマットするだけ
export const formatTime = (time: string | undefined): string => {
  // ...
};
```

**悪い例**:

```typescript
// フォーマット + 保存 + 計算を同時に行う（避ける）
export const formatAndSaveTime = (time: string) => {
  // ...
};
```

### 2. 型安全性

すべての関数とコンポーネントに適切な型を定義する。

**必須**:

- Props の型定義
- 関数の引数・戻り値の型
- `any`型の使用を避ける

### 3. 命名規則

- **コンポーネント**: PascalCase (`AttendanceButton`)
- **関数**: camelCase (`getCurrentTime`)
- **型**: PascalCase (`AttendanceRecord`)
- **定数**: UPPER_SNAKE_CASE (`STORAGE_KEY`)

### 4. ファイル構造

```
src/
├── app/          # Next.js App Router
├── components/    # Reactコンポーネント
├── types/         # TypeScript型定義
└── utils/         # ユーティリティ関数
```

## コーディングガイドライン

### コンポーネントの作成

#### 基本構造

```typescript
'use client'  // クライアントコンポーネントの場合

import { ... } from '...'

interface ComponentProps {
  // Propsの型定義
}

export default function Component({ ... }: ComponentProps) {
  // 実装
  return (
    // JSX
  )
}
```

#### コンポーネントの責務

- **表示コンポーネント**: Props を受け取り、表示のみ
- **コンテナコンポーネント**: 状態管理とビジネスロジック

### 状態管理

#### useState の使用

```typescript
const [state, setState] = useState<AttendanceState>({
  records: [],
  isClockedIn: false,
  isOnBreak: false,
});
```

#### useEffect の使用

```typescript
useEffect(() => {
  // マウント時の処理
  const records = loadRecords();
  // ...
}, []); // 依存配列を適切に設定
```

### ユーティリティ関数

#### 関数の構造

```typescript
// 1. 型定義
export const functionName = (param: ParamType): ReturnType => {
  // 2. 早期リターン（エラーケース）
  if (!param) return defaultValue;

  // 3. エラーハンドリング
  try {
    // 処理
  } catch (e) {
    console.error("Error message:", e);
    return defaultValue;
  }

  // 4. 正常な処理
  return result;
};
```

### エラーハンドリング

#### パターン

```typescript
// 1. 早期リターン
if (!data) return null;

// 2. try-catch
try {
  // 処理
} catch (e) {
  console.error("Error:", e);
  // フォールバック処理
}

// 3. オプショナルチェーン
const value = data?.property?.nested;
```

## スタイリングガイドライン

### Tailwind CSS の使用

#### クラス名の順序（推奨）

1. レイアウト（flex, grid, etc.）
2. サイズ（w-, h-, p-, m-）
3. 色（bg-, text-, border-）
4. その他（rounded, shadow, etc.）

#### レスポンシブデザイン

```typescript
// モバイルファースト
className = "text-base sm:text-lg lg:text-xl";
```

#### デザインシステムの使用

- カラー: `slate`, `blue`, `emerald`, `amber`
- 角丸: `rounded-2xl`, `rounded-3xl`
- 影: `shadow-sm`, `shadow-md`
- ガラスモーフィズム: `bg-white/80 backdrop-blur`

詳細は [DESIGN_GUIDE.md](../DESIGN_GUIDE.md) を参照。

## 避けるべきパターン

### 1. 直接的な DOM 操作

```typescript
//  悪い例
document.getElementById('button').addEventListener(...)

//  良い例
<button onClick={handleClick}>...</button>
```

### 2. グローバル変数の使用

```typescript
//  悪い例
let globalState = {};

//  良い例
const [state, setState] = useState({});
```

### 3. 副作用の混在

```typescript
//  悪い例
const handleClick = () => {
  updateState();
  saveToStorage();
  calculateTime();
  renderUI();
};

//  良い例
const handleClick = () => {
  updateRecord();
  // updateRecord内で必要な処理をすべて行う
};
```

### 4. 型の省略

```typescript
//  悪い例
const getTime = (time) => {
  return time;
};

//  良い例
const getTime = (time: string | undefined): string => {
  return time || "--:--";
};
```

## コード生成時のチェックリスト

新しいコードを生成する際は、以下を確認：

### コンポーネント

- [ ] `'use client'`ディレクティブがあるか（必要に応じて）
- [ ] Props の型定義があるか
- [ ] 適切な命名規則を使用しているか
- [ ] エラーハンドリングがあるか
- [ ] アクセシビリティ属性（aria-label 等）があるか

### 関数

- [ ] 型定義があるか
- [ ] エラーハンドリングがあるか
- [ ] 早期リターンを使用しているか
- [ ] 適切な命名規則を使用しているか

### スタイリング

- [ ] Tailwind CSS を使用しているか
- [ ] レスポンシブデザインを考慮しているか
- [ ] デザインシステムに準拠しているか

## 参照すべきドキュメント

コード生成時は、以下のドキュメントを参照：

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - アーキテクチャの理解
2. **[CODE_STRUCTURE.md](./CODE_STRUCTURE.md)** - ファイル構造の理解
3. **[DESIGN_GUIDE.md](../DESIGN_GUIDE.md)** - スタイリングガイド
4. **[IMPROVEMENTS.md](../IMPROVEMENTS.md)** - 既知の問題と改善点

## よくあるタスク

### 新しいコンポーネントを追加する場合

1. **型定義を確認** (`src/types/attendance.ts`)
2. **コンポーネントファイルを作成** (`src/components/ComponentName.tsx`)
3. **基本構造を実装**:

   ```typescript
   'use client'

   interface ComponentNameProps {
     // Props
   }

   export default function ComponentName({ ... }: ComponentNameProps) {
     return (
       // JSX
     )
   }
   ```

4. **スタイリングを適用** (Tailwind CSS)
5. **親コンポーネントに統合**

### 新しいユーティリティ関数を追加する場合

1. **適切なファイルを選択** (`storage.ts` or `time.ts`)
2. **型定義を追加**:
   ```typescript
   export const functionName = (param: ParamType): ReturnType => {
     // 実装
   };
   ```
3. **エラーハンドリングを追加**
4. **テストケースを考える**

### 状態管理を追加する場合

1. **型定義を確認** (`AttendanceState`)
2. **useState を追加**:
   ```typescript
   const [state, setState] = useState<StateType>(initialValue);
   ```
3. **更新関数を実装**
4. **Supabase への保存を考慮**（必要に応じて）

## デバッグのヒント

### よくある問題

1. **型エラー**

   - TypeScript のエラーメッセージを確認
   - 型定義を確認
   - `any`型の使用を避ける

2. **状態が更新されない**

   - `setState`が正しく呼ばれているか
   - 依存配列を確認（useEffect）
   - イミュータブルな更新を確認

3. **スタイルが適用されない**
   - Tailwind クラス名を確認
   - レスポンシブプレフィックスを確認
   - カスタムクラスが必要か確認

## リファクタリングのガイドライン

### リファクタリングを行う場合

1. **既存のコードを理解する**
2. **テストケースを考える**（可能であれば）
3. **小さなステップで進める**
4. **型安全性を維持する**
5. **既存のパターンに従う**

### リファクタリングの優先順位

1. **高**: バグ修正、パフォーマンス改善
2. **中**: コードの可読性向上、型安全性の向上
3. **低**: スタイリングの微調整、コメントの追加

## コメントの書き方

### 必要なコメント

```typescript
// 複雑なロジックの説明
// 日付を跨ぐ場合の処理
if (endTime < startTime) {
  // 翌日に跨ぐ場合は24時間を加算
  minutes += 24 * 60;
}

// TODO: 将来の改善点
// TODO: 複数休憩のサポートが必要
```

### 不要なコメント

```typescript
//  自明なコメント
const time = getCurrentTime(); // 現在時刻を取得

//  コード自体が説明になっている
const currentTime = getCurrentTime();
```

## 学習リソース

### プロジェクト固有

- [Next.js App Router ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [date-fns ドキュメント](https://date-fns.org)

### 一般的なベストプラクティス

- [React ベストプラクティス](https://react.dev/learn)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)

## コードレビューチェックリスト

AI が生成したコードをレビューする際：

- [ ] 型定義が適切か
- [ ] エラーハンドリングがあるか
- [ ] 命名規則に従っているか
- [ ] 既存のパターンに従っているか
- [ ] デザインシステムに準拠しているか
- [ ] アクセシビリティを考慮しているか
- [ ] パフォーマンスを考慮しているか
- [ ] コメントが適切か

## まとめ

このガイドに従うことで、AI 開発者は：

- 一貫性のあるコードを生成できる
- 既存のコードベースと調和する
- バグを減らす
- 開発効率を向上させる

質問や改善提案がある場合は、Issue を作成してください。
