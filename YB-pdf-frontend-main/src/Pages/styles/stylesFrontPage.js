// ─── stylesFrontPage.js ─────────────────────────────────────────────────────
// Positions pixel-verified by drawing marker boxes on the source BG image
// (5655 × 8000 px) and confirming each box lands inside its clapperboard cell.
// Then cross-checked against actual rendered screenshot (663 × 931 px).
//
// TAKE cell     → "2021-2026"              — ChalkChalk font
// TICKET ID     → email.split("@")[0]      — ChalkEiz font
// LEAD CHAR     → profile.name             — ChalkEiz font

import { StyleSheet } from "@react-pdf/renderer";

const W = 595;
const H = 842;

const px = (pct) => W * pct;
const py = (pct) => H * pct;

const stylesFrontPage = StyleSheet.create({

  page: {
    width:           W,
    height:          H,
    backgroundColor: "#F5A623",
  },

  pageContainer: {
    position: "relative",
    width:    W,
    height:   H,
  },

  bg: {
    position: "absolute",
    top:      0,
    left:     0,
    width:    W,
    height:   H,
  },

  // ── TAKE value "2021-2026" ────────────────────────────────────────────────
  // Cell: right column, top data row — below "Take" label, above divider
  // Verified: green box sits cleanly inside Take cell in source image
  // Source px: (3668, 5027) → A4: left=385.9pt top=529.1pt
  takeValue: {
    position:      "absolute",
    left:          px(0.580),    // align closer to the take cell center
    top:           py(0.580),    // keep the text inside the top row
    width:         px(0.255),    // enough room for the year range
    height:        py(0.032),
    justifyContent: "center",
    transform:     "rotate(-3deg)",
    fontFamily:    "ChalkChalk",
    fontSize:      22,
    color:         "#FFFFFF",
    textAlign:     "center",
    letterSpacing: 0.2,
  },

  takeText: {
    fontFamily: "ChalkChalk",
    fontSize: 22,
    lineHeight: 1,
    color: "#FFFFFF",
    textAlign: "center",
    transform: "rotate(-3deg)",
  },

  // ── TICKET ID value (roll/ldap = email prefix) ────────────────────────────
  // Cell: right column, below "Ticket ID" label
  // Verified: green box sits inside Ticket ID cell (between label and next divider)
  // Source px: (3668, 5500) → A4: left=385.9pt top=578.9pt
  // DATA: profile.email.split("@")[0]  e.g. "21b030054" → shown as "21B030054"
  ticketValue: {
    position:   "absolute",
    left:       px(0.561),    // shift slightly left to align with the label block
    top:        py(0.694),    // sit cleanly inside the row
    width:      px(0.225),    // leave room for the roll number
    height:     py(0.03),
    justifyContent: "center",
    transform:  "rotate(-3deg)",
    fontFamily: "ChalkEiz",
    fontSize:   20,
    color:      "#FFFFFF",
    textAlign:  "center",
  },

  ticketText: {
    fontFamily: "ChalkEiz",
    fontSize: 20,
    lineHeight: 1,
    color: "#FFFFFF",
    textAlign: "center",
    transform: "rotate(-3deg)",
  },

  /** ChalkEiz lacks digit glyphs — use ChalkChalk for numeric runs */
  ticketDigitText: {
    fontFamily: "ChalkChalk",
    fontSize: 20,
    lineHeight: 1,
    color: "#FFFFFF",
    textAlign: "center",
    transform: "rotate(-3deg)",
  },

  // ── LEAD CHARACTER value (student name) ──────────────────────────────────
  // Row: bottom row of clapperboard, immediately after "Lead Character" label
  // Verified: green box sits on the Lead Character row after the label text
  // Source px: (1382, 6462) → A4: left=145.4pt top=680.1pt
  leadValue: {
    position:   "absolute",
    left:       px(0.262),    // keep the name after the label text
    top:        py(0.762),    // stay centered in the bottom row
    width:      px(0.47),     // space for the full name
    height:     py(0.03),
    justifyContent: "center",
    transform:  "rotate(-3deg)",
    fontFamily: "ChalkEiz",
    fontSize:   18,
    color:      "#FFFFFF",
    textAlign:  "left",
  },

  leadText: {
    fontFamily: "ChalkEiz",
    fontSize: 18,
    lineHeight: 1,
    color: "#FFFFFF",
    textAlign: "left",
    transform: "rotate(-3deg)",
  },

});

export default stylesFrontPage;