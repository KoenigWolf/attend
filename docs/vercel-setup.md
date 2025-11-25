# Vercel 環境変数設定ガイド

このドキュメントは、Vercel で Supabase 環境変数を設定する手順を説明します。

## 問題

`.env.local`ファイルは`.gitignore`に含まれているため、GitHub にプッシュされません。そのため、Vercel でデプロイしたときに環境変数が設定されていないと、データベース接続エラーが発生します。

## 解決方法

Vercel のダッシュボードで環境変数を設定する必要があります。

## 設定手順

### 1. Vercel ダッシュボードにアクセス

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択

### 2. 環境変数の設定

1. プロジェクトの「Settings」タブを開く
2. 左メニューから「Environment Variables」を選択
3. 「Add New」をクリック

### 3. 必要な環境変数を追加

以下の 2 つの環境変数を追加します：

#### 環境変数 1: `NEXT_PUBLIC_SUPABASE_URL`

- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Supabase Dashboard の「Settings」→「API」から取得した「Project URL」
  - 例: `https://ztthwozekqutlksfvwzf.supabase.co`
- **Environment**: すべての環境にチェック（Production、Preview、Development）
- 「Save」をクリック

#### 環境変数 2: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Supabase Dashboard の「Settings」→「API」から取得した「anon public」キー
  - 例: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Environment**: すべての環境にチェック（Production、Preview、Development）
- 「Save」をクリック

### 4. 環境変数の確認

設定後、以下のように表示されます：

```
NEXT_PUBLIC_SUPABASE_URL          [Production] [Preview] [Development]
NEXT_PUBLIC_SUPABASE_ANON_KEY     [Production] [Preview] [Development]
```

### 5. 再デプロイ

環境変数を設定した後、以下のいずれかの方法で再デプロイします：

#### 方法 1: 自動再デプロイ

- 新しいコミットをプッシュすると自動的に再デプロイされます

#### 方法 2: 手動再デプロイ

1. Vercel ダッシュボードでプロジェクトを開く
2. 「Deployments」タブを開く
3. 最新のデプロイメントの「...」メニューをクリック
4. 「Redeploy」を選択

## 環境変数の取得方法

### Supabase Dashboard から取得

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクトを選択
3. 「Settings」→「API」を開く
4. 以下の情報をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 確認方法

### デプロイ後の確認

1. Vercel でデプロイが完了したら、サイトにアクセス
2. ブラウザの開発者ツール（F12）でコンソールを開く
3. エラーが出ていないか確認

### エラーが出る場合

以下のエラーが出る場合は、環境変数が正しく設定されていない可能性があります：

- `Supabase URL/anon key is not set`
- `Failed to save record`
- `Row Level Security policy violation`

**解決方法**:

1. Vercel の環境変数設定を再確認
2. 環境変数名が正しいか確認（`NEXT_PUBLIC_`で始まる）
3. すべての環境（Production、Preview、Development）にチェックが入っているか確認
4. 再デプロイを実行

## セキュリティに関する注意

- **anon key は公開されても問題ありません**（`NEXT_PUBLIC_`で始まる環境変数はクライアント側に公開されます）
- ただし、RLS（Row Level Security）ポリシーを適切に設定してください
- 本番環境では、認証機能を追加することを推奨します

## トラブルシューティング

### 環境変数が反映されない

1. 環境変数名が正しいか確認（大文字小文字を区別）
2. `NEXT_PUBLIC_`で始まっているか確認
3. 再デプロイを実行
4. ブラウザのキャッシュをクリア

### デプロイ後にエラーが出る

1. Vercel のログを確認（「Deployments」→「View Function Logs」）
2. 環境変数が正しく設定されているか確認
3. Supabase の RLS ポリシーを確認

## まとめ

Vercel で環境変数を設定することで、`.env.local`ファイルを GitHub にプッシュしなくても、本番環境で Supabase に接続できるようになります。

設定後は、必ず再デプロイを実行してください。
