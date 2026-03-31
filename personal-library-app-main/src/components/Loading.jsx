import { Html } from '@react-three/drei';
import React from 'react';

export const Loading = () => {
  return (
    <Html center>
      <div className="loading-container">
        <div className="glass-panel">
          <div className="spinner"></div>
          <h2>Loading Experience...</h2>
          <p>Preparing high-quality 3D assets</p>
        </div>
      </div>
    </Html>
  );
};
