# Firestore セットアップガイド

このドキュメントは、勤怠管理システムで Firestore Database を使用するためのセットアップ手順と使い方を説明します。

## 目次

- [Firestore とは](#firestoreとは)
- [セットアップ手順](#セットアップ手順)
- [環境変数の設定](#環境変数の設定)
- [Firestore の使い方](#firestoreの使い方)
- [データ構造](#データ構造)
- [トラブルシューティング](#トラブルシューティング)

## Firestore とは

Firestore は、Google Firebase が提供する NoSQL データベースです。このプロジェクトでは、勤務記録を Firestore に保存し、複数のデバイス間で同期できるようにしています。

### 主な特徴

- **リアルタイム同期**: データの変更が即座に反映されます
- **オフライン対応**: インターネット接続がない場合でも動作します
- **スケーラブル**: 大量のデータを効率的に処理できます
- **セキュリティ**: Firestore Security Rules でアクセス制御が可能です

## セットアップ手順

### 1. Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `attendance-system`）
4. Google Analytics の設定（オプション）
5. 「プロジェクトを作成」をクリック

### 2. Firestore Database の有効化

1. Firebase Console でプロジェクトを選択
2. 左メニューから「Firestore Database」を選択
3. 「データベースを作成」をクリック
4. セキュリティルールのモードを選択：
   - **テストモード**: 開発中はテストモード（30 日間有効）
   - **本番モード**: 本番環境では本番モードを推奨
5. ロケーションを選択（例: `asia-northeast1` - 東京）
6. 「有効にする」をクリック

### 3. Web アプリの登録

1. Firebase Console で「プロジェクトの概要」を開く
2. 「</>」アイコン（Web アプリを追加）をクリック
3. アプリのニックネームを入力（例: `Attendance Web App`）
4. 「Firebase Hosting も設定する」はチェックを外して OK
5. 表示される設定情報をコピー（後で使用します）

### 4. 環境変数の設定

1. プロジェクトルートに`.env.local`ファイルを作成
2. 以下の環境変数を設定：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**重要**: `.env.local`ファイルは`.gitignore`に含まれているため、Git にコミットされません。

### 5. セキュリティルールの設定

Firestore Console で「ルール」タブを開き、以下のルールを設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 勤務記録コレクション
    match /attendance_records/{date} {
      // 読み取り: 認証済みユーザーのみ（将来の認証実装用）
      allow read: if request.auth != null;
      // 書き込み: 認証済みユーザーのみ（将来の認証実装用）
      allow write: if request.auth != null;

      // 開発中は全員が読み書き可能（テストモード）
      // allow read, write: if true;
    }
  }
}
```

**注意**: 本番環境では適切な認証ルールを設定してください。

## 環境変数の設定

### 環境変数の取得方法

1. Firebase Console でプロジェクトを選択
2. 「プロジェクトの設定」（歯車アイコン）をクリック
3. 「全般」タブの「マイアプリ」セクションで、Web アプリの設定を確認
4. 各値を`.env.local`にコピー

### 環境変数の確認

開発サーバーを起動する前に、環境変数が正しく設定されているか確認：

```bash
# 開発サーバー起動
npm run dev
```

ブラウザのコンソールでエラーが出ないことを確認してください。

## Firestore の使い方

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

Firestore のデータ構造は以下の通りです：

```
attendance_records (コレクション)
  └── 2024-01-15 (ドキュメントID = 日付)
      ├── id: "2024-01-15"
      ├── date: "2024-01-15"
      ├── clockIn: "09:00"
      ├── clockOut: "18:00"
      ├── breakStart: "12:00"
      ├── breakEnd: "13:00"
      ├── totalWorkTime: 480 (分)
      ├── totalBreakTime: 60 (分)
      ├── createdAt: Timestamp
      └── updatedAt: Timestamp
```

### データの自動計算

`saveRecord`関数は、以下の計算を自動的に行います：

- **勤務時間**: `clockOut - clockIn - 休憩時間`
- **休憩時間**: `breakEnd - breakStart`
- **タイムスタンプ**: `createdAt`と`updatedAt`を自動設定

## データ構造

### AttendanceRecord 型

```typescript
interface AttendanceRecord {
  id: string; // ドキュメントID（日付: YYYY-MM-DD）
  date: string; // 日付 (YYYY-MM-DD)
  clockIn?: string; // 出勤時刻 (HH:mm)
  clockOut?: string; // 退勤時刻 (HH:mm)
  breakStart?: string; // 休憩開始時刻 (HH:mm)
  breakEnd?: string; // 休憩終了時刻 (HH:mm)
  totalWorkTime?: number; // 総勤務時間（分）
  totalBreakTime?: number; // 総休憩時間（分）
}
```

### Firestore のメタデータ

Firestore には以下のメタデータも保存されます：

- `createdAt`: ドキュメント作成日時（`serverTimestamp()`）
- `updatedAt`: ドキュメント更新日時（`serverTimestamp()`）

## トラブルシューティング

### エラー: "Firebase: Error (auth/permission-denied)"

**原因**: Firestore Security Rules でアクセスが拒否されています。

**解決方法**:

1. Firebase Console で「Firestore Database」→「ルール」を開く
2. ルールを確認し、適切な権限を設定
3. 開発中は一時的に`allow read, write: if true;`を設定（本番では削除）

### エラー: "Firebase: Error (app/no-app)"

**原因**: Firebase が正しく初期化されていません。

**解決方法**:

1. `.env.local`ファイルが存在するか確認
2. 環境変数が正しく設定されているか確認
3. `src/utils/firebase.ts`の設定を確認

### データが保存されない

**原因**: ネットワークエラーまたは Firestore の設定問題。

**解決方法**:

1. ブラウザのコンソールでエラーを確認
2. Firebase Console で Firestore が有効になっているか確認
3. ネットワーク接続を確認

### 環境変数が読み込まれない

**原因**: Next.js の環境変数の命名規則に従っていない。

**解決方法**:

1. 環境変数名が`NEXT_PUBLIC_`で始まっているか確認
2. `.env.local`ファイルがプロジェクトルートにあるか確認
3. 開発サーバーを再起動

## 次のステップ

### 認証機能の追加

将来的に認証機能を追加する場合：

1. Firebase Authentication を有効化
2. `src/utils/auth.ts`を作成
3. Firestore Security Rules を更新
4. コンポーネントで認証状態を管理

### オフライン対応の強化

現在の実装は基本的なオフライン対応がありますが、以下の改善が可能です：

- オフライン時のデータキューイング
- 同期状態の表示
- 競合解決の実装

### リアルタイム更新

Firestore の`onSnapshot`を使用して、リアルタイムでデータを更新：

```typescript
import { onSnapshot } from "firebase/firestore";

// リアルタイムでデータを監視
onSnapshot(recordsCollection, (snapshot) => {
  const records = snapshot.docs.map((doc) => toRecord(doc.id, doc.data()));
  // 状態を更新
});
```

## 参考リンク

- [Firestore ドキュメント](https://firebase.google.com/docs/firestore)
- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [Next.js 環境変数](https://nextjs.org/docs/basic-features/environment-variables)

## まとめ

Firestore を使用することで、以下のメリットがあります：

- データの永続化（ブラウザの localStorage とは異なり、サーバーに保存）
- 複数デバイス間での同期
- オフライン対応
- スケーラビリティ

適切にセットアップすれば、より堅牢な勤怠管理システムを構築できます。
