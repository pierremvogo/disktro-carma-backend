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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutSettingsController = void 0;
const db_1 = require("../db/db");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
class PayoutSettingsController {
}
exports.PayoutSettingsController = PayoutSettingsController;
_a = PayoutSettingsController;
// ✅ GET /payout/me
PayoutSettingsController.GetMyPayoutSettings = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        const row = await db_1.db.query.artistPayoutSettings.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.artistPayoutSettings.artistId, artistId),
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
    }
    catch (err) {
        console.error("Error fetching payout settings:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
// ✅ PUT /payout/me
PayoutSettingsController.UpsertMyPayoutSettings = async (req, res) => {
    try {
        const artistId = req.user?.id;
        if (!artistId) {
            res.status(401).send({ message: "Unauthorized" });
            return;
        }
        // 🔒 On ne prend PAS artistId depuis le body
        const { bankAccountHolder, bankName, accountNumber, routingNumber, swiftCode, iban, paypalEmail, bizumPhone, mobileMoneyProvider, mobileMoneyPhone, orangeMoneyPhone, } = req.body;
        const existing = await db_1.db.query.artistPayoutSettings.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.artistPayoutSettings.artistId, artistId),
        });
        if (!existing) {
            await db_1.db.insert(schema.artistPayoutSettings).values({
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
        const normalize = (v) => typeof v === "string" && v.trim() === "" ? null : v;
        await db_1.db
            .update(schema.artistPayoutSettings)
            .set({
            bankAccountHolder: bankAccountHolder ?? existing.bankAccountHolder,
            bankName: normalize(bankName) ?? existing.bankName,
            accountNumber: accountNumber ?? existing.accountNumber,
            routingNumber: routingNumber ?? existing.routingNumber,
            swiftCode: swiftCode ?? existing.swiftCode,
            iban: iban ?? existing.iban,
            paypalEmail: paypalEmail ?? existing.paypalEmail,
            bizumPhone: bizumPhone ?? existing.bizumPhone,
            mobileMoneyProvider: mobileMoneyProvider ?? existing.mobileMoneyProvider,
            mobileMoneyPhone: mobileMoneyPhone ?? existing.mobileMoneyPhone,
            orangeMoneyPhone: orangeMoneyPhone ?? existing.orangeMoneyPhone,
        })
            .where((0, drizzle_orm_1.eq)(schema.artistPayoutSettings.artistId, artistId));
        res.status(200).send({ message: "Payout settings updated successfully" });
    }
    catch (err) {
        console.error("Error upserting payout settings:", err);
        res.status(500).send({ message: "Internal server error" });
    }
};
