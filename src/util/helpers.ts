import { paramCase } from 'change-case';
import colorConvert from 'color-convert';
import standarizeColor from './standarizeColor.js';

export function orientationToAngle({ type, value }: { type: 'directional' | 'circular'; value: 'left' | 'top' | 'right' | 'bottom'; }) {
  if (type == 'directional') {
    return {
      'top': 0,
      'right': 90,
      'bottom': 180,
      'left': 270
    }[value];
  }
  else {
    return Number(value);
  }
}

export function ensureColor(value: number[] | string, type: string) {
  const str = value instanceof Array ? `rgba(${ [ ...value, 1 ].slice(0, 4).join(', ') })` : type === 'hex' ? `#${ value }` : value;
  try {
    const [ , color ] = (standarizeColor(str) as string).match(/#(.*)/) ?? [];
    return `rgba(${ [ ...colorConvert.hex.rgb.raw(color), 1].join(', ') })`;
  }
  catch {
    return value;
  }
}

export function toCSSVars(obj: { [k: string]: string; }) {
  return Object.fromEntries(Object.entries(obj).map(([ key, value ]) => [`--${ paramCase(key) }` as string, value]));
}

export function openFile(opts: { types: string[]; maxSize: number; }) {
  return new Promise(function(resolve, reject) {
    const input = Object.assign(document.createElement('input'), {
      type: 'file',
      accept: opts.types.join(','),
      style: `
        position: fixed;
        left: -100%;
        top: -100%;
        visibility: hidden;
      `
    });
    input.addEventListener('change', () => {
      document.body.removeChild(input);
      if (input.files) {
        const file = input.files[0];
        if (file.size > opts.maxSize) {
          reject({ err: 'File size too big' });
        }
        else {
          resolve(file);
        }
      }
    });
    document.body.appendChild(input);
    input.click();
  }) as Promise<File>;
}

export function imageInfo(file: File | Blob) {
  return new Promise(function(resolve) {
    const img = new Image();
    img.addEventListener('load', () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        ratio: img.naturalWidth / img.naturalHeight
      });
    });
    img.src = URL.createObjectURL(file);
  }) as Promise<{
    width: number;
    height: number;
    ratio: number;
  }>;
}

export function blobToDataURL(blob: Blob) {
  return new Promise(function(resolve) {
    const reader = new FileReader();
    reader.addEventListener('load', event => {
      if (event.target?.result) {
        resolve(event.target?.result as string);
      }
      else {
        resolve(null);
      }
    });
    reader.readAsDataURL(blob);
  }) as Promise<string | null>;
}