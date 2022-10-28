import { openFile, imageInfo, blobToDataURL } from './helpers';
import Compressor from 'compressorjs';

export type UploadImageOptions = {
  width: number;
  height: number;
  mode?: 'max' | 'min';
  quality?: number;
  type?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export default async function uploadImage({ width, height, mode, quality, type }: UploadImageOptions) {
  return new Promise<Blob>(async (resolve, reject) => {
    const file = await openFile({
      maxSize: 32000000,
      types: ['image/*']
    });
    const __imageInfo = await imageInfo(file);
    const imageRatio = __imageInfo.height / __imageInfo.width;
    const targetRatio = height / width;
    const sizingSide = (() => {
      switch (mode) {
      case 'max': return imageRatio >= targetRatio ? 'height' : 'width';
      default:    return imageRatio >= targetRatio ? 'width' : 'height';
      }
    })();
  
    new Compressor(file, {
      mimeType: type,
      quality: quality,
      checkOrientation: true,
      [sizingSide]: { width, height }[sizingSide],
      async success(result) {
        const blob = result instanceof Blob ? result : new Blob([result]);
        resolve(blob);
      },
      error(err) {
        reject(err);
      },
    });  
  });
}