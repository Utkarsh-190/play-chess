import { WebSocket, WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const PORT = 8080;

const gameManager = new GameManager();

const wss = new WebSocketServer({ port: PORT });
console.log("websocket server started");
wss.on('connection', function connection(ws : WebSocket) {
  console.log(`connection started for ${ws}`);
  ws.on('error', console.error);
  ws.send('you are connected to chessify'); 

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    console.log("received message: ", msg);
    gameManager.handleMessage(msg, ws);
  })

  ws.on('close', function close() {
    console.log(`${ws} disconnected`);
  });
});
 