import { XMLParser } from "fast-xml-parser";

import { db } from "../db/db"; // ton instance drizzle
import { release } from "../db/schema";
import { eq } from "drizzle-orm";

class NotificationService {
  static async processACK(ackXml: string): Promise<void> {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    try {
      const ackData = parser.parse(ackXml);

      const messageId =
        ackData["ern:AcknowledgementMessage"]?.["ern:MessageHeader"]?.[
          "ern:MessageId"
        ];
      const status =
        ackData["ern:AcknowledgementMessage"]?.["ern:Acknowledgement"]?.[
          "ern:AcknowledgementType"
        ];

      if (!messageId || !status) {
        throw new Error("ACK XML incomplet : MessageId ou Status manquant");
      }

      console.log("ACK reçu et traité :");
      console.log("➡️ MessageId:", messageId);
      console.log("➡️ Status:", status);

      // Mise à jour en base
      const existingRelease = await db
        .select()
        .from(release)
        .where(eq(release.MessageId, messageId))
        .execute();

      if (existingRelease.length === 0) {
        console.warn(`Aucune release trouvée avec MessageId ${messageId}`);
      } else {
        await db
          .update(release)
          .set({ status })
          .where(eq(release.MessageId, messageId))
          .execute();

        console.log(`Release ${messageId} mise à jour avec status "${status}"`);
      }
    } catch (error) {
      console.error("Erreur lors du traitement ACK XML :", error);
    }
  }
}

export default NotificationService;
