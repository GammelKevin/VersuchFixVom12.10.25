import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Get all users
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and has permission
    const sessionId = request.cookies.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Verify user has admin rights
    const sessionResult = await query(
      `SELECT u.role FROM user_sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0 ||
        (sessionResult.rows[0].role !== 'admin' && sessionResult.rows[0].role !== 'super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    // Get all users
    const usersResult = await query(
      `SELECT id, email, name, role, created_at, last_login, is_active
       FROM admin_users
       ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      users: usersResult.rows
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Laden der Benutzer' },
      { status: 500 }
    );
  }
}

// Create new user
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and has permission
    const sessionId = request.cookies.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Verify user has admin rights
    const sessionResult = await query(
      `SELECT u.role FROM user_sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0 ||
        (sessionResult.rows[0].role !== 'admin' && sessionResult.rows[0].role !== 'super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    const { email, password, name, role = 'admin' } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUserResult = await query(
      'SELECT id FROM admin_users WHERE email = $1',
      [email]
    );

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'E-Mail bereits vergeben' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO admin_users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [email, hashedPassword, name, role]
    );

    return NextResponse.json({
      success: true,
      message: 'Benutzer erfolgreich erstellt',
      userId: result.rows[0].id
    });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Erstellen des Benutzers' },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Verify user has admin rights
    const sessionResult = await query(
      `SELECT u.role FROM user_sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0 ||
        (sessionResult.rows[0].role !== 'admin' && sessionResult.rows[0].role !== 'super_admin')) {
      return NextResponse.json(
        { success: false, error: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    const { id, email, name, role, is_active, password } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Benutzer-ID erforderlich' },
        { status: 400 }
      );
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (role) {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(hashedPassword);
    }

    values.push(id);

    await query(
      `UPDATE admin_users SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    return NextResponse.json({
      success: true,
      message: 'Benutzer erfolgreich aktualisiert'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Aktualisieren des Benutzers' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    // Verify user has super_admin rights
    const sessionResult = await query(
      `SELECT u.role FROM user_sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0 || sessionResult.rows[0].role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Keine Berechtigung' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Benutzer-ID erforderlich' },
        { status: 400 }
      );
    }

    // Don't allow deleting the last super_admin
    const superAdminCountResult = await query(
      'SELECT COUNT(*) as count FROM admin_users WHERE role = $1',
      ['super_admin']
    );

    const userToDeleteResult = await query(
      'SELECT role FROM admin_users WHERE id = $1',
      [userId]
    );

    if (userToDeleteResult.rows.length > 0 &&
        userToDeleteResult.rows[0].role === 'super_admin' &&
        parseInt(superAdminCountResult.rows[0].count) === 1) {
      return NextResponse.json(
        { success: false, error: 'Der letzte Super-Admin kann nicht gelöscht werden' },
        { status: 400 }
      );
    }

    await query('DELETE FROM admin_users WHERE id = $1', [userId]);

    return NextResponse.json({
      success: true,
      message: 'Benutzer erfolgreich gelöscht'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Fehler beim Löschen des Benutzers' },
      { status: 500 }
    );
  }
}
