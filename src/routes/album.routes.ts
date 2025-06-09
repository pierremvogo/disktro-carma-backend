import { Router } from "express";
import { AlbumController } from "../controllers";
const albumRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Album
 *     description: Gestion des albums musicaux
 */

/**
 * @swagger
 * /album/create:
 *   post:
 *     tags:
 *       - Album
 *     summary: Créer un nouvel album
 *     requestBody:
 *       description: Données de l'album à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de l'album
 *               duration:
 *                 type: string
 *                 description: Durée de l'album
 *               coverUrl:
 *                 type: string
 *                 description: Image de couverture de l'album
 *             example:
 *               title: "Nouvel album"
 *               duration: "15"
 *               coverUrl: "https://mon-site/cover.png"
 *     responses:
 *       201:
 *         description: Album créé avec succès
 *       400:
 *         description: Erreur lors de la création de l'album
 */

/**
 * @swagger
 * /album/getById/{id}:
 *   get:
 *     tags:
 *       - Album
 *     summary: Récupérer un album par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album
 *     responses:
 *       200:
 *         description: Album trouvé
 *       404:
 *         description: Album non trouvé
 */

/**
 * @swagger
 * /album/getAll:
 *   get:
 *     tags:
 *       - Album
 *     summary: Récupérer la liste de tous les albums
 *     responses:
 *       200:
 *         description: Liste des albums récupérée avec succès
 *       500:
 *         description: Erreur serveur lors de la récupération des albums
 */

/**
 * @swagger
 * /album/getByArtist/{artistId}:
 *   get:
 *     tags:
 *       - Album
 *     summary: Récupérer tous les albums d'un artiste par son ID
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'artiste
 *     responses:
 *       200:
 *         description: Liste des albums trouvés
 *       404:
 *         description: Aucun album trouvé pour cet artiste
 */

/**
 * @swagger
 * /album/{id}:
 *   put:
 *     tags:
 *       - Album
 *     summary: Mettre à jour un album
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titre de l'album
 *               duration:
 *                 type: string
 *                 description: Durée de l'album
 *               coverUrl:
 *                 type: string
 *                 description: Image de couverture de l'album
 *             example:
 *               title: "Nouvel album"
 *               duration: "15"
 *               coverUrl: "https://mon-site/cover.png"
 *     responses:
 *       200:
 *         description: Album mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 releaseDate:
 *                   type: string
 *                   format: date
 *                 artistId:
 *                   type: string
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Album non trouvé
 */

/**
 * @swagger
 * /album/{id}:
 *   delete:
 *     tags:
 *       - Album
 *     summary: Supprimer un album
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'album à supprimer
 *     responses:
 *       200:
 *         description: Album supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Album supprimé avec succès"
 *       404:
 *         description: Album non trouvé
 */

albumRoute.post("/create", AlbumController.create);
albumRoute.get("/getById/:id", AlbumController.FindAlbumById);
albumRoute.get("/getAll", AlbumController.FindAllAlbums);
albumRoute.get("/getByArtist/:artistId", AlbumController.FindAlbumsByArtistId);
albumRoute.put("/:id", AlbumController.UpdateAlbum);
albumRoute.delete("/:id", AlbumController.DeleteAlbum);

export default albumRoute;
