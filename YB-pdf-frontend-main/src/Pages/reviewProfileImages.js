import axios from "axios";
import defaultImg from "./assets/default.jpg";
import { flattenReviewPosts } from "./styles/stylesReview.js";
import {
  GALLERY_KEYS,
  getGalleryDefaultSrc,
} from "./galleryDefaults.js";

const YEARBOOK_ORIGIN = "https://yearbook.sarc-iitb.org";
const IMPRESSION_BASE = `${YEARBOOK_ORIGIN}/api/Impression_Images`;

/** Same token used for yearbook API calls (media may require auth) */
/** Keep in sync with FinalFetchPageData yearbook token */
const YEARBOOK_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg3NjM2MzI5LCJpYXQiOjE3ODI0NTIzMjksImp0aSI6Ijk1NGVhZmI0YjlmYTQ2OGJiNmQ3ODUyOTQxZDIyZjg0IiwidXNlcl9pZCI6ODg1N30.M0RARmmJUiDZon34oUhnVmXn4drq9RNfPxFnNk7eoxs";

const ANONYMOUS_AVATAR =
  "https://avatars.githubusercontent.com/u/16786985?v=4";

const PROFILE_EXT_CANDIDATES = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "JPG",
  "JPEG",
  "PNG",
];

/** JPEG quality when converting WebP for react-pdf */
const PDF_SAFE_JPEG_QUALITY = 0.95;
const PDF_SAFE_MAX_DIMENSION = 1600;

const FETCH_CONCURRENCY = 6;
const IMAGE_FETCH_TIMEOUT_MS = 45000;

let cachedDefaultDataUri = null;
let cachedAnonymousDataUri = null;
let cachedGalleryDataUris = null;

const authHeaders = () => ({ Authorization: `Bearer ${YEARBOOK_TOKEN}` });

const toAbsoluteUrl = (src) => {
  if (!src || typeof src !== "string") return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) return trimmed;
  if (trimmed.startsWith("/")) {
    return `${YEARBOOK_ORIGIN}${trimmed}`;
  }
  return `${YEARBOOK_ORIGIN}/${trimmed}`;
};

const blobToDataUri = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

/** react-pdf does not reliably paint WebP; convert to JPEG in the browser */
const convertBlobToJpegDataUri = (blob, maxDimension = PDF_SAFE_MAX_DIMENSION) =>
  new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("No document for image conversion"));
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        let w = img.naturalWidth || img.width || 1;
        let h = img.naturalHeight || img.height || 1;
        if (maxDimension && Math.max(w, h) > maxDimension) {
          const scale = maxDimension / Math.max(w, h);
          w = Math.max(1, Math.round(w * scale));
          h = Math.max(1, Math.round(h * scale));
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL("image/jpeg", PDF_SAFE_JPEG_QUALITY));
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image decode failed"));
    };
    img.src = objectUrl;
  });

const blobToPdfSafeDataUri = async (blob) => {
  const mime = String(blob?.type ?? "").toLowerCase();
  const needsConversion =
    typeof document !== "undefined" &&
    (mime.includes("webp") || mime.includes("png"));

  if (needsConversion) {
    try {
      return await convertBlobToJpegDataUri(blob);
    } catch {
      /* fall through to raw data URI */
    }
  }

  return blobToDataUri(blob);
};

const fetchImageBlob = async (url) => {
  const absolute = toAbsoluteUrl(url);
  if (!absolute) throw new Error("Invalid image URL");

  const controller = new AbortController();
  const abortTimer = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(absolute, {
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
    });
    if (response.ok) {
      const blob = await response.blob();
      if (blob?.size > 0) return blob;
    }
  } catch {
    /* try axios next */
  } finally {
    clearTimeout(abortTimer);
  }

  const response = await axios.get(absolute, {
    responseType: "blob",
    headers: authHeaders(),
    timeout: IMAGE_FETCH_TIMEOUT_MS,
    validateStatus: (status) => status === 200,
  });
  if (response.data?.size > 0) return response.data;
  throw new Error(`Image fetch failed for ${absolute}`);
};

const urlToDataUri = async (url) => {
  const blob = await fetchImageBlob(url);
  return blobToPdfSafeDataUri(blob);
};

