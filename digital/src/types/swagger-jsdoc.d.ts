declare module 'swagger-jsdoc' {
  interface SwaggerOptions {
    definition: {
      openapi?: string;
      info: {
        title: string;
        version: string;
        description?: string;
        contact?: {
          name?: string;
          email?: string;
          url?: string;
        };
      };
      servers?: Array<{
        url: string;
        description?: string;
      }>;
      components?: {
        securitySchemes?: Record<string, any>;
        schemas?: Record<string, any>;
      };
      security?: Array<Record<string, string[]>>;
    };
    apis: string[];
  }

  function swaggerJsdoc(options: SwaggerOptions): Record<string, any>;
  export = swaggerJsdoc;
}
