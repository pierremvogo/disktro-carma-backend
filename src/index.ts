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
app.use("/royalties", royaltiesRoute);
app.use("/payout", payoutRoute);
app.use("/ep", epRoute);
app.use("/single", singleRoute);
app.use("/tag", tagRoute);
app.use("/track", trackRoute);
app.use("/fan", testersRoute);
app.use("/artistTag", artistsTagRoute);
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
//   { name: "rock" },
//   { name: "hiphop" },
//   { name: "rap" },
//   { name: "afrobeat" },
//   { name: "afropop" },
//   { name: "rnb" },
//   { name: "jazz" },
//   { name: "blues" },
//   { name: "classical" },
//   { name: "electronic" },
//   { name: "house" },
//   { name: "techno" },
//   { name: "reggae" },
//   { name: "dancehall" },
//   { name: "ska" },
//   { name: "gospel" },
//   { name: "country" },
//   { name: "folk" },
//   { name: "metal" },
//   { name: "punk" },
//   { name: "disco" },
//   { name: "funk" },
//   { name: "latin" },
//   { name: "salsa" },
//   { name: "bachata" },
//   { name: "merengue" },
//   { name: "trap" },
//   { name: "drill" },
//   { name: "alternative" },
//   { name: "indie" },
//   { name: "kpop" },
//   { name: "soul" },
//   { name: "world" },
//   { name: "new-age" },
//   { name: "nigeria" },
//   { name: "ghana" },
//   { name: "south-africa" },
//   { name: "usa" },
//   { name: "uk" },
//   { name: "france" },
//   { name: "canada" },
//   { name: "jamaica" },
//   { name: "cuba" },
//   { name: "cameroon" },
//   { name: "senegal" },
//   { name: "morocco" },
//   { name: "congo" },
//   { name: "ivory-coast" },
//   { name: "brazil" },
//   { name: "colombia" },
//   { name: "japan" },
//   { name: "korea" },
//   { name: "grammy-winner" },
//   { name: "platinum-certified" },
//   { name: "upcoming" },
//   { name: "independent" },
//   { name: "major-label" },
//   { name: "featured-artist" },
//   { name: "legend" },
//   { name: "newcomer" },
//   { name: "underground" },
//   { name: "party" },
//   { name: "chill" },
//   { name: "love" },
//   { name: "motivational" },
//   { name: "workout" },
//   { name: "relax" },
//   { name: "roadtrip" },
//   { name: "festival" },
//   { name: "late-night" },
//   { name: "spiritual" },
//   { name: "70s" },
//   { name: "80s" },
//   { name: "90s" },
//   { name: "2000s" },
//   { name: "2010s" },
//   { name: "2020s" },
//   { name: "classic" },
//   { name: "modern" },
//   { name: "legendary" },
//   { name: "breakthrough" },
//   { name: "independent-artist" },
//   { name: "major-label-artist" },
//   { name: "songwriter" },
//   { name: "producer" },
//   { name: "dj" },
//   { name: "vocalist" },
//   { name: "rapper" },
//   { name: "multi-instrumentalist" },
//   { name: "live-performer" },
//   { name: "studio-artist" },
//   { name: "viral" },
//   { name: "underground-artist" },
//   { name: "award-winning" },
//   { name: "platinum-artist" },
//   { name: "international" },
//   { name: "local-hero" },
//   { name: "socially-conscious" },
//   { name: "activist" },
//   { name: "experimental" },
//   { name: "mainstream" },
//   { name: "influencer" },
//   { name: "trendsetter" },
//   { name: "collaborative" },
//   { name: "solo-act" },
//   { name: "band-member" },
//   { name: "stage-presence" },
//   { name: "fashion-icon" },
//   { name: "genre-bending" },
//   { name: "voice-of-a-generation" },
//   { name: "comeback" },
//   { name: "rising-star" },
//   { name: "veteran" },
//   { name: "cultural-icon" },
//   { name: "award-nominated" },
//   { name: "festival-headliner" },
//   { name: "radio-favorite" },
//   { name: "streaming-star" },
//   { name: "viral-sensation" },
//   { name: "ghostwriter" },
//   { name: "indie-darling" },
//   { name: "creative-director" },
//   { name: "label-owner" },
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
