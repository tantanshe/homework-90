import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {WebSocket} from 'ws';

interface Pixel {
  x: number;
  y: number;
  color: string;
}

const app = express();

expressWs(app);
const port = 8000;
app.use(cors());

const router = express.Router();

const connectedClients: WebSocket[] = [];
let canvasState: Pixel[] = [];

router.ws('/canvas', (ws, req) => {
  connectedClients.push(ws);
  console.log('client connected, total clients: ', connectedClients.length);
  ws.send(JSON.stringify({type: 'initial', pixels: canvasState}));

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message) as
        {
          type: string;
          pixels: Pixel[]
        };

      if (data.type === 'draw') {
        canvasState = [...canvasState, ...data.pixels];

        connectedClients.forEach((client) => {
          client.send(JSON.stringify({type: 'draw', pixels: data.pixels}));
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  ws.on('close', () => {
    console.log('client disconnected!');
    const index = connectedClients.indexOf(ws);
    connectedClients.splice(index, 1);
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});