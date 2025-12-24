import bcrypt from "bcryptjs";
import { asc, eq, inArray, sql } from "drizzle-orm";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { users, validate } from "../db/schema";
import type { LoginUserResponse, User } from "../models";
import { nanoid } from "nanoid";
import { sendEmail } from "../utils";
import { UserResponse } from "../models/user.model";

export class UserController {
  static CreateUser: RequestHandler = async (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: `Error: User data is empty.` });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password!, 10);
      const emailToken = Math.floor(1000 + Math.random() * 9000).toString();

      // ✅ tags envoyés par le front
      const tagIdsRaw = req.body.tagIds;
      const tagIds: string[] = Array.isArray(tagIdsRaw)
        ? Array.from(new Set(tagIdsRaw.map((x: any) => String(x)))) // unique + string
        : [];

      // 🔹 Zod validate aligné sur le schema users
      const newUserData = validate.parse({
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

        twoFactorEnabled: req.body.twoFactorEnabled ?? false,
        emailVerificationToken: emailToken,
        emailVerified: false,

        isSubscribed: req.body.isSubscribed ?? false,
      });

      // ✅ Transaction : user + user_tags
      const createdUser = await db.transaction(async (tx) => {
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
            .where(inArray(schema.tags.id, tagIds));

          const existingTagIds = new Set(existingTags.map((t) => t.id));
          const validTagIds = tagIds.filter((id) => existingTagIds.has(id));

          if (validTagIds.length === 0) {
            // selon ton choix: soit erreur, soit on continue sans tags
            throw new Error("No valid tagIds provided.");
          }

          // 2) insert pivot user_tags
          await tx.insert(schema.userTags).values(
            validTagIds.map((tagId) => ({
              userId: created.id,
              tagId,
            }))
          );
        }

        return created;
      });

      await sendEmail(
        newUserData.email,
        emailToken,
        "verify-email",
        req.body.language
      );

      res.status(200).send({
        data: createdUser as User,
        message:
          "Succesffully create User, please verify your email address and active your account",
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).send({
        message: `Internal server Error : ${err?.message ?? err}`,
      });
    }
  };

  /**
   * ✅ List artists for fan (with tags + subscribers count)
   * Route: GET /artist/getAll
   */

  static GetArtistsForFan: RequestHandler = async (req, res) => {
    try {
      const now = new Date();

      const rows = await db
        .select({
          id: schema.users.id,
          artistName: schema.users.artistName,
          username: schema.users.username,
          name: schema.users.name,
          surname: schema.users.surname,
          profileImageUrl: schema.users.profileImageUrl,

          // ✅ tags names as "Pop, Rock, Jazz" (via user_tags)
          tags: sql<string | null>`
          GROUP_CONCAT(DISTINCT ${schema.tags.name} SEPARATOR ', ')
        `.as("tags"),

          // ✅ total subscribers (all-time distinct)
          subscribersCount: sql<number>`
          COUNT(DISTINCT ${schema.subscriptions.userId})
        `.as("subscribersCount"),

          // ✅ active subscribers (optional)
          activeSubscribers: sql<number>`
          COUNT(DISTINCT CASE 
            WHEN ${schema.subscriptions.status} = 'active'
             AND ${schema.subscriptions.endDate} > ${now}
            THEN ${schema.subscriptions.userId}
            ELSE NULL
          END)
        `.as("activeSubscribers"),
        })
        .from(schema.users)
        // only artists
        .where(eq(schema.users.type, "artist"))

        // ✅ tags join (NEW): user_tags -> tags
        .leftJoin(schema.userTags, eq(schema.userTags.userId, schema.users.id))
        .leftJoin(schema.tags, eq(schema.tags.id, schema.userTags.tagId))

        // subscriptions join (artistId is user.id in your system)
        .leftJoin(
          schema.subscriptions,
          eq(schema.subscriptions.artistId, schema.users.id)
        )

        // IMPORTANT: group by user id
        .groupBy(schema.users.id);

      res.status(200).send({
        message: "Successfully retrieved artists list",
        data: rows,
      });
    } catch (err) {
      console.error("GetArtistsForFan error:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  static resetPassword: RequestHandler<{ token: string }> = async (
    req,
    res,
    next
  ) => {
    const token = req.params.token;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: "Token and new password are required." });
      return;
    }
    try {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.passwordResetToken, token),
      });

      if (!user) {
        res.status(400).json({ message: "Invalid or expired token." });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db
        .update(schema.users)
        .set({
          password: hashedPassword,
          passwordResetToken: null,
        })
        .where(eq(schema.users.id, user.id));

      res
        .status(200)
        .json({ message: "Password has been reset successfully." });
      return;
    } catch (err) {
      next(err);
    }
  };

  static requestResetPassword: RequestHandler = async (req, res, next) => {
    const { email, language } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    try {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      const resetToken = nanoid(10);

      await db
        .update(schema.users)
        .set({ passwordResetToken: resetToken })
        .where(eq(schema.users.id, user.id));

      const resetLink = `${process.env.FRONT_URL}/reset-password/${resetToken}`;

      await sendEmail(email, resetToken, "reset-password", language);
      const translatedMessages: Record<string, string> = {
        spanish: "Correo de restablecimiento enviado.",
        catalan: "Correu de restabliment enviat.",
        english: "Reset email sent.",
      };

      const message =
        translatedMessages[language] || translatedMessages.english;

      res.status(200).json({ message: message });
      return;
    } catch (err) {
      next(err);
    }
  };

  static VerifyEmail: RequestHandler<{ token: string }> = async (
    req,
    res,
    next
  ) => {
    const token = req.params.token;
    if (!token) {
      res.status(400).send({ message: "Missing verification token." });
      return;
    }
    const user = await db.query.users.findFirst({
      where: (users, { eq }) =>
        eq(users.emailVerificationToken, token as string),
    });
    if (!user) {
      res.status(400).send({ message: "Invalid or expired token." });
      return;
    }
    await db
      .update(schema.users)
      .set({ emailVerified: true, emailVerificationToken: null })
      .where(eq(schema.users.id, user.id));
    res.status(200).send({ message: "Email verified successfully." });
  };

  static FindUserByEmail: RequestHandler<{ email: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      if (req.params.email === "") {
        res.status(400).send({
          message: "No user email given.",
        });
        return;
      }
      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, req.params.email),
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
        data: user as User,
        message: "Succesffuly get User By Email",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server Error: ${err}`,
      });
    }
  };

  static FindUserById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      if (!req.params.id) {
        res.status(400).send({
          message: "No user ID given.",
        });
        return;
      }
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, req.params.id),
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
        data: user as User,
        message: "Succesffuly get User By Id",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server Error",
      });
    }
  };

  static FindAllUser: RequestHandler = async (req, res, next) => {
    try {
      const user = await db.query.users.findMany({
        orderBy: [asc(users.id)],
      });
      if (!user) {
        res.status(400).send({
          message: `No user Found`,
        });
      }
      res.status(200).send({
        data: user as User[],
        message: "Succesffuly get All User",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: "Internal server Error",
      });
    }
  };

  static LoginUser: RequestHandler = async (req, res, next) => {
    const response: LoginUserResponse = {
      user: null,
      token: "",
      error: false,
      message: "",
    };

    try {
      if (req.body.email === "") {
        res.status(400).send({
          message: "No user email given.",
        });
        return;
      }

      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, req.body.email),
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

      if (!user) {
        res.status(400).send({
          message:
            "The provided email and password do not correspond to an account in our records.",
        });
        return;
      }

      const passwordsMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!passwordsMatch) {
        res.status(400).send({
          message:
            "The provided email and password do not correspond to an account in our records.",
        });
        return;
      }

      if (!user.emailVerified) {
        res.status(403).send({
          message:
            "Your email has not been verified yet. Please check your inbox to verify your account.",
        });
        return;
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_PRIVATE_KEY!,
        {
          expiresIn: "1d",
        }
      );

      const { password, ...safeUser } = user;
      response.user = safeUser as UserResponse;
      response.token = token;
      response.error = false;
      response.message = "User successfully authenticated.";

      res.status(200).send(response);
    } catch (err) {
      res.status(500).send({
        message: `Internal server Error : ${err}`,
      });
    }
  };

  static UpdateUser: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        res.status(400).send({ message: "No user ID provided." });
        return;
      }

      const existingUser = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });

      if (!existingUser) {
        res.status(404).send({
          message: `No user found with ID: ${userId}`,
        });
        return;
      }

      const updatedData: Partial<typeof schema.users.$inferInsert> = {};

      // Champs de base
      if (req.body.name) updatedData.name = req.body.name;
      if (req.body.surname) updatedData.surname = req.body.surname;
      if (req.body.username) updatedData.username = req.body.username;
      if (req.body.email) updatedData.email = req.body.email;
      if (req.body.type) updatedData.type = req.body.type;

      // Champs artiste
      if (req.body.artistName) updatedData.artistName = req.body.artistName;
      if (req.body.genre) updatedData.genre = req.body.genre;

      // Champs communs
      if (req.body.bio) updatedData.bio = req.body.bio;
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
            message: "Ancien mot de passe requis pour changer le mot de passe.",
          });
          return;
        }

        const passwordMatches = await bcrypt.compare(
          oldPassword,
          existingUser.password
        );

        if (!passwordMatches) {
          res.status(403).send({
            message: "Ancien mot de passe incorrect.",
          });
          return;
        }

        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        updatedData.password = hashedPassword;
      }

      if (Object.keys(updatedData).length === 0) {
        res.status(400).send({
          message: "No valid fields provided for update.",
        });
        return;
      }

      await db
        .update(schema.users)
        .set(updatedData)
        .where(eq(schema.users.id, userId));

      const updatedUser = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
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
        message: "User Info successfully updated.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        message: `Internal server error: ${err}`,
      });
    }
  };

  static DeleteUser: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
  ) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).send({ message: "No user ID provided." });
        return;
      }

      const existingUser = await db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      });

      if (!existingUser) {
        res.status(404).send({ message: `No user found with ID: ${userId}` });
        return;
      }

      await db.delete(schema.users).where(eq(schema.users.id, userId));

      res.status(200).send({ message: "User successfully deleted." });
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: `Internal server error: ${err}` });
    }
  };
}
