"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.port || 3000;
// set cookie with unique user id and nickname
// set cookie expiration
app.get('/', (req, res) => {
    res.send('enter nickname page should be there!');
});
app.get('/games', (req, res) => {
    res.send('games page should be there!');
});
app.get('/games/:gameid', (req, res) => {
    res.send(req.params);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
