"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeReleaseStatsForTrackIds = computeReleaseStatsForTrackIds;
function computeReleaseStatsForTrackIds(trackIds, allStreams) {
    if (trackIds.length === 0) {
        return {
            streamsCount: 0,
            monthlyStreamsCount: 0,
            listenersCount: 0,
            topLocations: [],
        };
    }
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    // streams filtrés pour CES tracks uniquement
    const streamsForRelease = allStreams.filter((s) => trackIds.includes(s.trackId));
    const streamsCount = streamsForRelease.length;
    const monthlyStreamsCount = streamsForRelease.filter((s) => s.createdAt >= thirtyDaysAgo).length;
    // listeners distincts
    const listenersSet = new Set(streamsForRelease
        .map((s) => s.userId)
        .filter((id) => !!id && id.length > 0));
    const listenersCount = listenersSet.size;
    // top locations
    const locationMap = new Map();
    for (const s of streamsForRelease) {
        const country = s.country || "Unknown";
        const prev = locationMap.get(country) ?? 0;
        locationMap.set(country, prev + 1);
    }
    const totalByLocation = Array.from(locationMap.values()).reduce((sum, v) => sum + v, 0);
    const topLocations = Array.from(locationMap.entries())
        .map(([location, streams]) => ({
        location,
        streams,
        percentage: totalByLocation > 0
            ? `${((streams / totalByLocation) * 100).toFixed(1)}%`
            : "0%",
    }))
        .sort((a, b) => b.streams - a.streams);
    return {
        streamsCount,
        monthlyStreamsCount,
        listenersCount,
        topLocations,
    };
}
