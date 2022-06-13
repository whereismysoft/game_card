#!/usr/bin/env node

import express, { Express, Request, Response } from 'express';
import http from 'http';
import { Server } from "socket.io";

const app: Express = express();
const port = process.env.port || 3000;
const staticFolder:string = process.cwd() + ( process.env.static_folder || "/static");

const server: http.Server = http.createServer(app);
const io = new Server(server);

// set cookie with unique user id and nickname
// set cookie expiration
// realize socketss

app.use(express.static(staticFolder))


app.get('/', (req, res: Response) => {
  res.sendFile(staticFolder + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.get('/games', (req, res: Response) => {
  res.send('games page should be there!')
})

app.get('/games/:game_id', (req, res: Response) => {
  res.send(req.params);
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})