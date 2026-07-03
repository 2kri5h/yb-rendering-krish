import React from "react";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  Font,
} from "@react-pdf/renderer";
import { styles } from "./styles/PDFStyles.js";
import { stylesProfile } from "./styles/profileStyle.js";
import { stylesSigningOff } from "./styles/signingOffStyle.js";
import stylesCensor from "./styles/stylesCensor";
import stylesFilm from "./styles/stylesFilm";
import profileBG from "./assets/profileBG.jpg";
import profileHeader from "./assets/header_optimized.png";
import film_frame from "./assets/frame.png";
import censorBg from './assets/censorCerticateBG.png';
import background from "./assets/background.jpg";
import writeForYourself from "./assets/write.jpg";

// import front1 from "/assets/front/1.png";
// import front2 from "/assets/front/2.png";
// import front3 from "/assets/front/3.png";
// import front4 from "/assets/front/4.png";
// import front5 from "/assets/front/5.png";
// import front6 from "/assets/front/6.png";
// import front7 from "/assets/front/7.png";
// import front8 from "/assets/front/8.png";
// import front9 from "/assets/front/9.png";
// import front10 from "/assets/front/10.png";
// import front11 from "/assets/front/11.png";
// import front12 from "/assets/front/12.png";
// import front13 from "/assets/front/13.png";
// import front14 from "/assets/front/14.png";
// import front15 from "/assets/front/15.png";

// import frontcommon1 from "./assets/front/Common_snaps/1.png"
// import frontcommon2 from "./assets/front/Common_snaps/2.png"
// import frontcommon3 from "./assets/front/Common_snaps/3.jpg"
// import frontcommon4 from "./assets/front/Common_snaps/4.png"
// import frontcommon5 from "./assets/front/Common_snaps/5.png"
// import frontcommon6 from "./assets/front/Common_snaps/6.png"

import Comic from "./Fonts/Comic/ComicNeue-Regular.ttf";
import ComicBold from "./Fonts/Comic/ComicNeue-BoldItalic.ttf";
import ComicItalic from "./Fonts/Comic/ComicNeue-Italic.ttf";
import Roboto from "./Fonts/Roboto/Roboto-Regular.ttf";
import RobotoBold from "./Fonts/Roboto/Roboto-Bold.ttf";
import RobotoItalic from "./Fonts/Roboto/Roboto-Italic.ttf";
import lobster from "./Fonts/Roboto_Slab/static/RobotoSlab-Medium.ttf";
import fontFile from "./Fonts/Roboto_Slab/static/RobotoSlab-Medium.ttf";
import bebasneue from "./Fonts/Bebas_Neue/BebasNeue-Regular.ttf";
import prevalentFont from "./Fonts/prevalent/Prevalent Demo.otf";
import emblemaOne from "./Fonts/Emblema_One/EmblemaOne-Regular.ttf";
import kirsty from "./Fonts/kirsty/Kirsty Rg.otf";
import codaRegular from "./Fonts/Coda/Coda-Regular.ttf";
import monotypeCorsiva from "./Fonts/monotype-corsiva-bold/monotype-corsiva-bold.otf";
import myriad from "./Fonts/myriad-pro/MYRIADPRO-REGULAR.OTF";
import yb_logo from "./assets/yb_logo.png";
import bg from "./assets/bg.png";
import FranklinGothicMedium from "./Fonts/Franklin Gothic Medium Regular/Franklin Gothic Medium Regular.ttf";
// ── NEW: Halant & Gentium Book Plus (this year's film theme fonts) ──────────
import HeadlinesBold from "./Fonts/headlines/Headlines-Bold.otf";
import HeadlinesBoldItalic from "./Fonts/headlines/Headlines-BoldItalic.otf";
import HalantRegular from "./Fonts/Halant/Halant-Regular.ttf";
import HalantBold from "./Fonts/Halant/Halant-Bold.ttf";
import GentiumRegular from "./Fonts/Gentium_Book_Plus/GentiumBookPlus-Regular.ttf";
import GentiumBold from "./Fonts/Gentium_Book_Plus/GentiumBookPlus-Bold.ttf";
import GentiumItalic from "./Fonts/Gentium_Book_Plus/GentiumBookPlus-Italic.ttf";
import GentiumBoldItalic from "./Fonts/Gentium_Book_Plus/GentiumBookPlus-BoldItalic.ttf";
import daughter_of_fortune from "./Fonts/daughter_of_fortune/Daughter of Fortune.ttf";
import frontPageBG    from "./assets/frontPageBG.jpg";
import ChalkChalkFont from "./Fonts/chalkchalk/Chalkchalk-Regular.ttf";
import ChalkEizFont   from "./Fonts/chalkiez/Chalkiez-Regular.ttf";
import stylesFrontPage from "./styles/stylesFrontPage";
import { resolveGalleryImageSrc } from "./galleryDefaults.js";

