import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('welcome to express')
})

app.listen(PORT, () => {
    console.log(`Server is Free at http://localhost:${PORT}`)
})