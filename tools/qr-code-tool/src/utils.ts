import QRCode from 'qrcode';
import jsQR from 'jsqr';

export async function generateQr(
  text: string,
  options?: QRCode.QRCodeRenderersOptions,
): Promise<string> {
  if (!text) return '';
  try {
    return await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      ...options,
    });
  } catch {
    throw new Error('Failed to generate QR code');
  }
}

export async function scanQrFromUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas 2D context not available'));

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        resolve(code.data);
      } else {
        reject(new Error('No QR code found in the image.'));
      }
    };
    img.onerror = () => reject(new Error('Invalid image file.'));
    img.src = url;
  });
}

export async function scanQrFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      scanQrFromUrl(e.target?.result as string)
        .then(resolve)
        .catch(reject);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
