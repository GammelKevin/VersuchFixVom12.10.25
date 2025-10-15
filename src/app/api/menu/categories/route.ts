import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Get all categories
export async function GET() {
  try {
    const result = await query(`
      SELECT
        id,
        name,
        description,
        display_order,
        is_active
      FROM menu_categories
      WHERE is_active = true
      ORDER BY display_order ASC
    `);

    return NextResponse.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Create a new category
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, display_name, description, order } = data;

    // Validation
    if (!name || !display_name) {
      return NextResponse.json(
        { success: false, error: 'Name and display name are required' },
        { status: 400 }
      );
    }

    // Check if category with same name already exists
    const existingResult = await query(
      'SELECT id FROM menu_categories WHERE name = $1',
      [name]
    );

    if (existingResult.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    // Insert the new category
    const result = await query(
      `INSERT INTO menu_categories (name, description, display_order, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, display_order as order, is_active`,
      [
        display_name,
        description || null,
        order || 0,
        true
      ]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// Update a category
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, name, display_name, description, order } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE menu_categories
       SET name = $1, description = $2, display_order = $3
       WHERE id = $4
       RETURNING id, name, description, display_order as order, is_active`,
      [
        display_name || name,
        description,
        order || 0,
        id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category has items
    const itemsResult = await query(
      'SELECT COUNT(*) as count FROM menu_items WHERE category_id = $1 AND is_available = true',
      [id]
    );

    if (itemsResult.rows[0].count > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with items. Delete items first.' },
        { status: 400 }
      );
    }

    // Soft delete (set is_active to false)
    const result = await query(
      'UPDATE menu_categories SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}