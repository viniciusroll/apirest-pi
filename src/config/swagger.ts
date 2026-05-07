import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Loja de Bebidas',
      version: '1.0.0',
      description: 'Sistema de pedidos para loja de bebidas — PI FATEC 2ADS',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // onde ficam os comentários JSDoc das rotas
}

export const swaggerSpec = swaggerJSDoc(options)