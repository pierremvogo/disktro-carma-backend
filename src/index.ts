import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response } from "express";
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

// Swagger
import { swaggerSpec, swaggerUi } from "./swagger";

// ✅ Stripe controller (pour brancher le webhook en RAW)
import { StripeController } from "./controllers";

const app: Express = express();
const PORT = Number(process.env.PORT || 3000);

// ✅ CORS tôt
app.use(cors());

// ✅ IMPORTANT: webhook Stripe doit être RAW et AVANT les JSON parsers
// Ton StripeController attend req.body raw pour constructEvent()
app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  StripeController.handleWebhook
);

// ✅ Ensuite seulement : parsers JSON pour toutes les autres routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
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

// ✅ Garde stripeRoute si tu as d'autres endpoints Stripe (checkout, portal, etc.)
// ⚠️ MAIS dans stripeRoute tu ne dois PAS re-déclarer /webhook en json parser
app.use("/stripe", stripeRoute);

app.use("/transaction", transactionRoute);
app.use("/auth", authsRoute);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Disktro-carma Backend Server");
});

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
