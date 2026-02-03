import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Digital Credential API',
      version: '1.0.0',
      description: `
        Comprehensive API Documentation for Digital Credential System
        
        **Version:** 1.0.0  
        **Auth Method:** JWT (Bearer Token)  
        **Updated:** February 2026  
        **Database:** PostgreSQL with Prisma ORM  
        
        This API provides endpoints for user authentication, role-based access control (RBAC), 
        file uploads, transaction management, and business operations.
      `,
      contact: {
        name: 'API Support',
        email: 'support@digitalcred.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://api.digitalcred.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token in format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            is_verified: { type: 'boolean' },
            role: { type: 'string', enum: ['user', 'business', 'admin'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' },
            code: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/app/api/**/route.ts',
    './src/app/api/*/route.ts',
  ],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

export default swaggerSpec;
