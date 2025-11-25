# デザインガイド

## 概要

このデザインガイドは、勤怠管理システムの一貫性のあるデザイン言語を定義します。モダンでクリーン、かつ使いやすい UI を実現するためのガイドラインです。

---

## デザイン哲学

### コア原則

1. **シンプルさ**: 不要な装飾を排除し、本質的な機能に焦点を当てる
2. **視認性**: 重要な情報を明確に、階層的に表示する
3. **一貫性**: 全コンポーネントで統一されたデザイン言語を使用
4. **アクセシビリティ**: 十分なコントラストと明確なインタラクションを提供
5. **モダンな美学**: ガラスモーフィズムとグラデーションを活用した現代的デザイン

---

## カラーパレット

### プライマリカラー

```css
/* ブルー系 - メインアクション、重要情報 */
blue-600: #2563eb
blue-700: #1d4ed8
indigo-600: #4f46e5
indigo-700: #4338ca

/* 使用例: 出勤ボタン、ステータス表示 */
```

### セカンダリカラー

```css
/* スレート系 - テキスト、ボーダー、背景 */
slate-50: #f8fafc
slate-100: #f1f5f9
slate-200: #e2e8f0
slate-300: #cbd5e1
slate-400: #94a3b8
slate-500: #64748b
slate-600: #475569
slate-700: #334155
slate-800: #1e293b
slate-900: #0f172a

/* 使用例: テキスト、カード背景、ボーダー */
```

### セマンティックカラー

```css
/* 成功・完了 - エメラルド系 */
emerald-50: #ecfdf5
emerald-100: #d1fae5
emerald-700: #047857
emerald-800: #065f46

/* 使用例: 退勤済みステータス、記録済みカレンダー日付 */

/* 警告・注意 - アンバー系 */
amber-50: #fffbeb
amber-100: #fef3c7
amber-600: #d97706
amber-700: #b45309
amber-800: #92400e

/* 使用例: 休憩ボタン、休憩時間表示 */

/* 情報 - ブルー系 */
blue-50: #eff6ff
blue-100: #dbeafe
blue-700: #1d4ed8

/* 使用例: 勤務中ステータス、勤務時間表示 */

/* エラー・未完了 - ローズ系 */
rose-500: #f43f5e

/* 使用例: 日曜日の表示 */
```

### 背景グラデーション

```css
/* メインバックグラウンド */
background: radial-gradient(
    circle at 20% 20%,
    #e4edff 0,
    rgba(228, 237, 255, 0) 22%
  ), radial-gradient(circle at 80% 0%, #f6f4ff 0, rgba(246, 244, 255, 0) 20%),
  linear-gradient(135deg, #f7f8fb 0%, #ffffff 60%, #f2f7ff 100%);
```

---

## タイポグラフィ

### フォントファミリー

```css
font-family: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
  "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
```

### フォントウェイト

- **400 (Regular)**: 本文テキスト
- **500 (Medium)**: サブテキスト
- **600 (Semibold)**: ラベル、サブヘッダー
- **700 (Bold)**: 見出し、強調テキスト

### タイポグラフィスケール

```css
/* 見出し */
h1: text-3xl sm:text-4xl font-bold tracking-tight
h2: text-2xl font-bold
h3: text-xl font-bold

/* 本文 */
body: text-base (16px)
small: text-sm (14px)
tiny: text-xs (12px)

/* 特殊 */
label: text-xs font-semibold uppercase tracking-[0.2em]
```

### テキストカラー

```css
/* 主要テキスト */
text-slate-900: #0f172a

/* セカンダリテキスト */
text-slate-500: #64748b
text-slate-400: #94a3b8

/* 強調テキスト */
text-blue-700: #1d4ed8
text-emerald-700: #047857
text-amber-600: #d97706
```

---

## スペーシング

### 基本単位

Tailwind CSS のデフォルトスペーシングスケールを使用（4px 基準）