/** Yearbook user id embedded in impression paths (`user_6923/...`) */
const yearbookIdFromImagePath = (path) => {
  const match = String(path ?? "").match(/user_(\d+)\//i);
  return match ? match[1] : null;
};

const fetchLocalAssetDataUri = async (assetUrl) => {
  const response = await fetch(assetUrl);
  if (!response.ok) throw new Error("Local asset fetch failed");
  const blob = await response.blob();
  return blobToPdfSafeDataUri(blob);
};

export const getDefaultProfileDataUri = async () => {
  if (cachedDefaultDataUri) return cachedDefaultDataUri;
  try {
    cachedDefaultDataUri = await fetchLocalAssetDataUri(defaultImg);
  } catch {
    cachedDefaultDataUri = defaultImg;
  }
  return cachedDefaultDataUri;
};

/** Data URI for a gallery slot default (img1–img4) */
export const getGalleryDefaultDataUri = async (key) => {
  if (!GALLERY_KEYS.includes(key)) {
    return getDefaultProfileDataUri();
  }
  if (!cachedGalleryDataUris) cachedGalleryDataUris = {};
  if (cachedGalleryDataUris[key]) return cachedGalleryDataUris[key];

  const asset = getGalleryDefaultSrc(key);
  try {
    cachedGalleryDataUris[key] = await fetchLocalAssetDataUri(asset);
  } catch {
    cachedGalleryDataUris[key] = asset;
  }
  return cachedGalleryDataUris[key];
};

const getAnonymousDataUri = async () => {
  if (cachedAnonymousDataUri) return cachedAnonymousDataUri;
  try {
    cachedAnonymousDataUri = await urlToDataUri(ANONYMOUS_AVATAR);
  } catch {
    cachedAnonymousDataUri = ANONYMOUS_AVATAR;
  }
  return cachedAnonymousDataUri;
};

const pickProfileImage = (profile) => {
  if (!profile || typeof profile !== "object") return null;
  const img =
    profile.profile_image ??
    profile.profile_pic ??
    profile.image ??
    profile.avatar;
  if (!img || typeof img !== "string" || !img.trim()) return null;
  return img.trim();
};

export const getAuthorUserId = (post) => {
  if (!post || post.is_anonymous) return null;

  const explicit =
    post.written_by_profile?.user ??
    post.written_by_id ??
    post.written_by_profile?.user_id ??
    (typeof post.written_by === "number" ? post.written_by : null);

  if (explicit != null && explicit !== "") return String(explicit);

  const fromPath = yearbookIdFromImagePath(
    pickProfileImage(post.written_by_profile)
  );
  if (fromPath) return fromPath;

  return null;
};

const profileKeys = (profile) => {
  if (!profile || typeof profile !== "object") return [];
  const keys = new Set();
  [profile.user, profile.user_id].forEach((k) => {
    if (k != null && k !== "") keys.add(String(k));
  });
  const fromPath = yearbookIdFromImagePath(pickProfileImage(profile));
  if (fromPath) keys.add(fromPath);
  return [...keys];
};

const personChunkKeys = [
  "smallerPosts",
  "smallPosts",
  "semiMediumPosts",
  "semiMediummPosts",
  "mediumPosts",
  "largePosts",
  "largeePosts",
  "largeeePosts",
  "largerPosts",
  "largerrPosts",
];

/** Visit every post object in finalData (same references used at render time) */
export const walkAllPosts = (data, fn) => {
  if (!data || typeof fn !== "function") return;

  if (Array.isArray(data.userPosts)) {
    data.userPosts.forEach((post) => {
      if (post?.content) fn(post);
    });
  }

  data.otherPeopleData?.forEach((person) => {
    personChunkKeys.forEach((key) => {
      flattenReviewPosts(person?.[key]).forEach((post) => {
        if (post?.content) fn(post);
      });
    });
  });
};

const uniqueUrls = (urls) => {
  const seen = new Set();
  const out = [];
  urls.forEach((url) => {
    const abs = toAbsoluteUrl(url);
    if (!abs || seen.has(abs)) return;
    seen.add(abs);
    out.push(abs);
  });
  return out;
};

const candidateUrlsForUser = (userId, primaryPath) => {
  const urls = [];

  PROFILE_EXT_CANDIDATES.forEach((ext) => {
    urls.push(`${IMPRESSION_BASE}/user_${userId}/profile.${ext}`);
  });

  if (primaryPath) urls.unshift(primaryPath);

  return uniqueUrls(urls);
};

const fetchProfileFromApi = async (userId) => {
  const response = await axios.get(
    `${YEARBOOK_ORIGIN}/api/authenticate/profile/${userId}`,
    { headers: authHeaders() }
  );
  return pickProfileImage(response.data);
};

const fetchUserProfileDataUri = async (userId, primaryPath, fallback) => {
  const urls = candidateUrlsForUser(userId, primaryPath);

  for (const url of urls) {
    try {
      const dataUri = await urlToDataUri(url);
      if (dataUri && String(dataUri).startsWith("data:")) return dataUri;
    } catch {
      /* try next candidate */
    }
  }

  try {
    const apiPath = await fetchProfileFromApi(userId);
    if (apiPath) {
      for (const url of candidateUrlsForUser(userId, apiPath)) {
        try {
          const dataUri = await urlToDataUri(url);
          if (dataUri && String(dataUri).startsWith("data:")) return dataUri;
        } catch {
          /* try next */
        }
      }
    }
  } catch (err) {
    console.warn(
      `Profile API lookup failed for user ${userId}:`,
      err?.message ?? err
    );
  }

  return fallback;
};

const mapWithConcurrency = async (items, limit, fn) => {
  if (!items.length) return [];
  const results = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await fn(items[index], index);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );
  return results;
};

