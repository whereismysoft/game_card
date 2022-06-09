import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.port || 3000;

// set cookie with unique user id and nickname
// set cookie expiration

app.get('/', (req, res: Response) => {
  res.send('enter nickname page should be there!')
})

app.get('/games', (req, res: Response) => {
  res.send('games page should be there!')
})

app.get('/games/:game_id', (req, res: Response) => {
  res.send(req.params);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})