```css
/* 主要なスペーシング */
gap-2: 0.5rem (8px)
gap-3: 0.75rem (12px)
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)
gap-8: 2rem (32px)

/* パディング */
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-7: 1.75rem (28px)
p-8: 2rem (32px)

/* マージン */
space-y-6: 1.5rem (24px)
space-y-8: 2rem (32px)
```

---

## レイアウト

### コンテナ

```css
/* メインコンテナ */
max-w-6xl mx-auto

/* ページパディング */
px-4 py-10 sm:py-14
```

### グリッドシステム

```css
/* 2カラムグリッド */
grid grid-cols-1 lg:grid-cols-2 gap-6

/* 3カラムグリッド */
grid lg:grid-cols-3 gap-6

/* 4カラムグリッド */
grid grid-cols-2 md:grid-cols-4 gap-4

/* 7カラムグリッド（カレンダー） */
grid grid-cols-7 gap-2
```

---

## コンポーネントスタイル

### カードコンポーネント

```css
/* 基本カード */
bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8

/* 特徴 */
- 半透明背景 (white/80)
- ガラスモーフィズム効果 (backdrop-blur)
- 大きな角丸 (rounded-3xl = 24px)
- 柔らかい影 (shadow-sm)
- 薄いボーダー (border-slate-100)
```

### ボタンコンポーネント

#### プライマリボタン

```css
bg-gradient-to-r from-blue-600 to-indigo-600
text-white
shadow-md shadow-blue-200
hover:shadow-lg hover:from-blue-700 hover:to-indigo-700
```

#### セカンダリボタン

```css
bg-white
text-slate-900
border border-slate-200
hover:border-slate-300
shadow-sm
```

#### 警告ボタン

```css
bg-amber-50
text-amber-800
border border-amber-100
hover:border-amber-200
```

#### 情報ボタン

```css
bg-emerald-50
text-emerald-800
border border-emerald-100
hover:border-emerald-200
```

#### 無効化ボタン

```css
bg-slate-100
text-slate-400
border border-dashed border-slate-200
cursor-not-allowed
shadow-none
```

#### ボタン共通スタイル

```css
rounded-2xl
px-4 py-5
font-semibold text-lg
transition-all duration-200
transform
hover:-translate-y-0.5
active:translate-y-0
```

### バッジ・ステータス

```css
/* ステータスバッジ */
rounded-full
px-3 py-1
text-xs font-bold

/* 例: 勤務中 */
text-blue-700 bg-blue-50 ring-1 ring-blue-100

/* 例: 退勤済み */
text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100

/* 例: 未出勤 */
text-amber-700 bg-amber-50 ring-1 ring-amber-100
```

### 情報カード（TodaySummary）

```css
/* 情報カード */
rounded-2xl
border border-slate-100
bg-slate-50/60
p-4
shadow-inner

/* ラベル */
text-xs font-semibold text-slate-500 mb-2

/* 値 */
text-2xl font-bold text-slate-900
```

### カレンダー

```css
/* カレンダー日付セル */
aspect-square
p-2
rounded-2xl
border
transition-all

/* 今日の日付 */
border-blue-500
bg-blue-50/70
shadow-[0_10px_40px_-24px_rgba(37,99,235,0.6)]

/* 記録あり */
ring-1 ring-emerald-100
bg-emerald-50/60

/* 通常の日付 */
border-slate-200
bg-white
```

---

## アニメーションとインタラクション

### トランジション

```css
/* 基本トランジション */
transition-all duration-200

/* ホバーエフェクト */
hover:-translate-y-0.5
hover:shadow-md
hover:shadow-lg

/* アクティブ状態 */
active:translate-y-0
```

### インタラクティブ要素

- **ボタン**: ホバー時に軽く上に移動（-translate-y-0.5）
- **カード**: ホバー時に影が強くなる
- **リストアイテム**: ホバー時に軽く上に移動し、影が追加される

---

## レスポンシブデザイン

### ブレークポイント

Tailwind CSS のデフォルトブレークポイントを使用：

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### レスポンシブパターン

