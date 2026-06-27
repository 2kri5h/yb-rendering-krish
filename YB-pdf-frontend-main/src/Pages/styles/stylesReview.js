import { StyleSheet } from "@react-pdf/renderer";

const W = 595;

/** A4 height and space below baked-in title on reviewBG */
export const REVIEW_PAGE_HEIGHT = 842;
/** Horizontal page padding (must match stylesReview.page) */
export const REVIEW_PAGE_PADDING_X = 22;

/** Gap between Supporting Cast title area and first post row */
export const REVIEW_CONTENT_TOP = 122;
export const REVIEW_PAGE_PADDING_BOTTOM = 12;

/** Usable vertical space for post rows on a review page */
export const REVIEW_AVAILABLE_HEIGHT =
  REVIEW_PAGE_HEIGHT - REVIEW_CONTENT_TOP - REVIEW_PAGE_PADDING_BOTTOM;

/** Safety margin so the last row does not clip at page bottom */
export const REVIEW_PAGE_HEIGHT_BUFFER = 4;

/** Small fudge so estimates do not overshoot actual react-pdf layout */
const REVIEW_PAGINATION_SAFETY = 4;

/** Extra room when pulling the next post onto a page that has visible space left */
export const REVIEW_PACK_SLACK = 36;

/** Gap below the title before the first post (pagination + render) */
export const REVIEW_FIRST_ROW_MARGIN = 14;

/** Visual gap between consecutive post rows */
export const REVIEW_ROW_GAP = 14;

/** Extra clearance so quote marks (absolute, outside bubble) do not overlap */
export const REVIEW_QUOTE_CLEARANCE = 12;

export const getReviewRowSpacing = () =>
  REVIEW_ROW_GAP + REVIEW_QUOTE_CLEARANCE;

/** Unified square marquee frame — same size for every review post */
export const FRAME_SIZE = 76;

const FRAME_INSET_RATIO = 0.175;

/** Inset past the red bulb ring (~17.5% of asset width) */
const FRAME_INSET = Math.round(FRAME_SIZE * FRAME_INSET_RATIO);

export const FRAME_PHOTO_SIZE = FRAME_SIZE - FRAME_INSET * 2;
export const FRAME_PHOTO_OFFSET = FRAME_INSET;

const LIGHT_ASPECT = 1827 / 2480;
/** lightleft.png — beam apex ~37% down the left edge (mirror of lightright) */
const LIGHT_LEFT_ORIGIN_FRAC = 0.37;
/** lightright.png — beam apex ~37% down the right edge */
const LIGHT_RIGHT_ORIGIN_FRAC = 0.37;
export const REVIEW_LIGHT_OPACITY = 0.4;

/**
 * Per-frame spotlight: emerges flush from the page side, points at this frame’s upper corner.
 * @param {boolean} leftPost — true when the frame sits on the left of the row
 */
export const getReviewFrameStyles = (leftPost = true) => {
  const size = FRAME_SIZE;
  const inset = Math.round(size * FRAME_INSET_RATIO);
  const photoSize = size - inset * 2;
  const gap = FRAME_BUBBLE_GAP;
  const lightHeight = Math.round(size * 1.55);
  const lightWidth = Math.round(lightHeight * LIGHT_ASPECT);
  /** Align each light asset's beam origin (on its outer edge) with the frame top corner */
  const lightTopLeft = -Math.round(lightHeight * LIGHT_LEFT_ORIGIN_FRAC);
  const lightTopRight = -Math.round(lightHeight * LIGHT_RIGHT_ORIGIN_FRAC);
  /** Flush to page edge: cancel horizontal padding only (no extra gap) */
  const lightEdge = -REVIEW_PAGE_PADDING_X;

  return {
    profileColumn: {
      width: size,
      height: size,
      flexShrink: 0,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "visible",
    },
    profileColumnLeft: {
      marginRight: gap,
      alignItems: "flex-start",
    },
    profileColumnRight: {
      marginLeft: gap,
      alignItems: "flex-end",
    },
    lightLeft: {
      position: "absolute",
      top: lightTopLeft,
      left: lightEdge,
      width: lightWidth,
      height: lightHeight,
      objectFit: "contain",
      opacity: REVIEW_LIGHT_OPACITY,
    },
    lightRight: {
      position: "absolute",
      top: lightTopRight,
      right: lightEdge,
      width: lightWidth,
      height: lightHeight,
      objectFit: "contain",
      opacity: REVIEW_LIGHT_OPACITY,
    },
    /** Profile photo — flat sibling so react-pdf paints it (nested Views break Image) */
    marqueePhoto: {
      position: "absolute",
      top: inset,
      left: inset,
      width: photoSize,
      height: photoSize,
      objectFit: "cover",
    },
    marqueeFrameImg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: size,
      height: size,
    },
  };
};

