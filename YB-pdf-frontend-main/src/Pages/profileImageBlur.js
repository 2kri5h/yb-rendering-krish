/** Build a blurred data-URL for the outer profile halo — matches Figma layer blur on outercircularpic. */

/** Same artboard width as profileBG / header assets in Figma */
const FIGMA_PAGE_W = 7440;
const PDF_PAGE_W = 595;
/** Outer profile ring diameter in PDF points (stylesFilm.PROFILE_OUTER) */
const PDF_OUTER_PT = 228;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });

/** Same framing as inner circle — cover fit, no extra zoom */
const drawCover = (ctx, img, size) => {
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  ctx.drawImage(img, x, y, w, h);
};

const blurCanvas = (source, blurPx) => {
  if (blurPx <= 0) return source;
  const { width, height } = source;
  const blurred = document.createElement("canvas");
  blurred.width = width;
  blurred.height = height;
  const ctx = blurred.getContext("2d");
  ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(source, 0, 0);
  ctx.filter = "none";
  return blurred;
};

/**
 * Figma layer blur (e.g. 800) → canvas Gaussian radius at render size.
 * Scales blur relative to outer circle diameter on the 7440px Figma frame.
 */
const figmaBlurToCanvasBlur = (figmaBlur, outSize) => {
  const figmaOuterDiameter = PDF_OUTER_PT * (FIGMA_PAGE_W / PDF_PAGE_W);
  return (figmaBlur * outSize) / figmaOuterDiameter;
};

const applyStackedBlur = (source, totalBlur, passMax = 36) => {
  if (totalBlur <= passMax) return blurCanvas(source, totalBlur);

  let current = source;
  let applied = 0;
  while (applied < totalBlur) {
    const step = Math.min(passMax, totalBlur - applied);
    current = blurCanvas(current, step);
    applied += step;
  }
  return current;
};

/**
 * @param {string} src — profile image URL or data URI
 * @param {number} figmaBlur — Figma layer blur value (default 800 on outercircularpic)
 */
export const createBlurredProfileImage = async (src, figmaBlur = 800) => {
  const img = await loadImage(src);
  const outSize = 480;
  const canvasBlur = figmaBlurToCanvasBlur(figmaBlur, outSize);

  const work = document.createElement("canvas");
  work.width = outSize;
  work.height = outSize;
  const workCtx = work.getContext("2d");
  drawCover(workCtx, img, outSize);

  const blurredWork = applyStackedBlur(work, canvasBlur);

  const out = document.createElement("canvas");
  out.width = outSize;
  out.height = outSize;
  const outCtx = out.getContext("2d");
  outCtx.drawImage(blurredWork, 0, 0);

  return out.toDataURL("image/jpeg", 0.92);
};
