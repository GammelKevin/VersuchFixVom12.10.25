import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Get menu categories
    const categoriesResult = await query(`
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

    // Get menu items
    const itemsResult = await query(`
      SELECT
        id,
        category_id,
        name,
        description,
        price,
        is_vegetarian,
        is_vegan,
        is_gluten_free,
        is_spicy,
        allergens,
        COALESCE(image_path, image_url) as image_path,
        display_order,
        is_available,
        vegetarian,
        vegan,
        gluten_free,
        spicy,
        lactose_free,
        kid_friendly,
        alcohol_free,
        contains_alcohol,
        homemade,
        sugar_free,
        recommended
      FROM menu_items
      WHERE is_available = true
      ORDER BY category_id ASC, display_order ASC, name ASC
    `);

    const categories = categoriesResult.rows;
    const menuItems = itemsResult.rows;

    // Group items by category and convert price to number
    const categoriesWithItems = categories.map(category => ({
      ...category,
      items: menuItems
        .filter(item => item.category_id === category.id)
        .map(item => ({
          ...item,
          price: parseFloat(item.price) // Convert string to number
        }))
    }));

    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesWithItems,
        total_items: menuItems.length
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch menu data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
