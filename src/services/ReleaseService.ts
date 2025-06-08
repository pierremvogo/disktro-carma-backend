import { ReleaseData } from "../models/release.model";

class ReleaseService {
  static validateReleaseData(releaseData: ReleaseData): void {
    if (
      !releaseData.title ||
      !releaseData.upcCode ||
      !releaseData.releaseDate
    ) {
      throw new Error("Missing required release fields.");
    }

    if (!/^\d{12,13}$/.test(releaseData.upcCode)) {
      throw new Error("Invalid UPC code format.");
    }

    if (isNaN(Date.parse(releaseData.releaseDate))) {
      throw new Error("Invalid release date format.");
    }

    if (!releaseData.tracks || releaseData.tracks.length === 0) {
      throw new Error("At least one track is required.");
    }

    releaseData.tracks.forEach((track, index) => {
      if (!track.title || !track.isrcCode || !track.duration) {
        throw new Error(`Track at index ${index} is missing required fields.`);
      }
    });
  }
}

export default ReleaseService;
