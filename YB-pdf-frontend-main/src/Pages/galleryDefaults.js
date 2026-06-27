import defaultImg from "./assets/default.jpg";
import gal1 from "./assets/gallery/1.png";
import gal2 from "./assets/gallery/2gal.png";
import gal3 from "./assets/gallery/3gal.png";
import gal4 from "./assets/gallery/4gal.png";

/** Default gallery image per slot when the user did not upload one */
export const GALLERY_DEFAULT_SRC = {
  img1: gal1,
  img2: gal2,
  img3: gal3,
  img4: gal4,
};

export const GALLERY_KEYS = ["img1", "img2", "img3", "img4"];

export const getGalleryDefaultSrc = (key) =>
  GALLERY_DEFAULT_SRC[key] ?? defaultImg;

/** User upload if present, otherwise the slot's default gallery image */
export const resolveGalleryImageSrc = (profile, key) => {
  const src = profile?.[key];
  if (src && typeof src === "string" && src.trim()) return src;
  return getGalleryDefaultSrc(key);
};
