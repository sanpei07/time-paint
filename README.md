# Time Paint

Time Paintは、Next.jsで構築されたインタラクティブなAI駆動のお絵描きアプリケーションで、Google MagentaのSketchRNNモデルを使用してクリエイティブな絵を生成します。アプリケーションは最初に基本的な線を描き、その後、機械学習を使用して猫のようなパターンで描画を続けます。

## 特徴

- p5.jsを活用したインタラクティブなキャンバス描画
- Google MagentaのSketchRNNモデルを使用したAIアシスト描画生成
- 異なる色の段階でのリアルタイム描画表示
- 初期ストロークに基づく自動スケッチ完成

## 使用技術

- [Next.js 15](https://nextjs.org) と [Turbopack](https://turbo.build/pack)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [p5.js](https://p5js.org/) （[react-p5](https://www.npmjs.com/package/react-p5) 経由）
- 機械学習ベースの描画生成のための[Magenta SketchRNN](https://github.com/magenta/magenta-js/tree/master/sketch)
- スタイリングのための[TailwindCSS](https://tailwindcss.com/)

## 始め方

まず、依存関係をインストールします：

```bash
npm install
```

次に、開発サーバーを実行します：

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 動作の仕組み

1. アプリケーションは猫の描画を生成するためのSketchRNNモデルをロードします
2. 初期ストロークが異なる色（青と緑）で描かれます
3. AIモデルはその後、初期パターンに基づいて赤いストロークで描画を続けます
4. AIモデルが完了したと判断するまで描画は続きます

`app/components/p5/constants/index.ts` ファイルでモデルとパラメータを変更できます：
- `MODEL_URL`: SketchRNNモデルのURL（現在、猫のモデルを使用しています）
- `TEMPERATURE`: 生成されるストロークのランダム性を制御します（値が高いほどよりランダムになります）

## カスタマイズ

`app/page.tsx` を変更することでページの編集を始めることができます。ファイルを編集すると、ページは自動的に更新されます。

AI描画の動作をカスタマイズするには、以下のファイルを調べてみてください：
- `app/components/p5/hooks/useP5Functions.ts`: メインの描画ロジックを含みます
- `app/components/p5/model/sketchRNN.ts`: SketchRNNモデルとの相互作用を処理します
- `app/components/p5/utils/drawing.ts`: 描画ユーティリティを提供します

## 詳細情報

Next.jsについてもっと学ぶには、以下のリソースをご覧ください：

- [Next.jsドキュメント](https://nextjs.org/docs) - Next.jsの機能とAPIについて学びます。
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアルです。

MagentaとSketchRNNについての詳細情報：
- [Magentaプロジェクト](https://magenta.tensorflow.org/) - AIと創造性について探求します
- [SketchRNNデモ](https://magenta.tensorflow.org/sketch-rnn-demo) - モデルができることの例を見ます

## Vercelでのデプロイ

Next.jsアプリをデプロイする最も簡単な方法は、Next.jsの作成者による[Vercelプラットフォーム](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)を使用することです。

詳細については、[Next.jsデプロイドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)をご覧ください。
