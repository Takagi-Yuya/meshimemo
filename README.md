# MESHIMEMO（メシメモ）

SNSで見つけたレシピを保存して、自分だけのジャンル別メニュー表を育てるアプリ。

「今日なに作ろう？」「何食べたい？」をサクッと解決します。

## どんなアプリ？

1. **レシピを保存** - URLを貼るだけ。メモや写真も追加できる
2. **メニュー表になる** - 料理・パン・お菓子・ハンドメイドのジャンル別に自動整理
3. **「今日なに作る？」** - 登録したレシピからランダム提案。最近作ってないものを優先
4. **作ったら記録** - 写真とメモで「作った！」を残す。カレンダーで振り返り
5. **夫婦で共有** - パートナーを招待して一緒に使える

## 画面イメージ

| ホーム（メニュー表） | レシピ登録 | 今日なに作る？ | カレンダー |
|:---:|:---:|:---:|:---:|
| ジャンル別タブで一覧 | タイトル・URL・写真を入力 | ランダムで1品提案 | 作った日にサムネ表示 |

## 技術スタック

- **フロントエンド**: React + TypeScript（Vite）
- **UI**: Tailwind CSS
- **バックエンド**: Firebase（サーバーなし）
  - Authentication（Googleログイン）
  - Cloud Firestore（データベース）
  - Cloud Storage（写真保存）
  - Hosting（公開）

## セットアップ

### 1. Firebase プロジェクトを作成

[Firebase Console](https://console.firebase.google.com/) で以下を有効化:

- Authentication → Google プロバイダ
- Cloud Firestore（asia-northeast1）
- Cloud Storage
- Hosting

### 2. 環境変数を設定

```bash
cp .env.example .env
```

`.env` に Firebase コンソールから取得した設定値を入力:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. 起動

```bash
nvm use 22
npm install
npm run dev
```

### 4. デプロイ

```bash
npm run build
npx firebase deploy
```

## セキュリティルール

Firestore・Storage のルールは同梱済み（`firestore.rules`, `storage.rules`）。
同じ世帯のメンバーだけがデータを読み書きできるようになっています。
