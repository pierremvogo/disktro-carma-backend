import { create } from "xmlbuilder2";
import { ReleaseData } from "../models";

class DDEXMapper {
  static mapToDDEX(releaseData: ReleaseData, messageId: string): string {
    const doc = create({ version: "1.0", encoding: "UTF-8" })
      .ele("ern:NewReleaseMessage", {
        "xmlns:ern": "http://ddex.net/xml/ern/382",
        MessageSchemaVersionId: "3.8.2",
      })

      // MessageHeader
      .ele("ern:MessageHeader")
      .ele("ern:MessageId")
      .txt(messageId)
      .up()
      .ele("ern:MessageThreadId")
      .txt(messageId)
      .up()
      .ele("ern:MessageSender")
      .ele("ern:PartyName")
      .ele("ern:FullName")
      .txt("Mon Distributeur")
      .up()
      .up()
      .up()
      .up()

      // ReleaseList
      .ele("ern:ReleaseList")
      .ele("ern:Release")
      .ele("ern:ReleaseId")
      .ele("ern:ICPN")
      .txt(releaseData.upc)
      .up()
      .up()
      .ele("ern:ReferenceTitle")
      .ele("ern:TitleText")
      .txt(releaseData.title)
      .up()
      .up()
      .ele("ern:ReleaseType")
      .txt("Album")
      .up()
      .ele("ern:ReleaseDetailsByTerritory")
      .ele("ern:DisplayArtistName")
      .txt(releaseData.artist)
      .up()
      .ele("ern:ReleaseDate")
      .txt(releaseData.releaseDate)
      .up()
      .up()
      .ele("ern:TrackList");

    // Ajout des pistes
    releaseData.tracks.forEach((track) => {
      doc
        .ele("ern:Track")
        .ele("ern:TrackId")
        .ele("ern:ISRC")
        .txt(track.isrc)
        .up()
        .up()
        .ele("ern:ReferenceTitle")
        .ele("ern:TitleText")
        .txt(track.title)
        .up()
        .up()
        .ele("ern:Duration")
        .txt(track.duration)
        .up()
        .up();
    });

    const xmlString = doc.end({ prettyPrint: true });
    return xmlString;
  }
}

export default DDEXMapper;
