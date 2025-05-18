// controllers/report.controller.ts (ajout)

export const getListeningStatsByArtist = async (req: Request, res: Response) => {
  const stats = await db.execute(sql`
    SELECT t.artist_id, COUNT(l.id) as total_listens
    FROM listens l
    JOIN tracks t ON l.track_id = t.id
    GROUP BY t.artist_id
    ORDER BY total_listens DESC
    LIMIT 10
  `);

  res.json(stats);
};


// routes/report.routes.ts (ajout)
router.get("/listens-by-artist", getListeningStatsByArtist);

