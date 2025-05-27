# Time Paint

English | [日本語](README.ja.md)

Time Paint is an interactive AI-powered drawing application built with Next.js that uses Google's Magenta SketchRNN model to generate creative drawings. The application starts by drawing initial strokes and then uses machine learning to continue the drawing in a cat-like pattern.

## Features

- Interactive canvas drawing powered by p5.js
- AI-assisted drawing generation using Google's Magenta SketchRNN model
- Real-time drawing visualization with different colored stages
- Automatic sketch completion based on initial strokes

## Technologies

- [Next.js 15](https://nextjs.org) with [Turbopack](https://turbo.build/pack)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [p5.js](https://p5js.org/) via [react-p5](https://www.npmjs.com/package/react-p5)
- [Magenta SketchRNN](https://github.com/magenta/magenta-js/tree/master/sketch) for machine learning-based drawing generation
- [TailwindCSS](https://tailwindcss.com/) for styling

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How it Works

1. The application loads the SketchRNN model for generating cat drawings
2. Initial strokes are drawn in different colors (blue and green)
3. The AI model then continues the drawing with red strokes based on the initial pattern
4. The drawing continues until the AI model determines it is complete

You can modify the model and parameters in the `app/components/p5/constants/index.ts` file:
- `MODEL_URL`: The URL to the SketchRNN model (currently using a cat model)
- `TEMPERATURE`: Controls the randomness of the generated strokes (higher values = more random)

## Customization

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

To customize the AI drawing behavior, explore the following files:
- `app/components/p5/hooks/useP5Functions.ts`: Contains the main drawing logic
- `app/components/p5/model/sketchRNN.ts`: Handles the interaction with the SketchRNN model
- `app/components/p5/utils/drawing.ts`: Provides drawing utilities

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

For more information about Magenta and SketchRNN:
- [Magenta Project](https://magenta.tensorflow.org/) - explore AI and creativity
- [SketchRNN Demo](https://magenta.tensorflow.org/sketch-rnn-demo) - see examples of what the model can do

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
