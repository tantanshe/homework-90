import React, {useRef, useEffect, useState} from 'react';
import {Pixel} from '../types';

interface CanvasProps {
  ws: WebSocket | null;
  canvasState: Pixel[];
}

const Canvas: React.FC<CanvasProps> = ({ws, canvasState}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvasState.forEach(pixel => {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, 1, 1);
      });
    }
  }, [canvasState]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !ws) return;

    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    const x = Math.floor(e.clientX - (rect?.left ?? 0));
    const y = Math.floor(e.clientY - (rect?.top ?? 0));

    const newPixel: Pixel = {x, y, color: 'black'};
    ws.send(JSON.stringify({type: 'draw', pixels: [newPixel]}));
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      style={{border: '1px solid black'}}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
    />
  );
};

export default Canvas;
