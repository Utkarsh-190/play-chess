import { WebSocket, WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 8080;
const options = {
  key: process.env.SSL_KEY || fs.readFileSync(path.join(__dirname, '../certs', 'key.pem')),
  cert: process.env.SSL_CERT || fs.readFileSync(path.join(__dirname, '../certs', 'cert.pem'))
};

const server = https.createServer(options, (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.write("This is the response from the server")
    res.end();
})

const httpServer = http.createServer( (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.write("This is the response from the server")
  res.end();
})

const gameManager = new GameManager();

const wss = new WebSocketServer({ server: httpServer });
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
 
server.listen((8081), () => {
  console.log("HTTPS server is Running on PORT: ", 8081);
})

httpServer.listen(PORT, () => { 
  console.log("HTTP server is running on PORT: ", PORT);
});