import { RequestHandler } from "express";
import { db } from "../db/db";
import * as schema from "../db/schema";
import { eq } from "drizzle-orm";

export class PayoutSettingsController {
  // ✅ GET /payout/me
  static GetMyPayoutSettings: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      const row = await db.query.artistPayoutSettings.findFirst({
        where: eq(schema.artistPayoutSettings.artistId, artistId),
      });

      res.status(200).send({
        message: "Payout settings fetched successfully",
        data: row ?? {
          artistId,
          bankAccountHolder: "",
          bankName: "",
          accountNumber: "",
          routingNumber: "",
          swiftCode: "",
          iban: "",
          paypalEmail: "",
          bizumPhone: "",
          mobileMoneyProvider: "",
          mobileMoneyPhone: "",
          orangeMoneyPhone: "",
        },
      });
    } catch (err) {
      console.error("Error fetching payout settings:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };

  // ✅ PUT /payout/me
  static UpsertMyPayoutSettings: RequestHandler = async (req, res) => {
    try {
      const artistId = (req as any).user?.id as string | undefined;
      if (!artistId) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      // 🔒 On ne prend PAS artistId depuis le body
      const {
        bankAccountHolder,
        bankName,
        accountNumber,
        routingNumber,
        swiftCode,
        iban,
        paypalEmail,
        bizumPhone,
        mobileMoneyProvider,
        mobileMoneyPhone,
        orangeMoneyPhone,
      } = req.body;

      const existing = await db.query.artistPayoutSettings.findFirst({
        where: eq(schema.artistPayoutSettings.artistId, artistId),
      });

      if (!existing) {
        await db.insert(schema.artistPayoutSettings).values({
          artistId,
          bankAccountHolder: bankAccountHolder ?? null,
          bankName: bankName ?? null,
          accountNumber: accountNumber ?? null,
          routingNumber: routingNumber ?? null,
          swiftCode: swiftCode ?? null,
          iban: iban ?? null,
          paypalEmail: paypalEmail ?? null,
          bizumPhone: bizumPhone ?? null,
          mobileMoneyProvider: mobileMoneyProvider ?? null,
          mobileMoneyPhone: mobileMoneyPhone ?? null,
          orangeMoneyPhone: orangeMoneyPhone ?? null,
        });

        res
          .status(201)
          .send({ message: "Payout settings created successfully" });
        return;
      }

      await db
        .update(schema.artistPayoutSettings)
        .set({
          bankAccountHolder: bankAccountHolder ?? existing.bankAccountHolder,
          bankName: bankName ?? existing.bankName,
          accountNumber: accountNumber ?? existing.accountNumber,
          routingNumber: routingNumber ?? existing.routingNumber,
          swiftCode: swiftCode ?? existing.swiftCode,
          iban: iban ?? existing.iban,
          paypalEmail: paypalEmail ?? existing.paypalEmail,
          bizumPhone: bizumPhone ?? existing.bizumPhone,
          mobileMoneyProvider:
            mobileMoneyProvider ?? existing.mobileMoneyProvider,
          mobileMoneyPhone: mobileMoneyPhone ?? existing.mobileMoneyPhone,
          orangeMoneyPhone: orangeMoneyPhone ?? existing.orangeMoneyPhone,
        })
        .where(eq(schema.artistPayoutSettings.artistId, artistId));

      res.status(200).send({ message: "Payout settings updated successfully" });
    } catch (err) {
      console.error("Error upserting payout settings:", err);
      res.status(500).send({ message: "Internal server error" });
    }
  };
}
