import { WebSocket, WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import http from "http";

const PORT = process.env.PORT || 8082;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.write("This is the response from the server")
    res.end();
})

const gameManager = new GameManager();

const wss = new WebSocketServer({ server });
console.log("websocket server started on PORT: ", PORT);
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
 
server.listen((PORT), () => {
  console.log("HTTPS server is Running on PORT: ", PORT);
})