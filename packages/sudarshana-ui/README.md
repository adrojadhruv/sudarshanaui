# @sudarshana/ui

<div align="center">
  <img src="https://via.placeholder.com/150" alt="Sudarshana UI Logo" width="120" />
  <h1>Sudarshana UI</h1>
  <p><strong>Elegant. Modern. Infinite.</strong></p>
  <p>The official React component library for the Sudarshana ecosystem.</p>

  [![npm version](https://img.shields.io/npm/v/@sudarshana/ui.svg?style=flat-square)](https://www.npmjs.com/package/@sudarshana/ui)
  [![License](https://img.shields.io/npm/l/@sudarshana/ui.svg?style=flat-square)](LICENSE)
</div>

---

## Introduction

**Sudarshana UI** is a meticulously crafted collection of React components designed to build immersive and high-performance web applications. Inspired by cosmic aesthetics and built for modern developers, it provides a seamless developer experience with award-winning visual quality.

## Features

- 🎨 **Award-Winning Design**: Components inspired by top-tier design trends (Awwwards, Webby).
- 🧩 **Modular & Composable**: Import only what you need.
- ♿ **Accessible**: Built with WAI-ARIA standards in mind.
- ⚡ **High Performance**: Optimized for speed and minimal bundle size.
- 🌙 **Dark Mode Ready**: First-class support for dark themes.

## Installation

Install the package via npm:

```bash
npm install @sudarshanaui/ui
```

Or using yarn:

```bash
yarn add @sudarshanaui/ui
```

## Usage

Import components directly into your React application:

```jsx
import React from 'react';
import { PrismButton, VoidCard } from '@sudarshana/ui';

const App = () => {
  return (
    <div className="app-container">
      <VoidCard title="Welcome to Sudarshana">
        <p>Explore the infinite possibilities.</p>
        <PrismButton variant="cosmic" onClick={() => console.log('Clicked!')}>
          Launch
        </PrismButton>
      </VoidCard>
    </div>
  );
};

export default App;
```

## Available Components

- **PrismButton**: A button component with prismatic light effects.
- **VoidCard**: A depth-defying card container.
- **LiquidToggle**: A fluid state toggle switch.
- ...and many more being added regularly.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Sudarshana Team](https://sudarshana.com)
