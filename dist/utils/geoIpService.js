"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoIPService = void 0;
// src/services/geoIPService.ts
const node_fetch_1 = __importDefault(require("node-fetch"));
const geoCache = new Map();
class GeoIPService {
    /**
     * Retourne un pays + ville à partir d'une IP.
     * Tu peux adapter l'URL du provider selon ton choix.
     */
    // dans GeoIPService
    static async lookup(ipAddress) {
        if (!ipAddress)
            return { countryCode: null, city: null };
        const cached = geoCache.get(ipAddress);
        if (cached)
            return cached;
        try {
            const url = `https://ipapi.co/${ipAddress}/json/`;
            const res = await (0, node_fetch_1.default)(url);
            if (!res.ok)
                return { countryCode: null, city: null };
            const data = await res.json();
            const result = {
                countryCode: data.country_code || data.country || null,
                city: data.city || null,
            };
            geoCache.set(ipAddress, result);
            return result;
        }
        catch {
            return { countryCode: null, city: null };
        }
    }
}
exports.GeoIPService = GeoIPService;
