import { FancyButton, AnimatedCard } from '@sudarshanaui/ui';
import React from 'react';
function App() {
  return (
    <>
      <FancyButton label="Click Me"  style={{ 
        marginTop: '20px', 
        filter: 'hue-rotate(90deg)'
      }}  />
      <AnimatedCard title="Hello World" content="This is a verified component." />
    </>
  );

}
export default App;