"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const schema_1 = require("../db/schema");
const nanoid_1 = require("nanoid");
const utils_1 = require("../utils");
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.CreateUser = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: `User data is empty.` });
        return;
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        const emailToken = Math.floor(1000 + Math.random() * 9000).toString();
        // ✅ tags envoyés par le front
        const tagIdsRaw = req.body.tagIds;
        const tagIds = Array.isArray(tagIdsRaw)
            ? Array.from(new Set(tagIdsRaw.map((x) => String(x)))) // unique + string
            : [];
        // 🔹 Zod validate aligné sur le schema users
        const newUserData = schema_1.validate.parse({
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            type: req.body.type,
            artistName: req.body.artistName,
            genre: req.body.genre, // (tu peux le garder ou le supprimer plus tard si tags suffisent)
            bio: req.body.bio,
            country: req.body.country,
            profileImageUrl: req.body.profileImageUrl,
            videoIntroUrl: req.body.videoIntroUrl,
            miniVideoLoopUrl: req.body.miniVideoLoopUrl,
            videoIntroFileName: req.body.videoIntroFileName,
            miniVideoLoopFileName: req.body.miniVideoLoopFileName,
            profileImageFileName: req.body.profileImageName,
            twoFactorEnabled: req.body.twoFactorEnabled ?? false,
            emailVerificationToken: emailToken,
            emailVerified: false,
            isSubscribed: req.body.isSubscribed ?? false,
        });
        // ✅ Transaction : user + user_tags
        const createdUser = await db_1.db.transaction(async (tx) => {
            const result = await tx
                .insert(schema.users)
                .values(newUserData)
                .$returningId();
            const created = result[0];
            if (!created?.id) {
                throw new Error("Error while creating user");
            }
            // ✅ si artist => associer tags
            if (newUserData.type === "artist" && tagIds.length > 0) {
                // 1) (optionnel mais recommandé) vérifier que les tags existent
                const existingTags = await tx
                    .select({ id: schema.tags.id })
                    .from(schema.tags)
                    .where((0, drizzle_orm_1.inArray)(schema.tags.id, tagIds));
                const existingTagIds = new Set(existingTags.map((t) => t.id));
                const validTagIds = tagIds.filter((id) => existingTagIds.has(id));
                if (validTagIds.length === 0) {
                    // selon ton choix: soit erreur, soit on continue sans tags
                    throw new Error("No valid tagIds provided.");
                }
                // 2) insert pivot user_tags
                await tx.insert(schema.userTags).values(validTagIds.map((tagId) => ({
                    userId: created.id,
                    tagId,
                })));
            }
            return created;
        });
        await (0, utils_1.sendEmail)(newUserData.email, emailToken, "verify-email", req.body.language);
        res.status(200).send({
            data: createdUser,
            message: req.body.language === "english"
                ? "Succesffully create User, please verify your email address and active your account"
                : req.body.language === "spanish"
                    ? "Usuario creado correctamente. Por favor, verifica tu dirección de correo electrónico y activa tu cuenta."
                    : "Usuari creat correctament. Si us plau, verifica la teva adreça de correu electrònic i activa el teu compte.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: err?.message ?? err,
        });
    }
};
/**
 * ✅ List artists for fan (with tags + subscribers count)
 * Route: GET /artist/getAll
 */
