import { StyleSheet } from "@react-pdf/renderer";

const stylesCensor = StyleSheet.create({

  page: {
    backgroundColor: '#f5e6c8',
  },

  wrapper: {
    width: 595,
    height: 842,
    position: 'relative',
  },

  backgroundImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 595,
    height: 842,
  },

  // Normal flow — sits on top of absolute background naturally
  content: {
    width: 590,
    height: 842,
    paddingHorizontal: 65,
    paddingTop: 40,
    paddingBottom: 40,
    flexDirection: 'column',
  },

  // ── CENTRAL BOARD OF CAMPUS CHRONICLES ───────────────
  // Target: big bold stamp font filling ~15% of page = ~126pt tall block
  // fontSize ~38pt gives 2 lines × 38 × 1.02 ≈ 78pt — close enough
  title: {
    fontFamily: 'Prevalent',
    fontSize: 55,
    fontWeight: '400',
    textAlign: 'center',
    color: '#000000',
    lineHeight: 1.02,
    letterSpacing: -0.8,
    marginBottom: 23,
  },

  // ── DEPARTMENT subtitle ───────────────────────────────
  // Target: small condensed caps ~1 line
  subtitle: {
    fontFamily: 'Bebas Neue',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: '#000000',
    lineHeight: 1,
    letterSpacing: -0.5,
    marginBottom: 18,
  },

  // ── CATEGORY ROW ─────────────────────────────────────
  categoryRow: {
    fontSize: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },

  // Target: medium bold caps on both ends of the row
  categoryText: {
    fontFamily: 'Bebas Neue',
    fontSize: 18,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 1,
  },

  // ── QUOTE ─────────────────────────────────────────────
  // Target: large italic body text filling ~30% of page ≈ 252pt
  // 6 lines × fontSize × lineHeight = 252 → fontSize ≈ 252/(6×1.07) ≈ 39
  // But we must stay readable, so ~15pt with generous lineHeight works
  quote: {
    fontFamily: 'Monotype Corsiva',
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 1.07,
    textAlign: 'left',
    padding: 12,
    marginBottom: 24,
  },

  // ── DETAILS SECTION ───────────────────────────────────
  detailsSection: {
    flexDirection: 'column',
    paddingLeft: 25,
    marginBottom:'auto' ,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    marginBottom: 6,
  },

  // Target: bold condensed label — "FILM TITLE:", "LANGUAGE:" etc.
  detailLabel: {
    fontFamily: 'Kirsty',
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 1.37,
    marginRight: 2,
    flexShrink: 0,
  },

  // Target: underlined value text — wider, slightly lighter font
  detailValue: {
    fontFamily: 'Coda',
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 1.37,
    textDecoration: 'underline',
    flex: 1,
  },
  detailValueNoWrap: {
    fontFamily: 'Coda',
    fontSize: 12.5,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 1.37,
    textDecoration: 'underline',
    flex: 1,
  },
  // ── WRITTEN BY — bottom centered like image 2 ────────────
  writtenByContainer: {
    marginTop: 'auto',           // pushes to bottom of content
    paddingTop: 14,
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  writtenByTitle: {
    fontFamily: 'Kirsty',
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'left',
    letterSpacing: 0.5,
    marginBottom: 0,
    lineHeight: 1.05,
  },
  writtenByValue: {
    fontFamily: 'Coda',
    fontSize: 15,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'right',
    letterSpacing: 0.3,
    lineHeight: 1.05,
  },
});

export default stylesCensor;