/** Map user id -> absolute profile image URL from all fetched profiles */
export const buildProfileImageIndex = (data) => {
  const map = new Map();

  const register = (profile) => {
    const img = pickProfileImage(profile);
    if (!img) return;
    const absolute = toAbsoluteUrl(img);
    profileKeys(profile).forEach((key) => {
      if (!map.has(key)) map.set(key, absolute);
    });
  };

  data?.otherPeopleData?.forEach((person) => register(person?.profile));

  walkAllPosts(data, (post) => register(post?.written_by_profile));

  return map;
};

export const resolveProfileImageUrl = (post, profileIndex = null) => {
  if (post?.is_anonymous) return ANONYMOUS_AVATAR;

  const img = pickProfileImage(post?.written_by_profile);
  if (img) return toAbsoluteUrl(img);

  const userId = getAuthorUserId(post);
  if (userId) {
    const fromIndex = profileIndex?.get(userId);
    if (fromIndex) return fromIndex;
    return `${IMPRESSION_BASE}/user_${userId}/profile.png`;
  }

  return null;
};

const PROFILE_MEDIA_KEYS = ["profile_image", "img1", "img2", "img3", "img4"];

const candidateUrlsForMedia = (src) => {
  const abs = toAbsoluteUrl(src);
  if (!abs) return [];

  const urls = [abs];
  const impressionMatch = abs.match(
    /^(.*\/user_\d+\/)(img\d|profile)\.(\w+)(\?.*)?$/i
  );
  if (impressionMatch) {
    const [, base, name] = impressionMatch;
    PROFILE_EXT_CANDIDATES.forEach((ext) => {
      urls.push(`${base}${name}.${ext}`);
    });
  }
  return uniqueUrls(urls);
};

const embedProfileMediaKey = async (profile, key, fallback = null) => {
  const src = profile[key];
  if (!src || typeof src !== "string" || !src.trim()) {
    if (fallback) profile[key] = fallback;
    return;
  }
  if (src.startsWith("data:")) return;

  for (const url of candidateUrlsForMedia(src)) {
    try {
      const dataUri = await urlToDataUri(url);
      if (dataUri && String(dataUri).startsWith("data:")) {
        profile[key] = dataUri;
        return;
      }
    } catch {
      /* try next extension / URL */
    }
  }

  if (fallback) {
    profile[key] = fallback;
    return;
  }
  console.warn(`Profile media fetch failed for ${key}: no candidate URL worked`);
};

