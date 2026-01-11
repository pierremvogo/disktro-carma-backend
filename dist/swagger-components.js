"use strict";
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Artist:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de l'artiste
 *         name:
 *           type: string
 *           description: Nom de l'artiste
 *       example:
 *         id: 1
 *         name: "Ninho"
 *
 *     Track:
 *       type: object
 *       required:
 *         - title
 *         - artistId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID du morceau
 *         title:
 *           type: string
 *           description: Titre du morceau
 *         duration:
 *           type: integer
 *           description: Durée en secondes
 *         artistId:
 *           type: integer
 *           description: ID de l'artiste
 *       example:
 *         id: 1
 *         title: "Lettre à une femme"
 *         duration: 210
 *         artistId: 1
 *
 *     Album:
 *       type: object
 *       required:
 *         - title
 *         - artistId
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         releaseDate:
 *           type: string
 *           format: date
 *         artistId:
 *           type: integer
 *       example:
 *         id: 1
 *         title: "Destin"
 *         releaseDate: "2019-03-22"
 *         artistId: 1
 *
 *     Subscription:
 *       type: object
 *       required:
 *         - userId
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [basic, premium, pro]
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         userId: 5
 *         type: "premium"
 *         startDate: "2024-05-16T12:00:00Z"
 *         endDate: "2025-05-16T12:00:00Z"
 *
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *       example:
 *         id: 1
 *         email: "test@openai.com"
 *         password: "hashed_password"
 *         role: "user"
 */
