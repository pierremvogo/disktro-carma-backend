import { Track } from "./track.model";
import { User } from "./user.model";
interface TrackStreamProperties {
  id: string;

  // RELATION
  trackId: string;
  userId?: string | null;

  // METADATA STREAM
  ipAddress?: string | null;
  country?: string | null; // ex: "FR", "ES", "US"
  city?: string | null;
  device?: string | null; // "mobile", "desktop", "web", etc.

  // TIMESTAMP
  createdAt: string | Date;

  // Relations optionnelles
  track?: Track;
  user?: User; // si tu as un modèle User, tu peux le rajouter plus tard
}

export type TrackStream = TrackStreamProperties | undefined | null;
