import { io } from "socket.io-client";

type Card = number

declare global {
    interface Window {
      onStart(): void
      sendCard(card: Card): void
    }
  }

const socket = io();
let myCards

socket.onAny((event, ...args) => {
    console.log('[socket]', event, args);
  });

socket.on('get_cards', (cards) => {
    console.log('you got cards', cards)
    myCards = cards
})

function onStart() {
    socket.emit("start", "my_id")
}

function sendCard(cardValue: Card) {
    console.log('[card]', cardValue)
    socket.emit('card_move', {cardValue})
}

window.onStart = onStart
window.sendCard = sendCard

// at first - enter login and play with computer
// then - p v p