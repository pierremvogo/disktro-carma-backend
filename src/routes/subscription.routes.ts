/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Gestion des abonnements
 */

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Récupérer la liste des abonnements
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: Liste des abonnements
 */

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Récupérer un abonnement par ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Abonnement trouvé
 */

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Créer un nouvel abonnement
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       201:
 *         description: Abonnement créé
 */

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Mettre à jour un abonnement
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subscription'
 *     responses:
 *       200:
 *         description: Abonnement mis à jour
 */

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Supprimer un abonnement
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Abonnement supprimé
 */
