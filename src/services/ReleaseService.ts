import { ReleaseData } from "../models/release.model";

class ReleaseService {
  static validateReleaseData(releaseData: ReleaseData): void {
    if (!releaseData.title || !releaseData.upc || !releaseData.releaseDate) {
      throw new Error("Missing required release fields.");
    }
    if (!releaseData.tracks || releaseData.tracks.length === 0) {
      throw new Error("At least one track is required.");
    }
  }
}

export default ReleaseService;
