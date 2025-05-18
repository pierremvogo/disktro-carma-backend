import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Distribution Musicale',
      version: '1.0.0',
      description:
        "Documentation interactive de l'API pour la plateforme de distribution musicale.",
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/swagger-components.ts'], // fichiers où Swagger ira lire les annotations
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