// A4 page dimensions in points
const W = 595;
const H = 842;
 
// Percentage-based position helpers
const px = (pct) => W * pct;
const py = (pct) => H * pct;

// ── Font registrations ───────────────────────────────────────────────────────
Font.register({
  family: "Headlines",
  fonts: [
    { src: HeadlinesBold, fontWeight: 700 },
    { src: HeadlinesBoldItalic, fontStyle: "italic", fontWeight: 700 },
  ],
});
Font.register({
  family: "Halant",
  fonts: [
    { src: HalantRegular, fontWeight: 400 },
    { src: HalantBold, fontWeight: 700 },
  ],
});
 
Font.register({
  family: "Gentium Book Basic",
  fonts: [
    { src: GentiumRegular, fontWeight: 400 },
    { src: GentiumBold, fontWeight: 700 },
    { src: GentiumItalic, fontStyle: "italic", fontWeight: 400 },
    { src: GentiumBoldItalic, fontStyle: "italic", fontWeight: 700 },
  ],
});
Font.register({ family: "Daughter of Fortune", src: daughter_of_fortune });
Font.register({ family: "Prevalent", src: prevalentFont });
Font.register({ family: "Bebas Neue", src: bebasneue });
Font.register({ family: "Emblema One", src: emblemaOne });
Font.register({ family: "Kirsty", src: kirsty });
Font.register({ family: "Coda", src: codaRegular });
Font.register({ family: "Monotype Corsiva", src: monotypeCorsiva });
Font.register({ family: "ChalkChalk", src: ChalkChalkFont });
Font.register({ family: "ChalkEiz",   src: ChalkEizFont   });
Font.register({
  family: "Comic",
  fonts: [
    { src: Comic },
    { src: ComicBold, fontStyle: "italic", fontWeight: 700 },
    { src: ComicItalic, fontStyle: "italic", fontWeight: 400 },
  ],
});

Font.register({
  family: "Roboto",
  fonts: [
    { src: Roboto },
    { src: RobotoBold, fontStyle: "normal", fontWeight: 700 },
    { src: RobotoItalic, fontStyle: "italic", fontWeight: 400 },
  ],
});

Font.register({ family: "Lobster", src: fontFile });
Font.register({ family: "bebasneue", src: bebasneue });
Font.register({ family: "myriad", src: myriad });
Font.register({ family: "FranklinGothicMedium", src: FranklinGothicMedium });

Font.registerEmojiSource({
  format: "png",
  url: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/72x72/",
  withVariationSelectors: true,
});

Font.register({ family: "LobsterFont", src: lobster });

// ── Helpers ──────────────────────────────────────────────────────────────────
const isMale = (gender) => {
  const g = String(gender ?? "").toLowerCase();
  return g === "male" || g === "m";
};

const isFemale = (gender) => {
  const g = String(gender ?? "").toLowerCase();
  return g === "female" || g === "f";
};

const getLeadRoleLabel = (gender) => {
  if (isMale(gender)) return "Lead Actor ";
  if (isFemale(gender)) return "Lead Actress ";
  return "Lead ";
};

