// Deterministic original-pixel extraction. No image generation is performed.
// Paths are traced in the 450x701 crop at (600,240) of a 1672x941 canvas.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const assets = path.join(root, 'public/images/millsage');
const width = 3840, height = 2160;
const original = await sharp(path.join(assets, 'stellar.jpg')).resize(width, height, { fit: 'fill' }).removeAlpha().raw().toBuffer();
const previous = await sharp(path.join(assets, 'stellar-character.png')).resize(width, height, { fit: 'fill' }).ensureAlpha().raw().toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1672 941" preserveAspectRatio="none">
<g transform="translate(600 240)" fill="white">
<!-- Body, hair and trailing fabric; preserve original silhouette. -->
<path d="M145 110 Q158 111 175 116 L180 124 173 132 174 143 169 164 174 178 Q179 159 180 143 Q182 116 206 114 Q229 111 242 132 L248 142 251 148 249 155 Q259 178 270 201 L276 214 278 245 Q282 266 286 282 Q283 298 270 304 L277 296 277 285 Q270 301 261 307 L267 294 269 280 Q265 300 247 307 Q264 294 262 279 L258 260 252 233 Q251 261 240 280 L238 289 Q251 318 260 336 L264 345 254 353 Q270 391 281 434 Q292 478 299 528 L306 567 315 594 321 609 342 612 351 617 369 618 382 623 392 626 397 634 384 637 353 637 327 633 309 630 Q303 641 286 639 L279 629 255 626 197 625 163 625 145 628 Q145 638 128 636 L117 631 90 625 78 628 54 631 30 630 23 628 43 623 56 621 61 616 75 611 84 598 91 577 97 547 108 497 121 452 132 410 138 383 143 361 136 371 128 379 123 375 124 364 140 351 139 343 146 334 153 320 152 309 152 287 145 277 148 267 149 247 151 228 150 212 141 192 136 169 133 148 134 138 145 130Z"/>
<!-- Raised hand and forearm traced at source-image crop resolution. -->
<g transform="translate(122.792 12.685) scale(.4354167)">
<path d="M78 229 Q88 204 94 181 Q97 170 93 153 L90 137 Q86 125 91 113 L94 98 99 81 Q103 71 104 58 L108 47 Q113 48 112 59 L112 70 Q109 84 104 99 L101 112 111 106 124 102 Q135 99 138 93 Q143 91 141 97 Q138 104 127 110 L119 115 129 114 Q142 111 145 113 Q148 117 139 120 L125 123 120 127 Q130 124 139 125 Q143 128 137 130 L126 131 120 139 119 150 123 170 Q125 177 120 186 L114 205 104 236Z"/>
</g>
<!-- Reflection moves with the character. -->
<path d="M77 631 103 642 113 680 117 701 285 701 298 670 310 636 278 629 145 628Z"/>
</g></svg>`;
const mask = await sharp(Buffer.from(svg)).ensureAlpha().extractChannel(3).raw().toBuffer();
// Trace a generous source-resolution hand boundary, then derive its fine edge
// from the original pale skin pixels. Never synthesize or repaint the fingers.
const handSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="3840" height="2160"><path fill="white" transform="translate(1690 600)" d="M48 211 L65 155 L60 125 L57 108 L60 82 L68 62 L74 43 L76 28 L85 27 L89 47 L85 64 L76 80 L73 96 L82 84 L96 80 L112 71 L113 80 L103 88 L92 92 L119 89 L118 98 L105 103 L114 103 L113 110 L99 109 L94 117 L93 132 L97 153 L85 174 L75 216 Z"/></svg>`;
const handMask = await sharp(Buffer.from(handSvg)).ensureAlpha().extractChannel(3).raw().toBuffer();
for (let y=620; y<812; y++) for(let x=1735; x<1812; x++) {
  const i=y*width+x;
  const r=original[i*3], g=original[i*3+1], b=original[i*3+2];
  const brightness=Math.min(r,g,b);
  const neutrality=Math.max(r,g,b)-brightness;
  const coverage=Math.min(1,Math.max(0,(brightness-125)/65)) * Math.min(1,Math.max(0,(135-neutrality)/45));
  mask[i]=Math.round(handMask[i]*coverage);
}
// Only these title-obscured areas reuse the previous repaired pixels.
// Feather into surrounding original pixels, never affecting face/raised hand.
const repairs = [
  { x: 700, y: 430, w: 120, h: 160, feather: 5 },
  { x: 723, y: 620, w: 162, h: 65, feather: 5 },
];
const rgba = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const i = y * width + x;
  let mix = 0;
  for (const r of repairs) {
    const sx=x*1672/width, sy=y*941/height;
    const edge = Math.min(sx-r.x, r.x+r.w-sx, sy-r.y, r.y+r.h-sy);
    if (edge > 0) mix = Math.max(mix, Math.min(1, edge / r.feather));
  }
  for (let c=0; c<3; c++) rgba[i*4+c] = Math.round(original[i*3+c]*(1-mix) + previous[i*4+c]*mix);
  // In obscured regions the old outline included pieces of the white title.
  // Blend to the repaired cutout alpha as well as its RGB to remove those.
  rgba[i*4+3] = Math.round(mask[i]*(1-mix) + Math.min(mask[i],previous[i*4+3])*mix);
}
const foreground = path.join(assets, 'stellar-character-original.png');
await sharp(rgba, {raw:{width,height,channels:4}}).png().toFile(foreground);
await sharp(path.join(assets, 'stellar-background.png')).resize(width,height,{fit:'fill'}).composite([{input:foreground}]).png().toFile(path.join(assets, 'stellar-restored.png'));
// Check all opaque pixels in the original hand/face region are unchanged.
let checked = 0;
for (let y=600;y<970;y++) for(let x=1665;x<1975;x++) {
 const i=y*width+x;
 if(rgba[i*4+3]===255) { for(let c=0;c<3;c++) if(rgba[i*4+c]!==original[i*3+c]) throw Error('Original pixel changed'); checked++; }
}
console.log({foreground, originalPixelsVerified:checked});
