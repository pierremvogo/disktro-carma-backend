<<<<<<< HEAD
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import artistsRoute from "./routes/artist.routes";
import artistAdminRoute from "./routes/artistAdmin.routes";
import artistsTagRoute from "./routes/artistTag.routes";
import albumRoute from "./routes/album.routes";
import albumArtistRoute from "./routes/albumArtist.routes";
import albumTagRoute from "./routes/albumTag.routes";
import downloadRoute from "./routes/download.routes";
import releaseRoute from "./routes/release.routes";
import tagRoute from "./routes/tag.routes";
import trackRoute from "./routes/track.routes";
import trackArtistRoute from "./routes/trackArtist.routes";
import trackAlbumRoute from "./routes/trackAlbum.routes";
import trackTagRoute from "./routes/trackTag.routes";
import uploadRoute from "./routes/upload.routes";
import usersRoute from "./routes/user.routes";
import { swaggerSpec, swaggerUi } from "./swagger";
=======
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import artistsRoute from './routes/artist.routes';
import artistAdminRoute from './routes/artistAdmin.routes';
import artistsTagRoute from './routes/artistTag.routes';
import collectionRoute from './routes/collection.routes';
import collectionArtistRoute from './routes/collectionArtist.routes';
import collectionTagRoute from './routes/collectionTag.routes';
import downloadRoute from './routes/download.routes';
import releaseRoute from './routes/release.routes';
import tagRoute from './routes/tag.routes';
import trackRoute from './routes/track.routes';
import trackArtistRoute from './routes/trackArtist.routes';
import trackCollectionRoute from './routes/trackCollection.routes';
import trackTagRoute from './routes/trackTag.routes';
import uploadRoute from './routes/upload.routes';
import usersRoute from './routes/user.routes';
import { swaggerSpec, swaggerUi } from './swagger';
>>>>>>> new commit

dotenv.config();
const app: Express = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
<<<<<<< HEAD
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/artists", artistsRoute);
app.use("/users", usersRoute);
app.use("/albums", albumRoute);
app.use("/tags", tagRoute);
app.use("/tracks", trackRoute);
app.use("/artistTags", artistsTagRoute);
app.use("/artistAdmins", artistAdminRoute);
app.use("/albumArtists", albumArtistRoute);
app.use("/albumTags", albumTagRoute);
app.use("/releases", releaseRoute);
app.use("/trackArtists", trackArtistRoute);
app.use("/trackAlbum", trackAlbumRoute);
app.use("/trackTag", trackTagRoute);
app.use("/upload", uploadRoute);
app.use("/download", downloadRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Disktro-carma Backend Server");
=======
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/artist', artistsRoute);
app.use('/user', usersRoute);
app.use('/collection', collectionRoute);
app.use('/tag', tagRoute);
app.use('/track', trackRoute);
app.use('/artistTag', artistsTagRoute);
app.use('/artistAdmin', artistAdminRoute);
app.use('/collectionArtist', collectionArtistRoute);
app.use('/collectionTag', collectionTagRoute);
app.use('/release', releaseRoute);
app.use('/trackArtist', trackArtistRoute);
app.use('/trackCollection', trackCollectionRoute);
app.use('/trackTag', trackTagRoute);
app.use('/upload', uploadRoute);
app.use('/download', downloadRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Disktro-carma Backend Server');
>>>>>>> new commit
});

app.listen(PORT, () => {
  console.log(`Server is Listen at http://localhost:${PORT}`);
});
