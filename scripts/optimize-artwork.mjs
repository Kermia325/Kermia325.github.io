import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../public/images/millsage/', import.meta.url));
const jobs = [
  ['stellar-hd-source.png', 'stellar-static.webp', 1920, 90],
  ['stellar-hd-source.png', 'stellar-mobile.webp', 1200, 88],
  ['stellar-hd-background.png', 'stellar-parallax-background.webp', 1920, 90],
  ['stellar-hd-character.png', 'stellar-parallax-character.webp', 1920, 94],
  ['stellar-background.png', 'stellar-inner.webp', 1920, 90],
  ['cookie-scroll-no-text.png', 'cookie-scroll-optimized.webp', 228, 92],
];
for (const [input, output, width, quality] of jobs) {
  const result = await sharp(path.join(root, input))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, alphaQuality: 100, effort: 6 })
    .toFile(path.join(root, output));
  console.log(`${output}: ${result.width}x${result.height}, ${result.size} bytes`);
}

// Keep the same mobile canvas/crop; offer AVIF before the existing WebP fallback.
const mobile = await sharp(path.join(root, 'stellar-hd-source.png'))
  .resize({ width: 1200, withoutEnlargement: true })
  .avif({ quality: 60, effort: 7, chromaSubsampling: '4:4:4' })
  .toFile(path.join(root, 'stellar-mobile.avif'));
console.log(`stellar-mobile.avif: ${mobile.width}x${mobile.height}, ${mobile.size} bytes`);
