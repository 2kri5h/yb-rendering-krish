import { StyleSheet } from "@react-pdf/renderer";

const W = 595;
const H = 842;

const px = (pct) => W * pct;
const py = (pct) => H * pct;

/** header.png — 7440×753 */
const HEADER_ASPECT = 753 / 7440;
export const HEADER_H = Math.round(W * HEADER_ASPECT);

/** profilelight.png — removed from profile page layout */
export const PROFILE_SIZE = 210;

const FRAME_W = 198;
const FRAME_H = 140;
const FRAME_INSET_X = 26;
const FRAME_INSET_Y = 16;
const GALLERY_GAP = 168;
export const GALLERY_CLUSTER_W = FRAME_W * 2 + GALLERY_GAP;
export const GALLERY_CLUSTER_H = Math.round(FRAME_H * 2.12);

const framePos = (left, top) => ({
  position: "absolute",
  left,
  top,
  width: FRAME_W,
  height: FRAME_H,
});

const stylesFilm = StyleSheet.create({
  page: {
    width: W,
    height: H,
    backgroundColor: "#1A1A1A",
  },

  pageContainer: {
    width: W,
    height: H,
    position: "relative",
    overflow: "hidden",
  },

  backgroundImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: W,
    height: H,
    objectFit: "cover",
  },

  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: W,
    height: HEADER_H,
    objectFit: "cover",
  },
  profileSpotlight: {
    position: "absolute",
    top: HEADER_H + py(0.052),
    left: (W - PROFILE_SIZE) / 2,
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
  },

  profileRing: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    overflow: "hidden",
  },

  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    objectFit: "cover",
  },

  centerDetails: {
    position: "absolute",
    top: HEADER_H + py(0.368),
    left: px(0.05),
    right: px(0.05),
    alignItems: "center",
  },

  leftDetails: {
    position: "absolute",
    left: px(0.07),
    top: HEADER_H + py(0.188),
    maxWidth: 140,
  },

  rightDetails: {
    position: "absolute",
    right: px(0.07),
    top: HEADER_H + py(0.188),
    alignItems: "flex-end",
    maxWidth: 140,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Headlines",
    fontWeight: "700",
    lineHeight: 1.25,
  },

  redText: {
    color: "#F0C24A",
    fontSize: 22,
    fontFamily: "Gentium Book Basic",
    fontWeight: "700",
    lineHeight: 1.35,
  },

  /** Constrains long values (e.g. department) so they wrap before the profile ring */
  detailValueWrap: {
    maxWidth: 140,
  },

  detailValueWrapRight: {
    maxWidth: 140,
    textAlign: "right",
  },

  centerLine: {
    textAlign: "center",
    marginBottom: 5,
  },

  centerRedInline: {
    color: "#F0C24A",
    fontSize: 22,
    fontFamily: "Gentium Book Basic",
    fontWeight: "700",
    lineHeight: 1.35,
  },

  galleryCluster: {
    position: "absolute",
    top: py(0.532),
    left: (W - GALLERY_CLUSTER_W) / 2,
    width: GALLERY_CLUSTER_W,
    height: GALLERY_CLUSTER_H,
  },

  galleryFrameTop: framePos((GALLERY_CLUSTER_W - FRAME_W) / 2, 0),

  galleryFrameLeft: framePos(0, FRAME_H * 0.62),

  galleryFrameRight: framePos(GALLERY_CLUSTER_W - FRAME_W, FRAME_H * 0.62),

  galleryFrameBottom: framePos(
    (GALLERY_CLUSTER_W - FRAME_W) / 2,
    FRAME_H * 1.12
  ),

  frameContainer: {
    width: FRAME_W,
    height: FRAME_H,
    position: "relative",
  },

  frame: {
    position: "absolute",
    top: (FRAME_H - FRAME_W) / 2,
    left: (FRAME_W - FRAME_H) / 2,
    width: FRAME_H,
    height: FRAME_W,
    objectFit: "contain",
    transform: "rotate(90deg)",
  },

  galleryImage: {
    position: "absolute",
    top: FRAME_INSET_Y,
    left: FRAME_INSET_X,
    width: FRAME_W - FRAME_INSET_X * 2,
    height: FRAME_H - FRAME_INSET_Y * 2,
    objectFit: "cover",
  },

  quoteContainer: {
    position: "absolute",
    bottom: py(0.034),
    left: px(0.03),
    right: px(0.03),
    alignItems: "center",
    justifyContent: "center",
  },

  quoteTextScript: {
    fontFamily: "Monotype Corsiva",
    color: "#F0C24A",
    textAlign: "center",
    lineHeight: 1.05,
  },

  quoteTextXL: {
    fontSize: 44,
  },

  quoteTextLarge: {
    fontSize: 30,
  },
});

export default stylesFilm;
