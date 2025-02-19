import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import artistsRoute from './routes/artist.routes';
import artistAdminRoute from './routes/artistAdmin.routes';
import artistsTagRoute from './routes/artistTag.routes';
import collectionRoute from './routes/collection.routes';
import collectionArtistRoute from './routes/collectionArtist.routes';
import collectionTagRoute from './routes/collectionTag.routes';
import releaseRoute from './routes/release.routes';
import tagRoute from './routes/tag.routes';
import trackRoute from './routes/track.routes';
import trackArtistRoute from './routes/trackArtist.routes';
import trackCollectionRoute from './routes/trackCollection.routes';
import trackTagRoute from './routes/trackTag.routes';
import usersRoute from './routes/user.routes';
dotenv.config();

const app: Express = express();
app.use(express.json());


const PORT = process.env.PORT || 8000;

app.use("/artist", artistsRoute)
app.use("/user", usersRoute)
app.use("/collection", collectionRoute)
app.use("/tag", tagRoute)
app.use("/track", trackRoute)
app.use("/artistTag", artistsTagRoute)
app.use("/artistAdmin", artistAdminRoute)
app.use("/collectionArtist", collectionArtistRoute)
app.use("/collectionTag", collectionTagRoute)
app.use("/release", releaseRoute)
app.use("/trackArtist", trackArtistRoute)
app.use("/trackCollection", trackCollectionRoute)
app.use("/trackTag", trackTagRoute)


app.get('/', (req: Request, res: Response) => {
    res.send('welcome to express')
})


app.listen(PORT, () => {
    console.log(`Server is Free at http://localhost:${PORT}`)
})