// Original-pixel extraction from the user's text-free 1200x715 image.
// No RGB repair or generation is applied to the person.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const dir=fileURLToPath(new URL('../public/images/millsage/',import.meta.url));
const prefix=process.argv[2] || 'stellar-clean';
if (!/^[a-z0-9-]+$/.test(prefix)) throw Error('Invalid asset prefix');
const metadata=await sharp(path.join(dir,`${prefix}-source.png`)).metadata();
const {width,height}=metadata;
const scale=width/1200;
if (height!==715*scale) throw Error('Source must match the traced composition aspect ratio');
const source=await sharp(path.join(dir,`${prefix}-source.png`)).removeAlpha().raw().toBuffer();
// Paths are traced on a 2x crop beginning at source (450,230).
const outline=`M164 120 L188 121 L198 91 L196 62 L194 51 L200 35 L204 13 L210 11 L212 31 L208 47 L226 38 L231 39 L227 45 L214 52 L229 49 L232 53 L218 58 L226 57 L227 61 L217 65 L216 86 L207 112 L205 126 L221 136 L215 148 L208 152 L211 174 L203 205 L211 214 L218 168 Q222 133 250 128 Q284 116 307 143 L320 163 L327 175 L324 184 Q342 222 359 260 L384 310 L382 325 Q404 355 401 373 Q400 384 385 390 Q402 376 391 354 L383 338 Q387 378 350 398 Q376 380 370 355 Q362 390 332 401 Q351 380 348 364 Q342 392 311 403 Q342 384 331 348 L324 310 Q316 345 304 369 L299 377 L315 415 L333 454 L322 473 Q351 537 370 614 Q388 702 400 797 L414 833 L445 835 L473 843 L500 847 L526 851 L530 862 L516 869 L485 867 L434 860 L369 859 Q365 869 348 869 Q332 869 328 859 L168 853 Q170 868 150 869 Q134 867 131 858 L110 851 L80 851 L51 859 L19 857 L2 853 L27 843 L45 839 L65 827 L82 806 L94 765 L109 698 L128 633 L145 572 L157 516 L163 488 L152 504 L145 505 L140 493 L141 481 L159 466 L158 451 L169 427 L180 406 L190 384 L194 375 Q164 372 164 349 L168 309 Q133 347 144 370 L155 383 Q127 371 138 342 Q145 323 169 297 L167 280 Q167 270 186 251 L178 235 L164 197 L157 170 L153 157 L160 150 L173 142 Z`;
const reflection=`M37 857 Q95 886 111 970 L359 970 Q398 912 411 861 L365 855 L166 850 L130 859Z`;
const svg=(stroke=0)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1200 715"><g transform="translate(450 230) scale(.5)" fill="white" stroke="white" stroke-width="${stroke}" stroke-linejoin="round"><path d="${outline}"/><path d="${reflection}"/></g></svg>`;
const alpha=await sharp(Buffer.from(svg())).ensureAlpha().extractChannel(3).raw().toBuffer();
// Remove blue sky inside the fine hair loops. Keep face, hands and outfit
// outside these narrowly scoped areas unchanged.
for(let y=Math.floor(330*scale);y<435*scale;y++) for(let x=Math.floor(510*scale);x<655*scale;x++) {
  if(!((x<548*scale && y>355*scale) || (x>608*scale && y>340*scale))) continue;
  const i=y*width+x,r=source[i*3],g=source[i*3+1],b=source[i*3+2];
  const coverage=Math.min(1,Math.max(0,(Math.min(r,g)-70)/50),Math.max(0,(105-(b-Math.min(r,g)))/35));
  alpha[i]=Math.round(alpha[i]*coverage);
}
const rgba=Buffer.alloc(width*height*4);
for(let i=0;i<width*height;i++) {for(let c=0;c<3;c++) rgba[i*4+c]=source[i*3+c];rgba[i*4+3]=alpha[i];}
await sharp(rgba,{raw:{width,height,channels:4}}).png().toFile(path.join(dir,`${prefix}-character.png`));
const plate=await sharp(path.join(dir,'stellar-clean-inpaint.png')).resize(width,height,{fit:'fill'}).removeAlpha().raw().toBuffer();
const repair=await sharp(Buffer.from(svg(60))).blur(4*scale).ensureAlpha().extractChannel(3).raw().toBuffer();
const background=Buffer.from(source);
for(let i=0;i<width*height;i++) for(let c=0;c<3;c++) background[i*3+c]=Math.round(source[i*3+c]*(1-repair[i]/255)+plate[i*3+c]*repair[i]/255);
await sharp(background,{raw:{width,height,channels:3}}).png().toFile(path.join(dir,`${prefix}-background.png`));
await sharp(background,{raw:{width,height,channels:3}}).composite([{input:rgba,raw:{width,height,channels:4}}]).png().toFile(path.join(dir,`${prefix}-preview.png`));
let opaque=0;
for(let i=0;i<width*height;i++) if(alpha[i]===255) {opaque++;for(let c=0;c<3;c++)if(rgba[i*4+c]!==source[i*3+c])throw Error('Original character RGB changed');}
console.log({width,height,opaqueOriginalPixels:opaque});
