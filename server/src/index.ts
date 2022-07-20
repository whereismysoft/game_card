#!/usr/bin/env node

import express, { Express, Request, Response } from 'express';
import http from 'http';
import path from 'path';
import crypto from 'crypto';
import { Server } from "socket.io";

// import Cards from '#src/cards.json';
import { getCards } from '@src/utils/generateCards';

console.log(getCards())

const CARDS_ON_HAND_COUNT = 6;
const USERS_COUNT_IN_A_ROOM = 2;

const app: Express = express();
const port = process.env.port || 3000;
const staticFolder:string = process.cwd() + ( process.env.static_folder || "/static");

const server: http.Server = http.createServer(app);
const io = new Server(server);

const htmlFile = 'index.html';
const htmlFileLocation = path.join(staticFolder, htmlFile)

const randomId = () => crypto.randomBytes(8).toString("hex");

// set cookie session with unique user id and nickname
// set cookie expiration
// realize socketss

app.use(express.static(staticFolder))

const awaiting_users: string[] = []
const game_rooms = new Map();

let cards: Card[];
let machineCards
let userCards: Card[]
let bank


app.get('/', (req, res: Response) => {
  res.sendFile(htmlFileLocation);
});

io.use(async (socket, next) => {
  // hack
  (socket as any)["userId"] = randomId() ;
  next();
});

// function runMatch(socket: any, users: string[]) {
function runMatch(roomId: string) {
  console.log('[rn match roomId]', roomId)

  io.to(roomId).emit("room_ready");

  // cards = getCards();
  console.log('[users]',)
  const users =  io.sockets.adapter.rooms.get(roomId) || new Set()
  for (const user of users) {

    console.log('[cir]', (io.of("/").sockets.get(user) as any).userId)
  }

  // users.forEach( user => {
  //   socket.to(user).emit('start', { users,  })
  // })

  // socket.on("run_game", () => {
  //   userCards = cards.slice(0, CARDS_ON_HAND_COUNT)
  //   machineCards = cards.slice(CARDS_ON_HAND_COUNT, CARDS_ON_HAND_COUNT * 2)
    
  //   console.log('[cards]', cards)
  //   console.log('[sent cards to user] ', userCards)
  //   console.log('[cards to machine] ', machineCards)
  //   socket.emit("get_cards", userCards)
  // })
}

io.on('connection', (socket) => {
  const userId = randomId()

  socket.emit("session", {
    userID: (socket as any).userId,
  });

  // create room
  let roomId:string = String(game_rooms.size ? game_rooms.size - 1 : game_rooms.size);
  const usersInRoom = game_rooms.get(roomId) || []

  if (usersInRoom.length >= USERS_COUNT_IN_A_ROOM) {
    roomId = String(game_rooms.size)
  }

  game_rooms.set(roomId, [socket, ...usersInRoom])

  socket.join(roomId);
  socket.to(roomId).emit("user_connected");

  if (game_rooms.get(roomId).length === USERS_COUNT_IN_A_ROOM) {
    runMatch(roomId)
  }
})

// io.on('connection', (socket) => {
//   const userId = randomId()

//   socket.emit("session", {
//     userID: userId,
//   });

//   awaiting_users.push(userId)

//   if (awaiting_users.length > 2) {
//     const usersPair = awaiting_users.splice(0, 2)
//     game_rooms.push([...usersPair])
//     runMatch(socket, usersPair)
//   }

//   console.log('[awaiting]', awaiting_users.length)

//   socket.on("user_disconnect", ({userID}) => {
//     console.log('[awaiting_users before]', awaiting_users)
//     const idx = awaiting_users.findIndex( id => id === userID)

//     awaiting_users.splice(idx, 1)

//     console.log('[awaiting_users after]', awaiting_users)
//   })

//   socket.onAny((event, ...args) => {
//     console.log('[socket]', event, args);
//   });

//   socket.on("card_move", ({card}) => {
//     console.log('[card from user]', card)
//     const index = userCards.findIndex( ({suit, number}) => number === card.number && suit === card.suit)
//     userCards.splice(index, 1)
//     console.log('[user cards after move]', userCards)
//   })
// });

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