import React, {useEffect, useRef, useState} from 'react';
import Canvas from './components/Canvas';
import {Pixel} from './types';
import './App.css'

const App: React.FC = () => {
  const [canvasState, setCanvasState] = useState<Pixel[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/canvas');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCanvasState(prev => [...prev, ...data.pixels]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div>
      <h1>Canvas</h1>
      <Canvas ws={ws.current} canvasState={canvasState}/>
    </div>
  );
};

export default App;
