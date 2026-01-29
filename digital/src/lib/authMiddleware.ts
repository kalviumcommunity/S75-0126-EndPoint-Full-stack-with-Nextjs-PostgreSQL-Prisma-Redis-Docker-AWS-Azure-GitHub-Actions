import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import { Role, hasPermission } from '../config/roles';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

/**
 * Middleware to authenticate and authorize API requests
 * @param requiredPermissions - Permissions required to access the route
 */
export function withAuth(requiredPermissions?: string[]) {
  return async (req: AuthenticatedRequest, res: NextApiResponse, next: () => void) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false, 
          message: 'Access denied. No token provided.' 
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify the JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
      const verified = await jwtVerify(token, secret) as { payload: JWTPayload };
      
      // Attach user info to request
      req.user = {
        userId: verified.payload.userId,
        email: verified.payload.email,
        role: verified.payload.role
      };

      // Check permissions if required
      if (requiredPermissions && req.user.role) {
        const userHasPermission = requiredPermissions.some(permission => 
          hasPermission(req.user!.role, permission as any)
        );

        if (!userHasPermission) {
          return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Insufficient permissions.' 
          });
        }
      }

      // Call next middleware or route handler
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Invalid token.' 
      });
    }
  };
}

/**
 * Higher-order function to wrap API handlers with authentication
 */
export function createApiHandler(handler: (req: AuthenticatedRequest, res: NextApiResponse) => void) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // This is a simplified version for Next.js API routes
    // In a real implementation, you'd integrate this differently
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          success: false, 
          message: 'Access denied. No token provided.' 
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify the JWT token
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_key');
      const verified = await jwtVerify(token, secret) as { payload: JWTPayload };
      
      // Attach user info to request
      req.user = {
        userId: verified.payload.userId,
        email: verified.payload.email,
        role: verified.payload.role
      };

      // Now call the original handler with authenticated user
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. Invalid token.' 
      });
    }
  };
}