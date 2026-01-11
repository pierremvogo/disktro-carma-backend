"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugMiddleware = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const SlugMiddleware = (queryBuilder, slugColumn) => {
    return async (req, res, next) => {
        try {
            const { slug } = req.body;
            if (!slug) {
                res.status(400).json({ message: "Slug is required." });
                return;
            }
            const existingSlug = await queryBuilder.findFirst({
                where: (0, drizzle_orm_1.eq)(slugColumn, slug),
            });
            if (existingSlug) {
                res.status(409).json({ message: "Slug already exists." });
                return;
            }
            next();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error." });
            return;
        }
    };
};
exports.SlugMiddleware = SlugMiddleware;