```css
/* フレックス方向の変更 */
flex-col sm:flex-row

/* グリッドカラム数の変更 */
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3

/* テキストサイズの変更 */
text-3xl sm:text-4xl

/* パディングの変更 */
p-6 sm:p-7 sm:p-8
```

---

## シャドウ

```css
/* シャドウスケール */
shadow-sm: 小さな影（カード、ボタン）
shadow-md: 中程度の影（ホバー時のボタン）
shadow-lg: 大きな影（ホバー時のプライマリボタン）

/* カスタムシャドウ */
shadow-blue-200: ブルー系の影
shadow-[0_10px_40px_-24px_rgba(37,99,235,0.6)]: カスタム影（今日の日付）

/* 内側の影 */
shadow-inner: 情報カードの内側の影
```

---

## ボーダー

```css
/* ボーダースタイル */
border: 1px solid
border-dashed: 破線ボーダー（無効化ボタン、空の状態）

/* ボーダーカラー */
border-slate-100: 薄いグレー
border-slate-200: 標準グレー
border-blue-500: ブルー（強調）
border-amber-100: アンバー（警告）
border-emerald-100: エメラルド（成功）

/* ボーダー半径 */
rounded-2xl: 16px（ボタン、カード）
rounded-3xl: 24px（メインカード）
rounded-full: 完全な円（バッジ）
```

---

## ガラスモーフィズム

```css
/* ガラスモーフィズム効果 */
bg-white/80: 80%の不透明度の白背景
backdrop-blur: 背景をぼかす

/* 使用例 */
bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-slate-100
```

---

## コンポーネント別ガイドライン

### AttendanceButton

- **サイズ**: `w-full h-full`
- **パディング**: `px-4 py-5`
- **角丸**: `rounded-2xl`
- **フォント**: `text-lg font-semibold`
- **バリアント**: primary, secondary, warning, info
- **無効化**: グレーアウト、破線ボーダー、カーソル変更

### TodaySummary

- **レイアウト**: 4 カラムグリッド（モバイル: 2 カラム）
- **情報カード**: `bg-slate-50/60`、`shadow-inner`
- **値の強調**: `text-2xl font-bold`

### MonthlyCalendar

- **グリッド**: 7 カラム（曜日）
- **日付セル**: `aspect-square`で正方形
- **今日の日付**: ブルー系の強調表示
- **記録あり**: エメラルド系のリング

### HistoryList

- **最大高さ**: `max-h-96`
- **スクロール**: `overflow-y-auto`
- **リストアイテム**: ホバー時に上に移動、影が追加

---

## アクセシビリティ

### コントラスト比

- テキストと背景のコントラスト比は WCAG AA 基準（4.5:1 以上）を満たす
- 主要テキスト（slate-900）と白背景:  十分
- セカンダリテキスト（slate-500）と白背景:  十分

### インタラクション

- すべてのインタラクティブ要素に明確なホバー状態
- 無効化された要素は視覚的に区別可能
- フォーカス状態を明確に表示（ブラウザデフォルトまたはカスタム）

---

## 使用例

### 新しいカードコンポーネントを作成する場合

```tsx
<div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-slate-100 p-6">
  {/* コンテンツ */}
</div>
```

### 新しいボタンを作成する場合

```tsx
<button className="rounded-2xl px-4 py-5 font-semibold text-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200">
  ボタンテキスト
</button>
```

### ステータスバッジを作成する場合

```tsx
<span className="rounded-full px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 ring-1 ring-blue-100">
  ステータス
</span>
```

---

## まとめ

このデザインガイドに従うことで、一貫性のある、モダンで使いやすい UI を実現できます。新しいコンポーネントを追加する際は、このガイドラインを参照してください。

### チェックリスト

- [ ] カラーパレットに準拠しているか
- [ ] 適切なスペーシングを使用しているか
- [ ] レスポンシブデザインを考慮しているか
- [ ] アニメーションとインタラクションが適切か
- [ ] アクセシビリティ基準を満たしているか
- [ ] 既存のコンポーネントと一貫性があるか
