// src/services/geoIPService.ts
import fetch from "node-fetch";

export type GeoIPResult = {
  countryCode: string | null; // ex: "FR"
  city: string | null; // ex: "Paris"
};
const geoCache = new Map<string, GeoIPResult>();
export class GeoIPService {
  /**
   * Retourne un pays + ville à partir d'une IP.
   * Tu peux adapter l'URL du provider selon ton choix.
   */
  // dans GeoIPService

  static async lookup(ipAddress: string | null): Promise<GeoIPResult> {
    if (!ipAddress) return { countryCode: null, city: null };

    const cached = geoCache.get(ipAddress);
    if (cached) return cached;

    try {
      const url = `https://ipapi.co/${ipAddress}/json/`;
      const res = await fetch(url);
      if (!res.ok) return { countryCode: null, city: null };
      const data: any = await res.json();

      const result: GeoIPResult = {
        countryCode: data.country_code || data.country || null,
        city: data.city || null,
      };

      geoCache.set(ipAddress, result);
      return result;
    } catch {
      return { countryCode: null, city: null };
    }
  }
}
