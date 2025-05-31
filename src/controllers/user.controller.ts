import bcrypt from "bcryptjs";
import { asc, eq } from "drizzle-orm";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { users, validate } from "../db/schema";
import type { LoginUserResponse, User } from "../models";
import { nanoid } from "nanoid";
import { sendVerificationEmail } from "../utils/email";

export class UserController {
  static CreateUser: RequestHandler = async (req, res, next) => {
    if (!req.body) {
      res.status(400).send({
        message: `Error: User data is empty.`,
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password!, 10);
      const emailToken = nanoid(10);
      const newUserData = validate.parse({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        type: req.body.type,
        emailVerificationToken: emailToken,
        emailVerified: false,
      });
      if (!newUserData) {
        res.status(400).send({
          message: "Error: please all  userData are required",
        });
      }
      const result = await db
        .insert(schema.users)
        .values(newUserData)
        .$returningId();

      const createdUser = result[0];
      if (!createdUser) {
        res.status(400).send({
          message:
            "There was an error creating the user with the given email address.",
        });
      }
      await sendVerificationEmail(newUserData.email, emailToken);
      res.status(200).send({
        data: createdUser as User,
        message:
          "Succesffuly create User, please verify your email address and active your account",
      });
    } catch (err) {
      res.status(500).send({
        message: `Internal server Error : ${err}`,
      });
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
          email: true,
          type: true,
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
      if (req.params.id === null) {
        res.status(400).send({
          message: "No user ID given..",
        });
        return;
      }
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, req.params.id),
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
          email: true,
          type: true,
          password: true,
          emailVerified: true,
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

      response.user = user as User;
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
        res.status(400).send({
          message: "No user ID provided.",
        });
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

      if (req.body.name) updatedData.name = req.body.name;
      if (req.body.email) updatedData.email = req.body.email;
      if (req.body.type) updatedData.type = req.body.type;

      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
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
          email: true,
          type: true,
        },
      });

      res.status(200).send({
        data: updatedUser,
        message: "User successfully updated.",
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
