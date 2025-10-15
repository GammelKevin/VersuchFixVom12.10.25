import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { query } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

// Upload image for menu item (Admin only)
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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const itemId = formData.get('itemId') as string;

    if (!file || !itemId) {
      return NextResponse.json(
        { success: false, error: 'File and itemId are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `menu_${itemId}_${timestamp}${extension}`;

    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'static', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Update database with PostgreSQL
    await query(
      'UPDATE menu_items SET image_path = $1 WHERE id = $2',
      [filename, parseInt(itemId)]
    );

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      filename: filename,
      path: `/static/uploads/${filename}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload image',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Delete/remove image from menu item (Admin only)
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
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'ItemId is required' },
        { status: 400 }
      );
    }

    // Update database to remove image path
    await query(
      'UPDATE menu_items SET image_path = NULL WHERE id = $1',
      [parseInt(itemId)]
    );

    return NextResponse.json({
      success: true,
      message: 'Image removed successfully'
    });

  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove image',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
