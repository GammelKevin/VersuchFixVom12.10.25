import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

// Create a new menu item (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      name,
      description,
      price,
      category_id,
      image_path,
      vegetarian,
      vegan,
      spicy,
      gluten_free,
      lactose_free,
      kid_friendly,
      alcohol_free,
      contains_alcohol,
      homemade,
      sugar_free,
      recommended
    } = data;

    // Validation
    if (!name || price === undefined || !category_id) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryResult = await query(
      'SELECT id FROM menu_categories WHERE id = $1',
      [category_id]
    );

    if (categoryResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Insert the new menu item
    const result = await query(
      `INSERT INTO menu_items (
        name, description, price, category_id, image_path,
        vegetarian, vegan, spicy, gluten_free, lactose_free,
        kid_friendly, alcohol_free, contains_alcohol, homemade,
        sugar_free, recommended
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        name,
        description || null,
        price,
        category_id,
        image_path || null,
        !!vegetarian,
        !!vegan,
        !!spicy,
        !!gluten_free,
        !!lactose_free,
        !!kid_friendly,
        !!alcohol_free,
        !!contains_alcohol,
        !!homemade,
        !!sugar_free,
        !!recommended
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...result.rows[0],
        price: parseFloat(result.rows[0].price) // Convert string to number
      },
      message: 'Menu item created successfully'
    });

  } catch (error) {
    console.error('Error creating menu item:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create menu item';
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item', details: errorMessage },
      { status: 500 }
    );
  }
}

// Delete menu item (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('id');

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Delete the menu item
    await query('DELETE FROM menu_items WHERE id = $1', [itemId]);

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}

// Update menu item (Admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      id,
      name,
      description,
      price,
      category_id,
      image_path,
      vegetarian,
      vegan,
      spicy,
      gluten_free,
      lactose_free,
      kid_friendly,
      alcohol_free,
      contains_alcohol,
      homemade,
      sugar_free,
      recommended
    } = data;

    // Validation
    if (!id || !name || price === undefined || !category_id) {
      return NextResponse.json(
        { success: false, error: 'ID, name, price, and category are required' },
        { status: 400 }
      );
    }

    // Update the menu item
    const result = await query(
      `UPDATE menu_items SET
        name = $1,
        description = $2,
        price = $3,
        category_id = $4,
        image_path = $5,
        vegetarian = $6,
        vegan = $7,
        spicy = $8,
        gluten_free = $9,
        lactose_free = $10,
        kid_friendly = $11,
        alcohol_free = $12,
        contains_alcohol = $13,
        homemade = $14,
        sugar_free = $15,
        recommended = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *`,
      [
        name,
        description || null,
        price,
        category_id,
        image_path || null,
        !!vegetarian,
        !!vegan,
        !!spicy,
        !!gluten_free,
        !!lactose_free,
        !!kid_friendly,
        !!alcohol_free,
        !!contains_alcohol,
        !!homemade,
        !!sugar_free,
        !!recommended,
        id
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result.rows[0],
        price: parseFloat(result.rows[0].price) // Convert string to number
      },
      message: 'Menu item updated successfully'
    });

  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}
