"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DynamicDrawingCanvas = dynamic(() => import('../components/DrawingCanvas/DrawingCanvas'), {
  ssr: false, // Ensure this component is only rendered on the client-side
  loading: () => <div>Loading...</div>, // Optional loading indicator
});

const DrawingCanvasPage = () => {
  return (
    <div>
      <h1>My Drawing Canvas</h1>
      <DynamicDrawingCanvas />
    </div>
  );
};

export default DrawingCanvasPage;
