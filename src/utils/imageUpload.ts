import { ImageUploadResponse, ImageUploadOptions } from '../types/images';
import { UPLOAD_CONFIG } from '../config/images';

export class ImageUploadError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

export async function uploadImage(
  file: File,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResponse> {
  try {
    // Validate file size
    if (file.size > (options.maxSize || UPLOAD_CONFIG.maxFileSize)) {
      throw new ImageUploadError(
        'File too large',
        'FILE_TOO_LARGE'
      );
    }

    // Validate file type
    if (!UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
      throw new ImageUploadError(
        'Invalid file type',
        'INVALID_FILE_TYPE'
      );
    }

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    // Upload to API
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ImageUploadError(
        error.message || 'Upload failed',
        error.code || 'UPLOAD_FAILED'
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ImageUploadError) {
      throw error;
    }
    throw new ImageUploadError(
      'Failed to upload image',
      'UPLOAD_FAILED'
    );
  }
}

export async function validateImage(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(true);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve(false);
    };
    img.src = URL.createObjectURL(file);
  });
}

export function generateImageUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${process.env.NEXT_PUBLIC_VERCEL_URL || ''}/${cleanPath}`;
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
} 