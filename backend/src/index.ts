import { WebSocketServer } from 'ws';
import http from 'http';

const PORT = 8080;

// const server = http.createServer(function (req, res) {
//   console.log("Request in http server", req.headers['accept-language']);
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.write('Hello World new !');
//   res.end();
// })
// const wss = new WebSocketServer({ server });
const wss = new WebSocketServer({ port: PORT });
console.log("wss created")
wss.on('connection', function connection(ws) {
  console.log("connection started");
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something'); 
});

// server.listen(PORT, () => {
//   console.log(`server is listening on port ${PORT}`);
// });