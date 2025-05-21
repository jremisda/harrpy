import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files, File } from 'formidable';
import { put } from '@vercel/blob';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function validateFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large');
  }
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype || '')) {
    throw new Error('Invalid file type');
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
    });

    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const fileArray = files.file;
    if (!fileArray || !Array.isArray(fileArray) || fileArray.length === 0) {
      throw new Error('No file uploaded');
    }
    const file = fileArray[0];
    validateFile(file);

    // Read file buffer
    const fileBuffer = await fs.promises.readFile(file.filepath);
    const originalFilename = file.originalFilename || '';
    const blobName = `${Date.now()}-${originalFilename}`;
    const blob = await put(blobName, fileBuffer, {
      access: 'public',
      contentType: file.mimetype || undefined,
    });

    res.status(200).json({
      url: blob.url,
      size: file.size,
      type: file.mimetype,
      name: originalFilename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
} 