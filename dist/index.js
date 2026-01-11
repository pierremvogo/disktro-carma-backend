"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Routes
const artist_routes_1 = __importDefault(require("./routes/artist.routes"));
const artistAdmin_routes_1 = __importDefault(require("./routes/artistAdmin.routes"));
const artistTag_routes_1 = __importDefault(require("./routes/artistTag.routes"));
const album_routes_1 = __importDefault(require("./routes/album.routes"));
const albumArtist_routes_1 = __importDefault(require("./routes/albumArtist.routes"));
const albumTag_routes_1 = __importDefault(require("./routes/albumTag.routes"));
const single_routes_1 = __importDefault(require("./routes/single.routes"));
const singleTag_routes_1 = __importDefault(require("./routes/singleTag.routes"));
const trackSingle_routes_1 = __importDefault(require("./routes/trackSingle.routes"));
const ep_routes_1 = __importDefault(require("./routes/ep.routes"));
const epTag_routes_1 = __importDefault(require("./routes/epTag.routes"));
const trackEp_routes_1 = __importDefault(require("./routes/trackEp.routes"));
const download_routes_1 = __importDefault(require("./routes/download.routes"));
const release_routes_1 = __importDefault(require("./routes/release.routes"));
const tag_routes_1 = __importDefault(require("./routes/tag.routes"));
const track_routes_1 = __importDefault(require("./routes/track.routes"));
const trackRelease_routes_1 = __importDefault(require("./routes/trackRelease.routes"));
const trackAlbum_routes_1 = __importDefault(require("./routes/trackAlbum.routes"));
const trackTag_routes_1 = __importDefault(require("./routes/trackTag.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const plan_routes_1 = __importDefault(require("./routes/plan.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const stripe_routes_1 = __importDefault(require("./routes/stripe.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const deleteFile_routes_1 = __importDefault(require("./routes/deleteFile.routes"));
const mood_routes_1 = __importDefault(require("./routes/mood.routes"));
const playList_toutes_1 = __importDefault(require("./routes/playList.toutes"));
const trackPlaylist_1 = __importDefault(require("./routes/trackPlaylist"));
const tester_toutes_1 = __importDefault(require("./routes/tester.toutes"));
const trackStreams_routes_1 = __importDefault(require("./routes/trackStreams.routes"));
const exclusiveContent_routes_1 = __importDefault(require("./routes/exclusiveContent.routes"));
const royalties_routes_1 = __importDefault(require("./routes/royalties.routes"));
const payoutSetting_routes_1 = __importDefault(require("./routes/payoutSetting.routes"));
const userTag_routes_1 = __importDefault(require("./routes/userTag.routes"));
const editorPlaylist_routes_1 = __importDefault(require("./routes/editorPlaylist.routes"));
const flutterwave_routes_1 = __importDefault(require("./routes/flutterwave.routes"));
const lygos_routes_1 = __importDefault(require("./routes/lygos.routes"));
// Swagger
const swagger_1 = require("./swagger");
const controllers_1 = require("./controllers");
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3000);
// 1) CORS
app.use((0, cors_1.default)());
// 2) ✅ Stripe webhook RAW (UNIQUEMENT webhook)
// Webhook Stripe SEUL
app.post("/stripe/webhook", express_1.default.raw({ type: "application/json" }), controllers_1.StripeController.handleWebhook);
// 3) Parsers JSON pour TOUT le reste
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use("/stripe", stripe_routes_1.default);
// 4) Swagger
app.use("/api-docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
app.use("/lygos", lygos_routes_1.default);
// 5) Routes (1 seule fois chacune)
app.use("/flutterwave", flutterwave_routes_1.default);
app.use("/artists", artist_routes_1.default);
app.use("/users", user_routes_1.default);
app.use("/album", album_routes_1.default);
app.use("/streams", trackStreams_routes_1.default);
app.use("/exclusive-content", exclusiveContent_routes_1.default);
app.use("/editorPlaylist", editorPlaylist_routes_1.default);
app.use("/royalties", royalties_routes_1.default);
app.use("/payout", payoutSetting_routes_1.default);
app.use("/ep", ep_routes_1.default);
app.use("/single", single_routes_1.default);
app.use("/tag", tag_routes_1.default);
app.use("/track", track_routes_1.default);
app.use("/fan", tester_toutes_1.default);
app.use("/artistTag", artistTag_routes_1.default);
app.use("/userTag", userTag_routes_1.default);
app.use("/artistAdmin", artistAdmin_routes_1.default);
app.use("/albumArtist", albumArtist_routes_1.default);
app.use("/albumTag", albumTag_routes_1.default);
app.use("/singleTag", singleTag_routes_1.default);
app.use("/trackSingle", trackSingle_routes_1.default);
app.use("/epTag", epTag_routes_1.default);
app.use("/trackEp", trackEp_routes_1.default);
app.use("/playlist", playList_toutes_1.default);
app.use("/mood", mood_routes_1.default);
app.use("/release", release_routes_1.default);
app.use("/trackRelease", trackRelease_routes_1.default);
app.use("/trackAlbum", trackAlbum_routes_1.default);
app.use("/trackPlaylist", trackPlaylist_1.default);
app.use("/trackTag", trackTag_routes_1.default);
app.use("/upload", upload_routes_1.default);
app.use("/download", download_routes_1.default);
app.use("/delete", deleteFile_routes_1.default);
app.use("/plan", plan_routes_1.default);
app.use("/subscription", subscription_routes_1.default);
app.use("/transaction", transaction_routes_1.default);
app.use("/auth", auth_routes_1.default);
// 6) Health
app.get("/", (_req, res) => {
    res.send("Welcome to Disktro-carma Backend Server");
});
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
