import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  const filePath = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\a93bcedc-e193-4815-a5ed-905740f49614\\scm_hero_bg_1775276951199.png';
  
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error reading local image:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}
