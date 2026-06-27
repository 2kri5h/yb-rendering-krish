import React, { Fragment } from "react";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  Font,
} from "@react-pdf/renderer";
import {
  stylesReview,
  formatReviewForPdf,
  getReviewFrameStyles,
  getReviewRowSpacing,
  paginateReviewPostGroups,
  REVIEW_FIRST_ROW_MARGIN,
} from "./styles/stylesReview.js";
import { resolveProfileImageUrl } from "./reviewProfileImages.js";
import { resolveGalleryImageSrc } from "./galleryDefaults.js";

// import back1 from "/assets/back/1.png";
// import back2 from "/assets/back/2.jpg";

import Comic from "./Fonts/Comic/ComicNeue-Regular.ttf";
import ComicBold from "./Fonts/Comic/ComicNeue-BoldItalic.ttf";
import ComicItalic from "./Fonts/Comic/ComicNeue-Italic.ttf";
import Roboto from "./Fonts/Roboto/Roboto-Regular.ttf";
import RobotoBold from "./Fonts/Roboto/Roboto-Bold.ttf";
import RobotoItalic from "./Fonts/Roboto/Roboto-Italic.ttf";
import verified from "./assets/verified.png";
import lobster from "./Fonts/Roboto_Slab/static/RobotoSlab-Medium.ttf";
import fontFile from "./Fonts/Roboto_Slab/static/RobotoSlab-Medium.ttf";
import bebasneue from "./Fonts/Bebas_Neue/BebasNeue-Regular.ttf";
import myriad from "./Fonts/myriad-pro/MYRIADPRO-REGULAR.OTF";
import reviewBG from "./assets/reviewBG.png";
import reviewFrame from "./assets/rectangularframe.png";
import quoteOpening from "./assets/quote-opening.png";
import quoteClosing from "./assets/quote-closing.png";
import lightLeft from "./assets/lightleft.png";
import lightRight from "./assets/lightright.png";
import defaultImg from "./assets/default.jpg";
import GentiumRegular from "./Fonts/Gentium_Book_Plus/GentiumBookPlus-Regular.ttf";
import GentiumItalic from "./Fonts/Gentium_Book_Plus/GentiumBookPlus-Italic.ttf";
import GentiumBold from "./Fonts/Gentium_Book_Plus/GentiumBookPlus-Bold.ttf";
import GentiumBoldItalic from "./Fonts/Gentium_Book_Plus/GentiumBookPlus-BoldItalic.ttf";
import FranklinGothicMedium from "./Fonts/Franklin Gothic Medium Regular/Franklin Gothic Medium Regular.ttf";
import stylesFilm from "./styles/stylesFilm";
import { stylesSigningOff } from "./styles/signingOffStyle.js";
import profileBG from "./assets/profileBG.png";
import profileHeader from "./assets/header.png";
import film_frame from "./assets/frame.png";
import { computePostChunks } from "./postChunkUtils";
import HeadlinesBold from "./Fonts/headlines/Headlines-Bold.otf";
import HeadlinesBoldItalic from "./Fonts/headlines/Headlines-BoldItalic.otf";
import monotypeCorsiva from "./Fonts/monotype-corsiva-bold/monotype-corsiva-bold.otf";

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

Font.register({
  family: "Gentium Book Basic",
  fonts: [
    { src: GentiumRegular, fontWeight: 400, fontStyle: "normal" },
    { src: GentiumItalic, fontWeight: 400, fontStyle: "italic" },
    { src: GentiumBold, fontWeight: 700, fontStyle: "normal" },
    { src: GentiumBoldItalic, fontWeight: 700, fontStyle: "italic" },
  ],
});

Font.register({
  family: "Headlines",
  fonts: [
    { src: HeadlinesBold, fontWeight: 700 },
    { src: HeadlinesBoldItalic, fontStyle: "italic", fontWeight: 700 },
  ],
});

Font.register({ family: "Monotype Corsiva", src: monotypeCorsiva });

