#!/usr/bin/env node

import express, { Express, Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { Server } from "socket.io";

// import Cards from '#src/cards.json';
import { getCards } from '@src/utils/generateCards';

console.log('[Cards]', getCards());

const app: Express = express();
const port = process.env.port || 3000;
const staticFolder:string = process.cwd() + ( process.env.static_folder || "/static");

const server: http.Server = http.createServer(app);
const io = new Server(server);

const htmlFile = 'index.html';
const htmlFileLocation = path.join(staticFolder, htmlFile)

// set cookie session with unique user id and nickname
// set cookie expiration
// realize socketss

app.use(express.static(staticFolder))

let cards;
let machineCards
let userCards: number[]
let bank


app.get('/', (req, res: Response) => {
  res.sendFile(htmlFileLocation);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit("hi", 'hey from socket');
  socket.on("start", () => {
    cards = Array.from(new Array(10), (_, i) => Math.floor(Math.random() * 10))
    userCards = cards.slice(0, cards.length/2)
    machineCards = cards.slice(cards.length/2)
    
    console.log('[cards]', cards)
    console.log('[sent cards to user] ', userCards)
    console.log('[cards to machine] ', machineCards)
    socket.emit("get_cards", userCards)
  })

  socket.on("card_move", ({cardValue}) => {
    console.log('[card from user]', cardValue)
    const index = userCards.findIndex( card => card === cardValue)
    userCards.splice(index, 1)
    console.log('[user cards after move]', userCards)
  })
});

// socket events
// start game
// send cards
// set first/next move
// send move (card)
// get move reaction
// send move reaction
// send finish  

app.get('/games', (req, res: Response) => {
  res.send('games page should be there!')
})

app.get('/games/:game_id', (req, res: Response) => {
  res.send(req.params);
})

app.get('*', (req, res: Response) => {
  res.status(404).sendFile(htmlFileLocation);
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})