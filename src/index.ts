import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import artistsRoute from "./routes/artist.routes";
import artistAdminRoute from "./routes/artistAdmin.routes";
import artistsTagRoute from "./routes/artistTag.routes";
import albumRoute from "./routes/album.routes";
import albumArtistRoute from "./routes/albumArtist.routes";
import albumTagRoute from "./routes/albumTag.routes";
import singleRoute from "./routes/single.routes";
import singleTagRoute from "./routes/singleTag.routes";
import trackSingleRoute from "./routes/trackSingle.routes";
import epRoute from "./routes/ep.routes";
import epTagRoute from "./routes/epTag.routes";
import trackEpRoute from "./routes/trackEp.routes";
import downloadRoute from "./routes/download.routes";
import releaseRoute from "./routes/release.routes";
import tagRoute from "./routes/tag.routes";
import trackRoute from "./routes/track.routes";
import trackReleaseRoute from "./routes/trackRelease.routes";
import trackAlbumRoute from "./routes/trackAlbum.routes";
import trackTagRoute from "./routes/trackTag.routes";
import uploadRoute from "./routes/upload.routes";
import usersRoute from "./routes/user.routes";
import planRoute from "./routes/plan.routes";
import subscriptionRoute from "./routes/subscription.routes";
import stripeRoute from "./routes/stripe.routes";
import transactionRoute from "./routes/transaction.routes";
import authsRoute from "./routes/auth.routes";
import { swaggerSpec, swaggerUi } from "./swagger";
import cors from "cors";
import bodyParser from "body-parser";
import { db } from "./db/db";
import deleteFileRoute from "./routes/deleteFile.routes";
import moodRoute from "./routes/mood.routes";
import playlistRoute from "./routes/playList.toutes";
import trackPlaylistRoute from "./routes/trackPlaylist";
import testersRoute from "./routes/tester.toutes";
import trackStreamRoute from "./routes/trackStreams.routes";
import exclusiveContentRoute from "./routes/exclusiveContent.routes";
import royaltiesRoute from "./routes/royalties.routes";
import payoutRoute from "./routes/payoutSetting.routes";
import userTagRoute from "./routes/userTag.routes";
import editorPlaylistRoute from "./routes/editorPlaylist.routes";

const app: Express = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/artists", artistsRoute);
app.use("/users", usersRoute);
app.use("/album", albumRoute);
app.use("/streams", trackStreamRoute);
app.use("/exclusive-content", exclusiveContentRoute);
app.use("/editorPlaylist", editorPlaylistRoute);
app.use("/royalties", royaltiesRoute);
app.use("/payout", payoutRoute);
app.use("/ep", epRoute);
app.use("/single", singleRoute);
app.use("/tag", tagRoute);
app.use("/track", trackRoute);
app.use("/fan", testersRoute);
app.use("/artistTag", artistsTagRoute);
app.use("/userTag", userTagRoute);
app.use("/artistAdmin", artistAdminRoute);
app.use("/albumArtist", albumArtistRoute);
app.use("/albumTag", albumTagRoute);
app.use("/singleTag", singleTagRoute);
app.use("/trackSingle", trackSingleRoute);
app.use("/epTag", epTagRoute);
app.use("/trackEp", trackEpRoute);
app.use("/playlist", playlistRoute);
app.use("/mood", moodRoute);
app.use("/release", releaseRoute);
app.use("/trackRelease", trackReleaseRoute);
app.use("/trackAlbum", trackAlbumRoute);
app.use("/trackPlaylist", trackPlaylistRoute);
app.use("/trackTag", trackTagRoute);
app.use("/upload", uploadRoute);
app.use("/download", downloadRoute);
app.use("/delete", deleteFileRoute);
app.use("/plan", planRoute);
app.use("/subscription", subscriptionRoute);
app.use("/stripe", stripeRoute);
app.use("/transaction", transactionRoute);
app.use("/auth", authsRoute);

// const mood = [
//   { name: "happy" },
//   { name: "sad" },
//   { name: "dancing" },
//   { name: "melancholic" },
//   { name: "cry" },
//   { name: "energetic" },
//   { name: "chill" },
//   { name: "romantic" },
//   { name: "angry" },
//   { name: "relaxed" },
//   { name: "nostalgic" },
//   { name: "hype" },
//   { name: "calm" },
//   { name: "emotional" },
//   { name: "cinematic" },
//   { name: "dreamy" },
//   { name: "focused" },
//   { name: "motivated" },
// ];

// const artistTags = [
//   { name: "pop" },
//   { name: "rock" },
//   { name: "hip hop" },
//   { name: "rap" },
//   { name: "r&b" },
//   { name: "electronic" },
//   { name: "dance" },
//   { name: "house" },
//   { name: "techno" },
//   { name: "edm" },
//   { name: "indie" },
//   { name: "alternative" },
//   { name: "jazz" },
//   { name: "blues" },
//   { name: "soul" },
//   { name: "funk" },
//   { name: "classical" },
//   { name: "orchestral" },
//   { name: "cinematic" },
//   { name: "ambient" },
//   { name: "lofi" },
//   { name: "chillout" },
//   { name: "reggae" },
//   { name: "dub" },
//   { name: "latin" },
//   { name: "afrobeat" },
//   { name: "world" },
//   { name: "folk" },
//   { name: "country" },
//   { name: "metal" },
//   { name: "punk" },
//   { name: "hard rock" },
//   { name: "trap" },
//   { name: "drill" },
//   { name: "k-pop" },
//   { name: "j-pop" },
//   { name: "soundtrack" },
//   { name: "experimental" },
// ];

// import * as schema from "./db/schema";
// import slugify from "slugify";
// const preparedTags = artistTags.map((tag) => ({
//   name: tag.name,
//   slug: slugify(tag.name), // ou utiliser une vraie fonction de slug
// }));
// const tagseedd = async () => {
//   await db.insert(schema.tags).values(preparedTags);
// };
// tagseedd();

// const preparedMood = mood.map((mood) => ({
//   name: mood.name,
// }));
// const moodseedd = async () => {
//   await db.insert(schema.mood).values(preparedMood);
// };
// tagseedd();
// moodseedd();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Disktro-carma Backend Server");
});

app.listen(PORT, () => {
  console.log(`Server is Listen at https://disktro-backend.onrender.com`);
});
