import { type NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const CATALOGO_ROOT = process.env.CATALOGO_LOCAL_PATH ?? '';

const MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  heic: 'image/heic',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;

  const relativePath = slug.join(path.sep);
  const fullPath = path.join(CATALOGO_ROOT, relativePath);

  // Prevent path traversal
  const resolved = path.resolve(fullPath);
  if (!resolved.startsWith(path.resolve(CATALOGO_ROOT))) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const buffer = await readFile(resolved);
    const ext = path.extname(resolved).slice(1).toLowerCase();
    const contentType = MIME[ext] ?? 'application/octet-stream';

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return new Response('Not Found', { status: 404 });
  }
}