const MALE_TAGLINE = "Kabhi kabhi lgta hai apun hi bhagwan hai";
const FEMALE_TAGLINE = "Mai apni favorite hu";

const getProfileTagline = (profile) =>
  isMale(profile?.gender) ? MALE_TAGLINE : FEMALE_TAGLINE;

const getTaglineStyles = (profile) => {
  const text = getProfileTagline(profile);
  const sizeStyle =
    text.length > 38 ? stylesFilm.quoteTextLarge : stylesFilm.quoteTextXL;
  return [stylesFilm.quoteTextScript, sizeStyle];
};

const formatHostel = (hostel) =>
  hostel?.toLowerCase() === "qip"
    ? "QIP"
    : hostel
        ?.replace("hostel_", "Hostel ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

const renderGalleryFrame = (profile, imgKey, frameStyle) => (
  <View style={[stylesFilm.frameContainer, frameStyle]}>
    <Image src={film_frame} style={stylesFilm.frame} />
    <Image
      src={resolveGalleryImageSrc(profile, imgKey)}
      style={stylesFilm.galleryImage}
    />
  </View>
);

const renderTicketId = (email) => {
  const roll = email.split("@")[0].toUpperCase();
  const parts = roll.split(/(\d+)/).filter(Boolean);
  return parts.map((part, index) =>
    /^\d+$/.test(part) ? (
      <Text key={`d-${index}`} style={stylesFrontPage.ticketDigitText}>
        {part}
      </Text>
    ) : (
      <Text key={`l-${index}`} style={stylesFrontPage.ticketText}>
        {part}
      </Text>
    )
  );
};
 
const InitialPages = ({ profile }) => {
  function formatDate(dob) {
    const date = new Date(dob);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <Document>
      <>
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image 
            src="/assets/front/P1.jpg" 
            style={stylesSigningOff.backgroundImg} />
          </View>
        </Page> 

        {/* ###### front page the opening sequence##### */}
        {!!profile && (
  <Page size="A4" style={stylesFrontPage.page} wrap={false}>
    <View style={stylesFrontPage.pageContainer}>
 
      {/* ── BACKGROUND IMAGE (full bleed, all static art baked in) ── */}
      <Image src={frontPageBG} style={stylesFrontPage.bg} />
 
      {/* ── TAKE: "2021-2026" — ChalkChalk, right cell top row ──────
            Position: right ~33% of page, ~63% down.
            The BG already has the "Take" label; we just drop the value. */}
      {!!(profile.join_year || profile.graduation_year) && (
        <View style={stylesFrontPage.takeValue}>
          <Text style={stylesFrontPage.takeText}>
            {profile.join_year}-{profile.graduation_year}
          </Text>
        </View>
      )}

      {/* ── TICKET ID: roll number (email prefix) — ChalkEiz, right column ─ */}
      {!!profile.email && (
        <View style={stylesFrontPage.ticketValue}>
          <Text style={stylesFrontPage.ticketText}>
            {renderTicketId(profile.email)}
          </Text>
        </View>
      )}

      {/* ── LEAD CHARACTER: student name — ChalkEiz, bottom-left row ─ */}
      {!!profile.name && (
        <View style={stylesFrontPage.leadValue}>
          <Text style={stylesFrontPage.leadText}>{profile.name}</Text>
        </View>
      )}
 
    </View>
  </Page>
)}


        {/* #####the censor certificate page###### */}
        {/* Censor Certificate Page */}
<Page size="A4" style={stylesCensor.page} wrap={false}>
  <View style={stylesCensor.wrapper}>
    <Image src={censorBg} style={stylesCensor.backgroundImg} />
    <View style={stylesCensor.content}>
      {/* Title */}
      <Text style={stylesCensor.title}>CENTRAL BOARD OF{"\n"}CAMPUS CHRONICLES</Text>

      {/* Department subtitle */}
      <Text style={stylesCensor.subtitle}>
        DEPARTMENT OF ALUMNI & CORPORATE RELATIONS/DIRECTORATE OF ETERNAL LEGACIES
      </Text>

      {/* Category / UA Row */}
      <View style={stylesCensor.categoryRow}>
        <Text style={stylesCensor.categoryText}>CATEGORY: IIT/B</Text>
        <Text style={stylesCensor.categoryText}>U/A: UNSTOPPABLE & ACCOMPLISHED</Text>
      </View>

      {/* Quote */}
      <Text style={stylesCensor.quote}>
        {`"This is to certify that the Batch of ${profile?.graduation_year ?? "2026"} has successfully cleared all 'Censored' hurdles and 'Uncensored' late-night adventures. The board finds this batch suitable for global exhibition, noting that while the technical CGPA may vary, the Emotional Quotient and Friendship Quotient are officially off the charts."`}
      </Text>

      {/* Film Details */}
      <View style={stylesCensor.detailsSection}>
        <View style={stylesCensor.detailRow}>
          <Text style={stylesCensor.detailLabel}>FILM TITLE: </Text>
          <Text style={stylesCensor.detailValue}>
            {`The Batch of ${profile?.graduation_year ?? "2026"}: A ${
            (() => {
            const num = profile?.graduation_year && profile?.join_year
            ? profile.graduation_year - profile.join_year
            : 5;
            const words = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
            return num <= 10 ? words[num] : num;
            })()
            }-Year Saga`}
          </Text>
        </View>

        <View style={stylesCensor.detailRow}>
          <Text style={stylesCensor.detailLabel}>LANGUAGE: </Text>
          <Text style={stylesCensor.detailValue}>Hinglish (Fluent in Sarcasm & Late-night Rants)</Text>
        </View>

        <View style={stylesCensor.detailRow}>
          <Text style={stylesCensor.detailLabel}>DIRECTOR: </Text>
          <Text style={stylesCensor.detailValue}>
            {`Dean of Alumni & Corporate Relations`}
          </Text>
        </View>

        <View style={stylesCensor.detailRow}>
          <Text style={stylesCensor.detailLabel}>CERTIFICATE NO: </Text>
          <Text style={stylesCensor.detailValueNoWrap} wrap={false}>
            {`IITB/Final Cut/${profile?.graduation_year ?? "2026"}/Legends`}
          </Text>
        </View>

        <View style={stylesCensor.detailRow}>
          <Text style={stylesCensor.detailLabel}>DURATION: </Text>
          <Text style={stylesCensor.detailValue}>
          Infinite Semesters of "Masti"
          </Text>
        </View>

        <View style={stylesCensor.detailRow}>
          <Text style={stylesCensor.detailLabel}>REELS: </Text>
          <Text style={stylesCensor.detailValue}>Infinite Core Memories</Text>
        </View>

        <View style={stylesCensor.detailRow}>
          <Text style={stylesCensor.detailLabel}>GAUGE: </Text>
          <Text style={stylesCensor.detailValue}>70mm (Life-Sized Dreams)</Text>
        </View>
      </View>
        <View style={stylesCensor.writtenByContainer}>
          <Text style={stylesCensor.writtenByTitle}>WRITTEN BY-</Text>
          <Text style={stylesCensor.writtenByValue}>
           {`DEPT. OF ${profile?.department ? profile.department.split("&")[0].trim().toUpperCase() : "METALLURGICAL ENGINEERING"}`}
          </Text>
        </View>
      
    </View>
  </View>
</Page>
       
        {/* ######### this are the common pages and common snapshots   ##################*/}
         {/*<Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P4.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P5.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P6.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P7.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P8.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P9.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P10.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P11.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P12.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P13.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P14.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P15.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P16.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P17.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P18.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P19.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P20.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P21.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/Common_snaps/P22.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/Common_snaps/P23.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/Common_snaps/P24.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/Common_snaps/P25.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/Common_snaps/P26.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>

        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/Common_snaps/P27.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page> 
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P28.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>
        <Page size="A4" style={stylesSigningOff.page}>
          <View style={stylesSigningOff.section}>
            <Image
              src="/assets/front/P29.png"
              style={stylesSigningOff.backgroundImg}
            />
          </View>
        </Page>*/}

        {/* ########################### this is the profile page  ############################ */}
        {!!profile && (
          <Page size="A4" style={stylesFilm.page} wrap={false}>
            <View style={stylesFilm.pageContainer}>
              <Image src={profileBG} style={stylesFilm.backgroundImg} />

              {!!profile.profile_image && (
                <View style={stylesFilm.profileSpotlight}>
                  <View style={stylesFilm.profileRing}>
                    <Image
                      src={profile.profile_image}
                      style={stylesFilm.profileImage}
                    />
                  </View>
                </View>
              )}

              <Image src={profileHeader} style={stylesFilm.headerOverlay} />

              {!!(profile.name || profile.nickname) && (
                <View style={stylesFilm.centerDetails}>
                  {!!profile.name && (
                    <Text style={stylesFilm.centerLine}>
                      <Text style={stylesFilm.label}>
                        {getLeadRoleLabel(profile.gender)}
                      </Text>
                      <Text style={stylesFilm.centerRedInline}>
                        {profile.name}
                      </Text>
                    </Text>
                  )}
                  {!!profile.nickname && (
                    <Text style={stylesFilm.centerLine}>
                      <Text style={stylesFilm.label}>Nickname </Text>
                      <Text style={stylesFilm.centerRedInline}>
                        {profile.nickname}
                      </Text>
                    </Text>
                  )}
                </View>
              )}

              {!!(profile.department || profile.join_year) && (
                <View style={stylesFilm.leftDetails}>
                  {!!profile.department && (
                    <>
                      <Text style={stylesFilm.label}>Genre</Text>
                      <Text
                        style={[
                          stylesFilm.redText,
                          stylesFilm.detailValueWrap,
                        ]}
                      >
                        {profile.department.split("&")[0].trim()}
                      </Text>
                    </>
                  )}
                  {!!profile.join_year && (
                    <>
                      <Text style={[stylesFilm.label, { marginTop: 8 }]}>
                        Release Year
                      </Text>
                      <Text style={stylesFilm.redText}>{profile.join_year}</Text>
                    </>
                  )}
                </View>
              )}

              {!!((profile.hostel && profile.room_no) || profile.graduation_year) && (
                <View style={stylesFilm.rightDetails}>
                  {!!(profile.hostel && profile.room_no) && (
                    <>
                      <Text style={stylesFilm.label}>Location</Text>
                      <Text
                        style={[
                          stylesFilm.redText,
                          stylesFilm.detailValueWrapRight,
                        ]}
                      >
                        {formatHostel(profile.hostel)}
                        {",\n"}Room {profile.room_no}
                      </Text>
                    </>
                  )}
                  {!!profile.graduation_year && (
                    <>
                      <Text style={[stylesFilm.label, { marginTop: 8 }]}>
                        Finale
                      </Text>
                      <Text
                        style={[
                          stylesFilm.redText,
                          stylesFilm.detailValueWrapRight,
                        ]}
                      >
                        {profile.graduation_year}
                      </Text>
                    </>
                  )}
                </View>
              )}

              <View style={stylesFilm.galleryCluster}>
                {renderGalleryFrame(profile, "img3", stylesFilm.galleryFrameTop)}
                {renderGalleryFrame(profile, "img1", stylesFilm.galleryFrameLeft)}
                {renderGalleryFrame(profile, "img4", stylesFilm.galleryFrameRight)}
                {renderGalleryFrame(profile, "img2", stylesFilm.galleryFrameBottom)}
              </View>

              <View style={stylesFilm.quoteContainer}>
                <Text style={getTaglineStyles(profile)}>
                  {getProfileTagline(profile)}
                </Text>
              </View>
            </View>
          </Page>
        )}
      </>
    </Document>
  );
};

export default InitialPages;
