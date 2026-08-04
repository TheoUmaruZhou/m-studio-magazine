/**
 * Compresses an image file by scaling its dimensions on a Canvas before converting to DataURL.
 * This prevents storing huge multi-megabyte raw camera base64 strings in memory/state.
 */
export async function compressImage(
  file: File,
  maxDimension = 2000,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Return early for SVG or non-raster images
    if (file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions preserving aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback if canvas 2D context is unavailable
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export compressed image
      const outputFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const compressedDataUrl = canvas.toDataURL(outputFormat, quality);
      resolve(compressedDataUrl);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}