UserController.GetArtistsForFan = async (req, res) => {
    try {
        const now = new Date();
        const rows = await db_1.db
            .select({
            id: schema.users.id,
            artistName: schema.users.artistName,
            username: schema.users.username,
            name: schema.users.name,
            surname: schema.users.surname,
            profileImageUrl: schema.users.profileImageUrl,
            videoIntroUrl: schema.users.videoIntroUrl,
            bio: schema.users.bio,
            country: schema.users.country,
            // ✅ tags names as "Pop, Rock, Jazz"
            tags: (0, drizzle_orm_1.sql) `
            GROUP_CONCAT(DISTINCT ${schema.tags.name} SEPARATOR ', ')
          `.as("tags"),
            // ✅ total subscribers (all-time distinct)
            subscribersCount: (0, drizzle_orm_1.sql) `
            COUNT(DISTINCT ${schema.subscriptions.userId})
          `.as("subscribersCount"),
            // ✅ active subscribers
            activeSubscribers: (0, drizzle_orm_1.sql) `
            COUNT(DISTINCT CASE 
              WHEN ${schema.subscriptions.status} = 'active'
               AND ${schema.subscriptions.endDate} > ${now}
              THEN ${schema.subscriptions.userId}
              ELSE NULL
            END)
          `.as("activeSubscribers"),
            // 🆕 NEW: artist has at least one ACTIVE plan
            hasActivePlan: (0, drizzle_orm_1.sql) `
            CASE 
              WHEN COUNT(DISTINCT ${schema.plans.id}) > 0 THEN true
              ELSE false
            END
          `.as("hasActivePlan"),
        })
            .from(schema.users)
            // only artists
            .where((0, drizzle_orm_1.eq)(schema.users.type, "artist"))
            // tags join
            .leftJoin(schema.userTags, (0, drizzle_orm_1.eq)(schema.userTags.userId, schema.users.id))
            .leftJoin(schema.tags, (0, drizzle_orm_1.eq)(schema.tags.id, schema.userTags.tagId))
            // subscriptions join
            .leftJoin(schema.subscriptions, (0, drizzle_orm_1.eq)(schema.subscriptions.artistId, schema.users.id))
            // 🆕 plans join (ACTIVE only)
            .leftJoin(schema.plans, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.plans.artistId, schema.users.id), (0, drizzle_orm_1.eq)(schema.plans.active, true)))
            // IMPORTANT
            .groupBy(schema.users.id);
        res.status(200).send({
            message: "Successfully retrieved artists list",
            data: rows,
        });
    }
    catch (err) {
        console.error("GetArtistsForFan error:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
UserController.resetPassword = async (req, res, next) => {
    const token = req.params.token;
    const { newPassword } = req.body;
    if (!token || !newPassword) {
        res.status(400).json({
            message: req.body.language === "english"
                ? "Token and new password are required."
                : req.body.language === "spanish"
                    ? "El token y la nueva contraseña son obligatorios."
                    : "El token i la nova contrasenya són obligatoris.",
        });
        return;
    }
    try {
        const user = await db_1.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.passwordResetToken, token),
        });
        if (!user) {
            res.status(400).json({
                message: req.body.language === "english"
                    ? "Invalid or expired token."
                    : req.body.language === "spanish"
                        ? "Token inválido o caducado."
                        : "Token invàlid o caducat.",
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await db_1.db
            .update(schema.users)
            .set({
            password: hashedPassword,
            passwordResetToken: null,
        })
            .where((0, drizzle_orm_1.eq)(schema.users.id, user.id));
        res.status(200).json({
            message: req.body.language === "english"
                ? "Password has been reset successfully."
                : req.body.language === "spanish"
                    ? "La contraseña se ha restablecido correctamente."
                    : "La contrasenya s’ha restablert correctament.",
        });
        return;
    }
    catch (err) {
        next(err);
    }
};
UserController.requestResetPassword = async (req, res, next) => {
    const { email, language } = req.body;
    if (!email) {
        res.status(400).json({
            message: req.body.language === "english"
                ? "Email is required."
                : req.body.language === "spanish"
                    ? "Se requiere el correo electrónico."
                    : "Es requereix el correu electrònic.",
        });
        return;
    }
    try {
        const user = await db_1.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
        });
        if (!user) {
            res.status(404).json({
                message: req.body.language === "english"
                    ? "User not found."
                    : req.body.language === "spanish"
                        ? "Usuario no encontrado."
                        : "Usuari no trobat.",
            });
            return;
        }
        const resetToken = (0, nanoid_1.nanoid)(10);
        await db_1.db
            .update(schema.users)
            .set({ passwordResetToken: resetToken })
            .where((0, drizzle_orm_1.eq)(schema.users.id, user.id));
        const resetLink = `${process.env.FRONT_URL}/reset-password/${resetToken}`;
        await (0, utils_1.sendEmail)(email, resetToken, "reset-password", language);
        const translatedMessages = {
            spanish: "Correo de restablecimiento enviado.",
            catalan: "Correu de restabliment enviat.",
            english: "Reset email sent.",
        };
        const message = translatedMessages[language] || translatedMessages.english;
        res.status(200).json({ message: message });
        return;
    }
    catch (err) {
        next(err);
    }
};
UserController.VerifyEmail = async (req, res, next) => {
    const token = req.params.token;
    if (!token) {
        res.status(400).send({
            message: req.body.language === "english"
                ? "Missing verification token."
                : req.body.language === "spanish"
                    ? "Falta el token de verificación."
                    : "Falta el token de verificació.",
        });
        return;
    }
    const user = await db_1.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.emailVerificationToken, token),
    });
    if (!user) {
        res.status(400).send({
            message: req.body.language === "english"
                ? "Invalid or expired token."
                : req.body.language === "spanish"
                    ? "Token inválido o caducado."
                    : "Token invàlid o caducat.",
        });
        return;
    }
    await db_1.db
        .update(schema.users)
        .set({ emailVerified: true, emailVerificationToken: null })
        .where((0, drizzle_orm_1.eq)(schema.users.id, user.id));
    res.status(200).send({
        message: req.body.language === "english"
            ? "Email verified successfully."
            : req.body.language === "spanish"
                ? "Correo electrónico verificado correctamente."
                : "Correu electrònic verificat correctament.",
    });
};
UserController.FindUserByEmail = async (req, res, next) => {
    try {
        if (req.params.email === "") {
            res.status(400).send({
                message: "No user email given.",
            });
            return;
        }
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.email, req.params.email),
            columns: {
                id: true,
                name: true,
                surname: true,
                username: true,
                email: true,
                type: true,
                artistName: true,
                genre: true,
                bio: true,
                profileImageUrl: true,
                videoIntroUrl: true,
                miniVideoLoopUrl: true,
                country: true,
                isSubscribed: true,
                emailVerified: true,
                twoFactorEnabled: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(400).send({
                message: "No user Found with this Email address.",
            });
            return;
        }
        res.status(200).send({
            data: user,
            message: "Succesffuly get User By Email",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server Error: ${err}`,
        });
    }
};
UserController.FindUserById = async (req, res, next) => {
    try {
        if (!req.params.id) {
            res.status(400).send({
                message: "No user ID given.",
            });
            return;
        }
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, req.params.id),
            columns: {
                id: true,
                name: true,
                surname: true,
                username: true,
                email: true,
                type: true,
                artistName: true,
                miniVideoLoopUrl: true,
                country: true,
                genre: true,
                bio: true,
                emailVerified: true,
                twoFactorEnabled: true,
                isSubscribed: true,
                profileImageUrl: true,
                videoIntroUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            res.status(400).send({
                message: `No user Found with this Id: ${req.params.id}`,
            });
            return;
        }
        res.status(200).send({
            data: user,
            message: "Succesffuly get User By Id",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Internal server Error",
        });
    }
};
UserController.FindAllUser = async (req, res, next) => {
    try {
        const user = await db_1.db.query.users.findMany({
            orderBy: [(0, drizzle_orm_1.asc)(schema_1.users.id)],
        });
        if (!user) {
            res.status(400).send({
                message: `No user Found`,
            });
        }
        res.status(200).send({
            data: user,
            message: "Succesffuly get All User",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: err,
        });
    }
};
UserController.LoginUser = async (req, res, next) => {
    const response = {
        user: null,
        token: "",
        error: false,
        message: "",
    };
    try {
        if (req.body.email === "") {
            res.status(400).send({
                message: req.body.language === "english"
                    ? "No user email given."
                    : req.body.language === "spanish"
                        ? "No se ha proporcionado ningún correo electrónico del usuario."
                        : "No s’ha proporcionat cap correu electrònic de l’usuari.",
            });
            return;
        }
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.email, req.body.email),
            columns: {
                id: true,
                name: true,
                surname: true,
                username: true,
                email: true,
                type: true,
                password: true,
                country: true,
                emailVerified: true,
                profileImageUrl: true,
            },
        });
        const errorLogin = req.body.language === "english"
            ? "The provided email and password do not correspond to an account in our records."
            : req.body.language === "spanish"
                ? "El correo electrónico y la contraseña proporcionados no corresponden a ninguna cuenta en nuestros registros."
                : "L’adreça electrònica i la contrasenya proporcionades no corresponen a cap compte als nostres registres.";
        if (!user) {
            res.status(400).send({
                message: errorLogin,
            });
            return;
        }
        const passwordsMatch = await bcryptjs_1.default.compare(req.body.password, user.password);
        if (!passwordsMatch) {
            res.status(400).send({
                message: errorLogin,
            });
            return;
        }
        if (!user.emailVerified) {
            res.status(403).send({
                message: req.body.language === "english"
                    ? "Your email has not been verified yet. Please check your inbox to verify your account."
                    : req.body.language === "spanish"
                        ? "Tu correo electrónico aún no ha sido verificado. Por favor, revisa tu bandeja de entrada para verificar tu cuenta."
                        : "El teu correu electrònic encara no ha estat verificat. Si us plau, revisa la teva safata d’entrada per verificar el teu compte.",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_PRIVATE_KEY, {
            expiresIn: "1d",
        });
        const { password, ...safeUser } = user;
        response.user = safeUser;
        response.token = token;
        response.error = false;
        response.message =
            req.body.language === "english"
                ? "User successfully authenticated."
                : req.body.language === "spanish"
                    ? "Usuario autenticado correctamente."
                    : "Usuari autenticat correctament.";
        res.status(200).send(response);
    }
    catch (err) {
        res.status(500).send({
            message: err,
        });
    }
};
UserController.UpdateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).send({
                message: req.body.language === "english"
                    ? "No user ID provided."
                    : req.body.language === "spanish"
                        ? "No se proporcionó ningún ID de usuario."
                        : "No s’ha proporcionat cap ID d’usuari.",
            });
            return;
        }
        const existingUser = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId),
        });
        if (!existingUser) {
            res.status(404).send({
                message: req.body.language === "english"
                    ? `No user found`
                    : req.body.language === "spanish"
                        ? "No se encontró ningún usuario."
                        : "No s’ha trobat cap usuari.",
            });
            return;
        }
        const updatedData = {};
        // Champs de base
        if (req.body.name)
            updatedData.name = req.body.name;
        if (req.body.surname)
            updatedData.surname = req.body.surname;
        if (req.body.username)
            updatedData.username = req.body.username;
        if (req.body.email)
            updatedData.email = req.body.email;
        if (req.body.type)
            updatedData.type = req.body.type;
        // Champs artiste
        if (req.body.artistName)
            updatedData.artistName = req.body.artistName;
        if (req.body.genre)
            updatedData.genre = req.body.genre;
        // Champs communs
        if (req.body.bio)
            updatedData.bio = req.body.bio;
        if (req.body.profileImageUrl)
            updatedData.profileImageUrl = req.body.profileImageUrl;
        if (req.body.videoIntroUrl)
            updatedData.videoIntroUrl = req.body.videoIntroUrl;
        if (req.body.miniVideoLoopUrl)
            updatedData.miniVideoLoopUrl = req.body.miniVideoLoopUrl;
        // 2FA
        if (typeof req.body.twoFactorEnabled === "boolean")
            updatedData.twoFactorEnabled = req.body.twoFactorEnabled;
        // Email verified (normalement changé côté verifyEmail)
        if (typeof req.body.emailVerified === "boolean")
            updatedData.emailVerified = req.body.emailVerified;
        // Abonnement
        if (typeof req.body.isSubscribed === "boolean")
            updatedData.isSubscribed = req.body.isSubscribed;
        // Changement de mot de passe
        if (req.body.newPassword) {
            const oldPassword = req.body.oldPassword;
            if (!oldPassword) {
                res.status(400).send({
                    message: req.body.language === "english"
                        ? "Ancien mot de passe requis pour changer le mot de passe."
                        : req.body.language === "spanish"
                            ? "Se requiere la contraseña antigua para cambiar la contraseña."
                            : "Es necessita la contrasenya antiga per canviar la contrasenya.",
                });
                return;
            }
            const passwordMatches = await bcryptjs_1.default.compare(oldPassword, existingUser.password);
            if (!passwordMatches) {
                res.status(403).send({
                    message: req.body.language === "english"
                        ? "Ancien mot de passe incorrect."
                        : req.body.language === "spanish"
                            ? "La contraseña antigua es incorrecta."
                            : "La contrasenya antiga és incorrecta.",
                });
                return;
            }
            const hashedPassword = await bcryptjs_1.default.hash(req.body.newPassword, 10);
            updatedData.password = hashedPassword;
        }
        if (Object.keys(updatedData).length === 0) {
            res.status(400).send({
                message: "No valid fields provided for update.",
            });
            return;
        }
        await db_1.db
            .update(schema.users)
            .set(updatedData)
            .where((0, drizzle_orm_1.eq)(schema.users.id, userId));
        const updatedUser = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId),
            columns: {
                id: true,
                name: true,
                surname: true,
                username: true,
                email: true,
                type: true,
                artistName: true,
                genre: true,
                bio: true,
                profileImageUrl: true,
                videoIntroUrl: true,
                isSubscribed: true,
                emailVerified: true,
                twoFactorEnabled: true,
            },
        });
        res.status(200).send({
            data: updatedUser,
            message: req.body.language === "english"
                ? "User Info successfully updated."
                : req.body.language === "spanish"
                    ? "Información del usuario actualizada correctamente."
                    : "Informació de l’usuari actualitzada correctament.",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({
            message: `Internal server error`,
        });
    }
};
UserController.DeleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            res.status(400).send({ message: "No user ID provided." });
            return;
        }
        const existingUser = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId),
        });
        if (!existingUser) {
            res.status(404).send({ message: `No user found with ID: ${userId}` });
            return;
        }
        await db_1.db.delete(schema.users).where((0, drizzle_orm_1.eq)(schema.users.id, userId));
        res.status(200).send({ message: "User successfully deleted." });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ message: `Internal server error: ${err}` });
    }
};
