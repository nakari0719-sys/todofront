# ひとつ — TODO管理フロントエンド

React / TypeScript / Tailwind CSS / Vite を使用した日本語のTODO管理アプリです。

## 起動方法

1. 既存のHono APIを `http://localhost:3000` で起動します。
2. このディレクトリで以下を実行します。

```sh
npm install
npm run dev
```

ターミナルに表示されるViteのURL（通常 `http://localhost:5173`）を開きます。

## 機能

- TODOの一覧取得・追加・タイトル編集・完了切り替え・削除
- すべて／未完了／完了済みの絞り込み、タイトル検索、進捗表示
- 読み込み中・保存中の表示、通信エラーと再読み込み
- 空白タイトルの送信防止、保存失敗時の入力保持、処理中の二重操作防止
- レスポンシブUI、キーボード操作、編集のEscapeキャンセル

## API接続

ブラウザからは相対URL `/api/todos` に `fetch` でアクセスします。開発時はViteが `/api` を取り除き、Hono APIへ転送するため、ブラウザ上のCORSエラーを回避できます。

| メソッド | Honoのパス | 送信JSON |
| --- | --- | --- |
| GET | `/todos` | — |
| POST | `/todos` | `{ "title": "買い物" }` |
| PUT | `/todos/:id` | `{ "title": "買い物", "completed": true }` |
| DELETE | `/todos/:id` | — |

GETは `Todo[]` を返す想定です。型は `{ id: string; title: string; completed: boolean }` です。変更後は一覧を再取得するため、POST・PUT・DELETEのレスポンス本文は不要です。APIリクエストは15秒でタイムアウトします。

Viteのプロキシは開発用です。本番公開時はホスティング側で `/api/*` からHonoへのリバースプロキシを設定してください。`npm run preview` はビルドの表示確認用です。

Firebaseの秘密鍵やAdmin SDKはフロントエンドで使用しません。秘密鍵はHono側のみで管理してください。`VITE_` 環境変数はブラウザへ公開されるため、秘密情報を設定しないでください。

## 検証

```sh
npm run typecheck
npm run lint
npm run build
```

## 主なファイル

- `src/App.tsx`：画面構成、フィルタと検索、進捗表示
- `src/components/TodoForm.tsx`：追加フォーム
- `src/components/TodoItem.tsx`：TODO表示・編集・完了切り替え・削除
- `src/components/Icon.tsx`：共通SVGアイコン
- `src/hooks/useTodos.ts`：取得・更新の状態管理、エラー処理
- `src/lib/api.ts`：fetch通信、HTTPエラー処理、一覧の型検証
- `src/types/todo.ts`：TODOと更新データの型
- `src/index.css` / `src/App.css`：Tailwind読み込みとレスポンシブスタイル
- `vite.config.ts`：React・Tailwind・開発用APIプロキシ
- `index.html` / `public/favicon.svg`：日本語メタ情報、アプリアイコン
- `package.json` / `package-lock.json`：Tailwind依存関係と型チェックスクリプト