/** Gap between frame and review box so the white border stays continuous */
export const FRAME_BUBBLE_GAP = 12;

/** Bubble chrome: padding + reviewer line (quotes are absolute, outside flow) */
const REVIEW_BUBBLE_CHROME = 12 + 8 + 4 + 12;

/** Quote PNG assets — height sets vertical centering on the 2pt border */
export const QUOTE_MARK_IMAGE_HEIGHT = 18;
export const QUOTE_MARK_IMAGE_WIDTH = 22;
/** Half above/outside the border, half inside (border line through image center) */
const QUOTE_ON_BORDER = QUOTE_MARK_IMAGE_HEIGHT / 2;

/** Flatten nested pair chunks from smallerPosts into a list of post objects */
export const flattenReviewPosts = (posts) => {
  if (!Array.isArray(posts)) return [];
  const flat = [];
  const walk = (items) => {
    items.forEach((item) => {
      if (!item) return;
      if (Array.isArray(item)) {
        walk(item);
        return;
      }
      if (typeof item === "object" && "content" in item) {
        flat.push(item);
      }
    });
  };
  walk(posts);
  return flat;
};

/** Pick font size from length — full post text is always kept (no truncation). */
export const formatReviewForPdf = (content) => {
  const text = String(content ?? "").trim();
  const len = text.length;
  let fontSize = 9.5;

  if (len > 1700) fontSize = 7;
  else if (len > 1000) fontSize = 7.5;
  else if (len > 700) fontSize = 8;
  else if (len > 450) fontSize = 8.5;
  else if (len > 280) fontSize = 9;

  return { text, fontSize };
};

const bubbleInnerWidth = () =>
  W - REVIEW_PAGE_PADDING_X * 2 - FRAME_SIZE - FRAME_BUBBLE_GAP - 8;

const charsPerLineFor = (fontSize) =>
  Math.max(24, Math.floor(bubbleInnerWidth() / (fontSize * 0.48)));

const lineMetrics = (text, fontSize) => {
  const charsPerLine = charsPerLineFor(fontSize);
  const lines = Math.max(1, Math.ceil(text.length / charsPerLine));
  const lineH = fontSize * 1.5;
  const contentH = lines * lineH;
  const bubbleH = REVIEW_BUBBLE_CHROME + contentH + QUOTE_ON_BORDER;
  return { lines, contentH, bubbleH, charsPerLine };
};

export const countReviewLines = (post) => {
  const { text, fontSize } = formatReviewForPdf(post?.content);
  return lineMetrics(text, fontSize).lines;
};

const rowSpacingAfter = () => getReviewRowSpacing();

const sumPageHeight = (page) => {
  if (!page?.length) return 0;
  let sum = REVIEW_FIRST_ROW_MARGIN;
  page.forEach((post, index) => {
    if (index > 0) sum += rowSpacingAfter();
    sum += estimateReviewRowBody(post);
  });
  return sum;
};

/** Body height for one post row — bubble, frame; no inter-row gap */
export const estimateReviewRowBody = (post) => {
  const { text, fontSize } = formatReviewForPdf(post?.content);
  const { bubbleH } = lineMetrics(text, fontSize);
  return Math.max(FRAME_SIZE, bubbleH);
};

/** Full row slot used for pagination (body + gap below, except last row on page) */
export const estimateReviewRowHeight = (post) =>
  estimateReviewRowBody(post) + rowSpacingAfter(post);

const pageHasRoomFor = (page, post, maxHeight) => {
  if (!page?.length) {
    return REVIEW_FIRST_ROW_MARGIN + estimateReviewRowBody(post) <= maxHeight;
  }
  return (
    sumPageHeight(page) +
      rowSpacingAfter() +
      estimateReviewRowBody(post) <=
    maxHeight
  );
};

const pageMaxHeight = () =>
  REVIEW_AVAILABLE_HEIGHT - REVIEW_PAGE_HEIGHT_BUFFER - REVIEW_PAGINATION_SAFETY;

/** Pull fitting posts from the next page when visible space remains */
const densifyReviewPages = (pages, maxHeight) => {
  const result = pages.map((page) => [...page]);
  const budget = maxHeight + REVIEW_PACK_SLACK;

  for (let pageIdx = 0; pageIdx < result.length - 1; pageIdx += 1) {
    let moved = true;
    while (moved && result[pageIdx + 1]?.length > 0) {
      moved = false;
      const nextPost = result[pageIdx + 1][0];
      if (pageHasRoomFor(result[pageIdx], nextPost, budget)) {
        result[pageIdx].push(result[pageIdx + 1].shift());
        moved = true;
      }
    }

    if (result[pageIdx + 1]?.length === 0) {
      result.splice(pageIdx + 1, 1);
      pageIdx -= 1;
    }
  }

  return result.filter((page) => page.length > 0);
};

