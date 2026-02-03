import { NextResponse } from 'next/server';
import swaggerSpec from '@/config/swagger';

/**
 * @swagger
 * /api/docs:
 *   get:
 *     summary: API Documentation
 *     description: Swagger UI for API documentation
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: Swagger UI page
 */

export async function GET() {
  // For Swagger UI in Next.js, we return HTML that loads Swagger UI
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Digital Credential API - Swagger UI</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css">
        <style>
          html{
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
          }
          *,
          *:before,
          *:after{
            box-sizing: inherit;
          }
          body{
            margin:0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-standalone-preset.js"></script>
        <script>
        window.onload = function() {
          const spec = ${JSON.stringify(swaggerSpec)};
          const ui = SwaggerUIBundle({
            spec: spec,
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
          window.ui = ui;
        }
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