/** Fetch profile + gallery images as data URIs for react-pdf on the film profile page */
export const embedInitialProfileImages = async (profile) => {
  if (!profile || typeof profile !== "object") return profile;

  const profileFallback = await getDefaultProfileDataUri();
  const galleryFallbacks = await Promise.all(
    GALLERY_KEYS.map(async (key) => [key, await getGalleryDefaultDataUri(key)])
  );
  const galleryFallbackMap = Object.fromEntries(galleryFallbacks);

  await Promise.all(
    PROFILE_MEDIA_KEYS.map((key) =>
      embedProfileMediaKey(
        profile,
        key,
        key === "profile_image" ? profileFallback : galleryFallbackMap[key]
      )
    )
  );

  return profile;
};

/** Embed film-page media for each person in otherPeopleData */
export const embedOtherPeopleProfileImages = async (otherPeopleData) => {
  if (!Array.isArray(otherPeopleData)) return;
  await Promise.all(
    otherPeopleData.map((person) => embedInitialProfileImages(person?.profile))
  );
};

/** Embed profile photos as data URIs so @react-pdf/renderer can paint them */
export const hydrateReviewPostImages = async (data) => {
  if (!data) return data;

  const fallback = await getDefaultProfileDataUri();
  const profileIndex = buildProfileImageIndex(data);

  const userPrimaryPath = new Map();
  walkAllPosts(data, (post) => {
    if (post.is_anonymous) return;
    const userId = getAuthorUserId(post);
    if (!userId || userPrimaryPath.has(userId)) return;

    const fromPost = pickProfileImage(post.written_by_profile);
    const fromIndex = profileIndex.get(userId);
    userPrimaryPath.set(
      userId,
      fromPost ?? fromIndex ?? `${IMPRESSION_BASE}/user_${userId}/profile.png`
    );
  });

  data?.otherPeopleData?.forEach((person) => {
    const profile = person?.profile;
    if (!profile?.user) return;
    const userId = String(profile.user);
    if (userPrimaryPath.has(userId)) return;
    const img =
      pickProfileImage(profile) ??
      profileIndex.get(userId) ??
      `${IMPRESSION_BASE}/user_${userId}/profile.png`;
    userPrimaryPath.set(userId, img);
  });

  const userIds = [...userPrimaryPath.keys()];
  const userImageCache = new Map();

  await mapWithConcurrency(userIds, FETCH_CONCURRENCY, async (userId) => {
    const primaryPath = userPrimaryPath.get(userId);
    try {
      const dataUri = await fetchUserProfileDataUri(
        userId,
        primaryPath,
        fallback
      );
      userImageCache.set(userId, dataUri);
    } catch (err) {
      console.warn(
        `Review profile image failed for user ${userId}:`,
        err?.message ?? err
      );
      userImageCache.set(userId, fallback);
    }
  });

  walkAllPosts(data, (post) => {
    if (post.is_anonymous) {
      post.pdfProfileSrc = fallback;
      return;
    }

    const userId = getAuthorUserId(post);
    if (userId && userImageCache.has(userId)) {
      post.pdfProfileSrc = userImageCache.get(userId);
      return;
    }

    post.pdfProfileSrc = fallback;
  });

  if (Array.isArray(data.otherPeopleData)) {
    await mapWithConcurrency(data.otherPeopleData, FETCH_CONCURRENCY, async (person) => {
      const profile = person?.profile;
      if (!profile) return;
      const userId =
        profile.user != null
          ? String(profile.user)
          : yearbookIdFromImagePath(pickProfileImage(profile));
      if (!userId) return;

      if (userImageCache.has(userId)) {
        profile.pdfProfileSrc = userImageCache.get(userId);
        return;
      }

      const primaryPath =
        pickProfileImage(profile) ??
        `${IMPRESSION_BASE}/user_${userId}/profile.png`;
      try {
        profile.pdfProfileSrc = await fetchUserProfileDataUri(
          userId,
          primaryPath,
          fallback
        );
        userImageCache.set(userId, profile.pdfProfileSrc);
      } catch {
        profile.pdfProfileSrc = fallback;
      }
    });
  }

  return data;
};

export default hydrateReviewPostImages;
