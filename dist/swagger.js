"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUi = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Distribution Musicale",
            version: "1.0.0",
            description: "Documentation interactive de l'API pour la plateforme de distribution musicale.",
        },
        servers: [
            {
                url: "https://disktro-backend.onrender.com",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/swagger-components.ts"], // fichiers où Swagger ira lire les annotations
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