Font.registerEmojiSource({
  format: "png",
  url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/",
});

Font.register({ family: "LobsterFont", src: lobster });

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

const FinalPages = ({
  id,
  idList,
  data,
  profile,
  includePostPages = true,
  includePersonPages = true,
  includeSigningOffPages = true,
}) => {
  const {
    largerPosts,
    largePosts,
    mediumPosts,
    semiMediumPosts,
    smallPosts,
    smallerPosts,
    persons,
  } = computePostChunks(data);

  const getPostProfileSrc = (post) => {
    const src = post?.pdfProfileSrc;
    if (src && typeof src === "string" && src.startsWith("data:")) {
      return src;
    }
    if (post?.is_anonymous) return defaultImg;
    const resolved = resolveProfileImageUrl(post);
    if (resolved && typeof resolved === "string" && resolved.startsWith("data:")) {
      return resolved;
    }
    return defaultImg;
  };

  const renderReviewPost = (
    post,
    leftPost = true,
    isFirstOnPage = false,
    rowMarginBottom = 0
  ) => {
    if (!post || Array.isArray(post) || !String(post.content ?? "").trim()) {
      return null;
    }

    const frameStyles = getReviewFrameStyles(leftPost);
    const reviewerName = post.is_anonymous
      ? post.written_by
      : post.written_by_profile?.name;
    const { text: reviewText, fontSize } = formatReviewForPdf(post.content);

    const profileBlock = (
      <View
        style={[
          frameStyles.profileColumn,
          leftPost
            ? frameStyles.profileColumnLeft
            : frameStyles.profileColumnRight,
        ]}
      >
        <Image
          src={leftPost ? lightLeft : lightRight}
          style={leftPost ? frameStyles.lightLeft : frameStyles.lightRight}
        />
        <Image src={reviewFrame} style={frameStyles.marqueeFrameImg} />
        <Image
          src={getPostProfileSrc(post)}
          style={frameStyles.marqueePhoto}
        />
      </View>
    );

    const reviewBubble = (
      <View style={stylesReview.bubbleColumn}>
        <View style={stylesReview.reviewBubble}>
          <Image src={quoteOpening} style={stylesReview.quoteMarkOpen} />
          <View style={stylesReview.contentArea}>
            <Text
              style={[stylesReview.content, { fontSize }]}
            >
              {reviewText}
            </Text>
          </View>
          <View style={stylesReview.reviewerFooter}>
            <Text style={stylesReview.reviewerName}>
              {`~ ${reviewerName}`}
            </Text>
            {!post.is_anonymous && post.written_by_profile?.is_ib && (
              <Image src={verified} style={stylesReview.verified} />
            )}
          </View>
          <Image src={quoteClosing} style={stylesReview.quoteMarkClose} />
        </View>
      </View>
    );

    return (
      <View
        style={[
          leftPost ? stylesReview.postRow : stylesReview.postRowReverse,
          isFirstOnPage ? stylesReview.postRowFirst : null,
          { marginBottom: rowMarginBottom },
        ]}
      >
        {profileBlock}
        {reviewBubble}
      </View>
    );
  };

  const renderReviewPagePosts = (posts, keyPrefix) => {
    let altIndex = 0;
    return posts.map((post, key) => {
      if (!post || Array.isArray(post) || !String(post?.content ?? "").trim()) {
        return null;
      }
      const rowSpacing = getReviewRowSpacing();
      const leftPost = altIndex % 2 === 0;
      const isFirstOnPage = altIndex === 0;
      const isLastOnPage = key === posts.length - 1;
      altIndex += 1;
      return (
        <View
          key={post.id ?? `${keyPrefix}-${key}`}
          wrap={false}
          style={[
            stylesReview.postRowLayer,
            {
              marginTop: isFirstOnPage ? REVIEW_FIRST_ROW_MARGIN : 0,
              marginBottom: isLastOnPage ? 0 : rowSpacing,
            },
          ]}
        >
          {renderReviewPost(post, leftPost, isFirstOnPage, 0)}
        </View>
      );
    });
  };

  const renderReviewPages = (postGroups, keyPrefix) => {
    const pages = paginateReviewPostGroups(postGroups);
    return pages.map((pagePosts, pageIndex) => {
      const key = `${keyPrefix}-p${pageIndex}`;
      return (
        <PostReviewPage key={key} pageKey={key}>
          {renderReviewPagePosts(pagePosts, key)}
        </PostReviewPage>
      );
    });
  };

  const PostReviewPage = ({ pageKey, children }) => (
    <Page key={pageKey} size="A4" style={stylesReview.page} wrap={false}>
      <View style={stylesReview.pageContainer}>
        <Image src={reviewBG} style={stylesReview.backgroundImg} fixed />
        <View style={stylesReview.reviewPageBody}>{children}</View>
      </View>
    </Page>
  );

  const allReviewGroups = [
    ...(smallerPosts ?? []),
    ...(smallPosts ?? []),
    ...(semiMediumPosts ?? []),
    ...(mediumPosts ?? []),
    ...(largePosts ?? []),
    ...(largerPosts ?? []),
  ];

  return (
    <Document>
      {!!includePostPages && (
        <>
          {allReviewGroups.length
            ? renderReviewPages(allReviewGroups, "review")
            : null}
        </>
      )}

      {!!(includePersonPages && persons) &&
        persons.map((person, index) => {
          const personKey =
            person.profile?.user ?? person.profile?.id ?? `person-${index}`;
          return (
          <Fragment key={personKey}>
            {!!person.profile && (
              <Page size="A4" style={stylesFilm.page} wrap={false}>
                <View style={stylesFilm.pageContainer}>
                  <Image src={profileBG} style={stylesFilm.backgroundImg} />

                  {!!person.profile.profile_image && (
                    <View style={stylesFilm.profileSpotlight}>
                      <View style={stylesFilm.profileRing}>
                        <Image
                          src={person.profile.profile_image}
                          style={stylesFilm.profileImage}
                        />
                      </View>
                    </View>
                  )}

                  <Image src={profileHeader} style={stylesFilm.headerOverlay} />

                  {!!(person.profile.name || person.profile.nickname) && (
                    <View style={stylesFilm.centerDetails}>
                      {!!person.profile.name && (
                        <Text style={stylesFilm.centerLine}>
                          <Text style={stylesFilm.label}>
                            {getLeadRoleLabel(person.profile.gender)}
                          </Text>
                          <Text style={stylesFilm.centerRedInline}>
                            {person.profile.name}
                          </Text>
                        </Text>
                      )}
                      {!!person.profile.nickname && (
                        <Text style={stylesFilm.centerLine}>
                          <Text style={stylesFilm.label}>Nickname </Text>
                          <Text style={stylesFilm.centerRedInline}>
                            {person.profile.nickname}
                          </Text>
                        </Text>
                      )}
                    </View>
                  )}

                  {!!(person.profile.department || person.profile.join_year) && (
                    <View style={stylesFilm.leftDetails}>
                      {!!person.profile.department && (
                        <>
                          <Text style={stylesFilm.label}>Genre</Text>
                          <Text
                            style={[
                              stylesFilm.redText,
                              stylesFilm.detailValueWrap,
                            ]}
                          >
                            {person.profile.department.split("&")[0].trim()}
                          </Text>
                        </>
                      )}
                      {!!person.profile.join_year && (
                        <>
                          <Text style={[stylesFilm.label, { marginTop: 8 }]}>
                            Release Year
                          </Text>
                          <Text style={stylesFilm.redText}>
                            {person.profile.join_year}
                          </Text>
                        </>
                      )}
                    </View>
                  )}

                  {!!((person.profile.hostel && person.profile.room_no) ||
                    person.profile.graduation_year) && (
                    <View style={stylesFilm.rightDetails}>
                      {!!(person.profile.hostel && person.profile.room_no) && (
                        <>
                          <Text style={stylesFilm.label}>Location</Text>
                          <Text
                            style={[
                              stylesFilm.redText,
                              stylesFilm.detailValueWrapRight,
                            ]}
                          >
                            {formatHostel(person.profile.hostel)}
                            {",\n"}Room {person.profile.room_no}
                          </Text>
                        </>
                      )}
                      {!!person.profile.graduation_year && (
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
                            {person.profile.graduation_year}
                          </Text>
                        </>
                      )}
                    </View>
                  )}

                  <View style={stylesFilm.galleryCluster}>
                    {renderGalleryFrame(
                      person.profile,
                      "img3",
                      stylesFilm.galleryFrameTop
                    )}
                    {renderGalleryFrame(
                      person.profile,
                      "img1",
                      stylesFilm.galleryFrameLeft
                    )}
                    {renderGalleryFrame(
                      person.profile,
                      "img4",
                      stylesFilm.galleryFrameRight
                    )}
                    {renderGalleryFrame(
                      person.profile,
                      "img2",
                      stylesFilm.galleryFrameBottom
                    )}
                  </View>

                  <View style={stylesFilm.quoteContainer}>
                    <Text style={getTaglineStyles(person.profile)}>
                      {getProfileTagline(person.profile)}
                    </Text>
                  </View>
                </View>
              </Page>
            )}

            {(() => {
              const personReviewGroups = [
                ...(person.smallerPosts ?? []),
                ...(person.smallPosts ?? []),
                ...(person.semiMediumPosts ?? []),
                ...(person.semiMediummPosts ?? []),
                ...(person.mediumPosts ?? []),
                ...(person.largePosts ?? []),
                ...(person.largeePosts ?? []),
                ...(person.largeeePosts ?? []),
                ...(person.largerPosts ?? []),
                ...(person.largerrPosts ?? []),
              ];
              return personReviewGroups.length
                ? renderReviewPages(personReviewGroups, `${personKey}-review`)
                : null;
            })()}
          </Fragment>
        );
        })}

      {!!includeSigningOffPages && (
        <>
          {/* <Page size="A4" style={stylesSigningOff.page}>
            <View style={stylesSigningOff.section}>
              <Image src={`${window.location.origin}/assets/back/1.png`} style={stylesSigningOff.backgroundImg} />
            </View>
          </Page> */}
           <Page size="A4" style={stylesSigningOff.page}>
            <View style={stylesSigningOff.section}>
              <Image src="/assets/back/LAST-5.png" style={stylesSigningOff.backgroundImg} />
            </View>
          </Page>
         {/* yaha pe personalised snapshots aane chahiye  */}
          <Page size="A4" style={stylesSigningOff.page}>
            <View style={stylesSigningOff.section}>
              <Image src="/assets/back/LAST-2.jpg" style={stylesSigningOff.backgroundImg} />
            </View>
          </Page>

          {/* <Page size="A4" style={stylesSigningOff.page}>
            <View style={stylesSigningOff.section}>
              <Image src="/assets/back/LAST-3.png" style={stylesSigningOff.backgroundImg} />
            </View>
          </Page> */}

          <Page size="A4" style={stylesSigningOff.page}>
            <View style={stylesSigningOff.section}>
              <Image src="/assets/back/LAST-1.png" style={stylesSigningOff.backgroundImg} />
            </View>
          </Page>

           {/* <Page size="A4" style={stylesSigningOff.page}>
            <View style={stylesSigningOff.section}>
              <Image src="/assets/back/LAST-1 (1).png" style={stylesSigningOff.backgroundImg} />
            </View>
          </Page>  */}

          <Page size="A4" style={stylesSigningOff.page}>
            <View style={stylesSigningOff.section}>
              <Image src="/assets/back/LAST.png" style={stylesSigningOff.backgroundImg} />
            </View>
          </Page>
        </>
      )} 
    </Document>
  );
};

export default FinalPages;