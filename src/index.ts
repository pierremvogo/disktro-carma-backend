import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Routes
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
import flutterwaveRoute from "./routes/flutterwave.routes";
import lygosRoute from "./routes/lygos.routes";

// Swagger
import { swaggerSpec, swaggerUi } from "./swagger";

const app = express();
const PORT = Number(process.env.PORT || 3000);

// 1) CORS
app.use(cors());

// 2) ✅ Stripe webhook RAW (UNIQUEMENT webhook)
app.use("/stripe", stripeRoute);

// 3) Parsers JSON pour TOUT le reste
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4) Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/lygos", lygosRoute);

// 5) Routes (1 seule fois chacune)
app.use("/flutterwave", flutterwaveRoute);
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

// ✅ Stripe endpoints JSON (checkout, portal, etc.) passent ici

app.use("/transaction", transactionRoute);
app.use("/auth", authsRoute);

// 6) Health
app.get("/", (_req, res) => {
  res.send("Welcome to Disktro-carma Backend Server");
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
