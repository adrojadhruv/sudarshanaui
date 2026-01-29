# @sudarshanaui/ui

<div align="center">
  <img src="https://sudarshanaui.vercel.app/golden_circle.png" alt="Sudarshana UI Logo" width="120" />
  <h1>Sudarshana UI</h1>
  <p><strong>Modern. Animated. React.</strong></p>
  <p>A collection of modern, animated React components for building immersive user interfaces.</p>

  [![npm version](https://img.shields.io/npm/v/@sudarshanaui/ui.svg?style=flat-square)](https://www.npmjs.com/package/@sudarshanaui/ui)
</div>

---

## Introduction

**Sudarshana UI** provides a set of high-quality, animated components to enhance your React application. From kinetic buttons to glassmorphism cards, these components are designed to drop into your project and provide instant visual appeal.

## Installation

Install the package via npm:

```bash
npm install @sudarshanaui/ui
```

## Usage

Import components directly into your React application:

```jsx
import React from 'react';
import { FancyButton, AnimatedCard } from '@sudarshanaui/ui';

const App = () => {
  return (
    <div className="app-container">
      <AnimatedCard>
        <h2>Hello World</h2>
        <FancyButton onClick={() => alert('Clicked!')}>
          Click Me
        </FancyButton>
      </AnimatedCard>
    </div>
  );
};

export default App;
```

## Available Components

- **General**:
  - `FancyButton`: A clear, modern button with hover effects.
  - `AnimatedCard`: A card container with smooth entry animations.
  - `AnimatedTextfield`: An input field with animated focus states.
  - `AnimatedOtp`: An OTP input with validation animations.
  - `NormalFooter`, `AnimatedFooter`: Pre-built footer components.

- **Admin's Choice (Premium Effects)**:
  - `AdminchoiceKineticMarqueeButton`: Button with scrolling text on hover.
  - `AdminchoiceNoiseGlassCard`: Glassmorphism card with noise texture.
  - `AdminchoiceMagneticAttractionButton`: Button that follows cursor movement.
  - `AdminchoiceGlitchTitle`: Text component with cyber-glitch effects.
  - `AdminchoiceSpotlightInput`: Input with a moving spotlight border.
  - ...and more.

## License

MIT © [Sudarshana Team](https://sudarshanaui.vercel.app)
