import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Verify user authentication from request cookies
 * @param request NextRequest object
 * @returns AuthResult with user data if authenticated
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const sessionId = request.cookies.get('session')?.value;

    if (!sessionId) {
      return {
        success: false,
        error: 'Nicht autorisiert - Keine Session gefunden'
      };
    }

    // Get session with user data
    const sessionResult = await query(
      `SELECT u.id, u.email, u.name, u.role
       FROM user_sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.expires_at > NOW() AND u.is_active = true`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      return {
        success: false,
        error: 'Ungültige oder abgelaufene Session'
      };
    }

    const user = sessionResult.rows[0];

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      success: false,
      error: 'Authentifizierungsfehler'
    };
  }
}

/**
 * Verify user has admin or super_admin role
 * @param request NextRequest object
 * @returns AuthResult with user data if authorized
 */
export async function verifyAdminAuth(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request);

  if (!authResult.success || !authResult.user) {
    return authResult;
  }

  if (authResult.user.role !== 'admin' && authResult.user.role !== 'super_admin') {
    return {
      success: false,
      error: 'Keine Berechtigung - Admin-Rechte erforderlich'
    };
  }

  return authResult;
}

/**
 * Verify user has super_admin role
 * @param request NextRequest object
 * @returns AuthResult with user data if authorized
 */
export async function verifySuperAdminAuth(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request);

  if (!authResult.success || !authResult.user) {
    return authResult;
  }

  if (authResult.user.role !== 'super_admin') {
    return {
      success: false,
      error: 'Keine Berechtigung - Super-Admin-Rechte erforderlich'
    };
  }

  return authResult;
}