/**
 * Pack posts into full-A4 pages using available height (no row splits).
 * Accepts nested chunks or a flat post array.
 */
export const paginateReviewPosts = (posts) => {
  const flat = flattenReviewPosts(posts).filter((p) =>
    String(p?.content ?? "").trim()
  );

  if (!flat.length) return [];

  const maxHeight = pageMaxHeight();
  const pages = [];
  let current = [];

  for (const post of flat) {
    const trial = [...current, post];
    if (current.length === 0 || sumPageHeight(trial) <= maxHeight) {
      current = trial;
      continue;
    }
    pages.push(current);
    current = [post];
  }

  if (current.length) pages.push(current);

  return densifyReviewPages(pages, maxHeight);
};

/** Flatten tier chunks (from postChunkUtils) then pack into pages */
export const paginateReviewPostGroups = (postGroups) => {
  const allPosts = (postGroups ?? []).flatMap((group) =>
    flattenReviewPosts(group)
  );
  return paginateReviewPosts(allPosts);
};

export const stylesReview = StyleSheet.create({
  backgroundImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: W,
    height: 842,
    objectFit: "cover",
  },

  page: {
    width: W,
    height: REVIEW_PAGE_HEIGHT,
    backgroundColor: "transparent",
  },

  pageContainer: {
    position: "relative",
    width: W,
    height: REVIEW_PAGE_HEIGHT,
    flexDirection: "column",
  },

  reviewPageBody: {
    flexDirection: "column",
    width: W,
    minHeight: REVIEW_PAGE_HEIGHT,
    paddingTop: REVIEW_CONTENT_TOP,
    paddingHorizontal: REVIEW_PAGE_PADDING_X,
    paddingBottom: REVIEW_PAGE_PADDING_BOTTOM,
    justifyContent: "flex-start",
  },

  postRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },

  postRowReverse: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },

  postRowLayer: {
    position: "relative",
    width: "100%",
    overflow: "visible",
    flexShrink: 0,
  },

  /** Extra clearance below the baked-in title for the first row on each page */
  postRowFirst: {
    marginTop: 0,
  },

  profileColumn: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  profileColumnLeft: {
    marginRight: FRAME_BUBBLE_GAP,
    alignItems: "flex-start",
  },

  profileColumnRight: {
    marginLeft: FRAME_BUBBLE_GAP,
    alignItems: "flex-end",
  },

  marqueeFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: "relative",
    overflow: "hidden",
  },

  marqueeFrameImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },

  marqueePhoto: {
    position: "absolute",
    top: FRAME_PHOTO_OFFSET,
    left: FRAME_PHOTO_OFFSET,
    width: FRAME_PHOTO_SIZE,
    height: FRAME_PHOTO_SIZE,
    objectFit: "cover",
  },

  bubbleColumn: {
    flex: 1,
    paddingHorizontal: 4,
    minWidth: 0,
    justifyContent: "center",
    alignSelf: "center",
    overflow: "visible",
  },

  reviewBubble: {
    flexDirection: "column",
    width: "100%",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 20,
    backgroundColor: "#000000",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
    position: "relative",
    alignSelf: "stretch",
    overflow: "visible",
  },

  quoteMarkOpen: {
    position: "absolute",
    top: -QUOTE_ON_BORDER,
    left: 12,
    width: QUOTE_MARK_IMAGE_WIDTH,
    height: QUOTE_MARK_IMAGE_HEIGHT,
    objectFit: "contain",
  },

  quoteMarkClose: {
    position: "absolute",
    bottom: -QUOTE_ON_BORDER,
    right: 12,
    width: QUOTE_MARK_IMAGE_WIDTH,
    height: QUOTE_MARK_IMAGE_HEIGHT,
    objectFit: "contain",
  },

  contentArea: {
    width: "100%",
    marginTop: 2,
    marginBottom: 4,
    paddingHorizontal: 4,
    paddingBottom: 3,
  },

  content: {
    fontFamily: "Gentium Book Basic",
    fontWeight: 400,
    fontStyle: "normal",
    color: "#FFFFFF",
    textAlign: "left",
    lineHeight: 1.48,
  },

  reviewerFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 0,
    paddingRight: 24,
    paddingBottom: 2,
    marginTop: 4,
  },

  reviewerName: {
    fontSize: 8.5,
    fontFamily: "Gentium Book Basic",
    fontWeight: 400,
    fontStyle: "italic",
    color: "#FFFFFF",
    textAlign: "right",
  },

  verified: {
    width: 9,
    height: 9,
    marginLeft: 3,
  },
});

export default stylesReview;
