// helpers/streamStats.ts
import { type InferSelectModel } from "drizzle-orm";
import * as schema from "../db/schema";

type TrackStreamRow = InferSelectModel<typeof schema.trackStreams>;

export type ReleaseStreamStats = {
  streamsCount: number;
  monthlyStreamsCount: number;
  listenersCount: number;
  topLocations: {
    location: string;
    streams: number;
    percentage: string;
  }[];
};

export function computeReleaseStatsForTrackIds(
  trackIds: string[],
  allStreams: TrackStreamRow[]
): ReleaseStreamStats {
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
  const streamsForRelease = allStreams.filter((s) =>
    trackIds.includes(s.trackId)
  );

  const streamsCount = streamsForRelease.length;

  const monthlyStreamsCount = streamsForRelease.filter(
    (s) => s.createdAt >= thirtyDaysAgo
  ).length;

  // listeners distincts
  const listenersSet = new Set(
    streamsForRelease
      .map((s) => s.userId)
      .filter((id): id is string => !!id && id.length > 0)
  );
  const listenersCount = listenersSet.size;

  // top locations
  const locationMap = new Map<string, number>();
  for (const s of streamsForRelease) {
    const country = s.country || "Unknown";
    const prev = locationMap.get(country) ?? 0;
    locationMap.set(country, prev + 1);
  }

  const totalByLocation = Array.from(locationMap.values()).reduce(
    (sum, v) => sum + v,
    0
  );

  const topLocations = Array.from(locationMap.entries())
    .map(([location, streams]) => ({
      location,
      streams,
      percentage:
        totalByLocation > 0
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
