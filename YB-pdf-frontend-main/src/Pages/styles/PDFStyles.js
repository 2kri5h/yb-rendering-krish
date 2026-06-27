import { StyleSheet } from "@react-pdf/renderer";

let color = ["black", "blue", "red", "yellow"];

function randomColor() {
  return color[Math.floor(Math.random() * color.length)];
}

export const styles = StyleSheet.create({
  name: {
    position: "absolute",
    top: "-1.3vh",
    right: "-1vh",
    fontSize: 12,
    fontWeight: 700,
    color: "#865dff",
    fontFamily: "Roboto",
  },
  page: {
    flexDirection: "row",
  },

  backgroundImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 595,
    height: 842,
    objectFit: "cover",
  },

  postPage: {
    width: 595,
    height: 842,
    flexDirection: "column",
    backgroundColor: "#F5E6C8",
  },

  postPageBody: {
    flex: 1,
    paddingTop: 4,
    justifyContent: "flex-start",
  },
  section: {
    position: "relative",
    zIndex: 2,
    flexGrow: 1,
  },

  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // transform: 'rotate(-10deg)',
    transformOrigin: "center center",
    height: "auto",
    fontFamily: "myriad",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "4px",
  },

  imageContainerRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // transform: 'rotate(10deg)',
    // transformOrigin: "center center",
    height: "auto",
    marginRight: "10%",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  profilePicRight: {
    width: "70%",
    height: "70%",
    // transform: 'rotate(10deg)',
    transformOrigin: "center center",
    objectFit: "cover",
    // borderRadius: "6px",
    // marginRight:'1px',
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "3px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  profilePicRightX: {
    width: "70%",
    height: "70%",
    // transform: 'rotate(10deg)',
    transformOrigin: "center center",
    objectFit: "cover",
    // borderRadius: "6px",
    marginRight: "1%",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "3px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  smallerProfilePic: {
    width: "0.7in",
    height: "0.7in",
    // transform: 'rotate(1deg)',
    transformOrigin: "center center",
    objectFit: "cover",
    // borderRadius: "6px",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "2px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  smallerProfilePicc: {
    width: "1in",
    height: "1in",
    // transform: 'rotate(1deg)',
    transformOrigin: "center center",
    objectFit: "cover",
    // borderRadius: "6px",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "2px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  profileTextRight: {
    fontSize: 15,
    textAlign: "center",
    margin: 5,
    marginLeft: -8,
    // transform: 'rotate(10deg)',
    transformOrigin: "center center",
  },

  profileTextLeft: {
    fontSize: 15,
    textAlign: "center",
    margin: 5,
    marginLeft: 25,
    // transform: 'rotate(-10deg)',
    transformOrigin: "center center",
  },

  smallerProfileText: {
    fontSize: 15,
    textAlign: "center",
    // transform: 'rotate(1deg)',
    transformOrigin: "center center",
  },
  profilePicLeft: {
    width: "1.7in",
    height: "1.7in",
    // transform: 'rotate(-10deg)',
    transformOrigin: "center center",
    objectFit: "cover",
    // borderRadius: "6px",
    // border: "5px solid red",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "3px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  container: {
    display: "flex",
    paddingTop: 4,
    paddingBottom: 24,
    paddingLeft: 28,
    paddingRight: 28,
    height: "100%",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
    color: "#000",
  },

  containerr: {
    display: "flex",
    paddingTop: 56,
    paddingBottom: 28,
    paddingLeft: 36,
    paddingRight: 36,
    height: "100%",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
  },

  postReviewHeader: {
    height: 48,
    width: "100%",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  postReviewTitle: {
    fontFamily: "bebasneue",
    fontSize: 17,
    fontWeight: 700,
    color: "#000000",
    textAlign: "center",
    letterSpacing: -0.3,
  },

  l: {
    // display: 'flex',
    // flexDirection: 'row', /* Keeps the image and text aligned horizontally */
    // justifyContent: 'space-evenly', /* Distributes space between elements */
    // alignItems: 'center', /* Vertically centers items within the container */
    // padding: '10px 10px 10px 0', /* Remove padding on the left side */
    // marginBottom: '10px',
    // marginTop: '5px',                                                                        //new
    // backgroundColor: '#333',                                                                //new
    // color: 'white',
    // borderLeft: '3px solid red',
    // marginRight: 0,
    // width: '100%',
    // height:'auto',
    justifyContent: "flex-start" /* Distributes space between elements */,
  },
  r: {
    // display: 'flex',
    // flexDirection: 'row', /* Keeps the image and text aligned horizontally */
    // // justifyContent: 'space-evenly', /* Distributes space between elements */
    // alignItems: 'center', /* Vertically centers items within the container */
    // padding: '10px 10px 10px 0', /* Remove padding on the left side */
    // marginBottom: '10px',
    // marginTop: '5px',                                                                        //new
    // backgroundColor: '#333',                                                                //new
    // color: 'white',
    // borderRight: '3px solid red',
    // marginRight: 0,
    // width: '100%',
    justifyContent: "flex-end" /* Distributes space between elements */,
  },
  postContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 0,
    marginBottom: 12,
    backgroundColor: "transparent",
    color: "#111",
    width: "100%",
    borderWidth: 0,
  },

  postRowLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  postRowRight: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },

  postProfileCol: {
    width: 96,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  postProfileFrame: {
    width: 88,
    height: 108,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  postFrameImg: {
    width: 88,
    height: 104,
    position: "absolute",
    top: 0,
    left: 0,
  },

  postProfilePhoto: {
    position: "absolute",
    width: 64,
    height: 80,
    top: 14,
    left: 12,
    borderRadius: 4,
    objectFit: "cover",
  },

  postBubble: {
    flex: 1,
    flexShrink: 1,
    justifyContent: "flex-start",
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 14,
    textAlign: "justify",
    borderWidth: 1.5,
    borderColor: "#000000",
    borderRadius: 20,
    backgroundColor: "#F8F0E3",
    marginHorizontal: 4,
  },

  postSignatureRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 6,
    paddingRight: 2,
  },

  postSignature: {
    fontSize: 8.5,
    fontFamily: "Roboto",
    fontStyle: "italic",
    fontWeight: 700,
    color: "#111111",
  },
  left: {
    alignItems: "center",
  },

  // smallerPostContainer: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },

  smallHeight: {
    height: "auto",
  },
  smallerHeight: {
    height: "auto",
  },

  smallWidth: {
    width: "68%",
  },

  semiMediumHeight: {
    height: "auto",
  },

  semiMediumWidth: {
    width: "68%",
  },

  mediumHeight: {
    height: "auto",
  },

  mediumWidth: {
    width: "68%",
  },

  largeHeight: {
    height: "auto",
  },

  apniHeight: {
    height: "auto",
  },

  largeWidth: {
    width: "68%",
  },

  largerHeight: {
    height: "auto",
  },

  largerWidth: {
    width: "68%",
  },

  textContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    marginLeft: "2%",
    fontFamily: "myriad",
    height: "auto",
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 14,
    textAlign: "justify",
    borderWidth: 1.5,
    borderColor: "#000000",
    borderRadius: 20,
    backgroundColor: "#F8F0E3",
    position: "relative",
  },

  textContainerRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    fontFamily: "myriad",
    textAlign: "justify",
    height: "auto",
    marginRight: "2%",
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: "#000000",
    borderRadius: 20,
    backgroundColor: "#F8F0E3",
    position: "relative",
  },

  content: {
    fontSize: 8.5,
    fontFamily: "Roboto",
    // fontStyle: "normal",
    // fontWeight: 400,
  },

  smallerPostsContaner: {
    display: "flex",
    width: "100vw",
    paddingLeft: "7vw",
    paddingRight: "7vw",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallerPostsContanerr: {
    display: "flex",
    width: "80vw",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  smallerPostContainer: {
    width: "43vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0.5in",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "18px",
    backgroundColor: "rgba(248, 240, 227, 0.86)",
    padding: "0.15in",
  },

  smallerPostContainerr: {
    width: "40vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0.5in",
  },

  smallerTextContainer: {
    display: "flex",
  },

  smallerPostsImage: {
    width: "1.7in",
    height: "1.7in",
    objectFit: "cover",
  },

  smallerPostsText: {
    fontSize: 12,
  },

  smallerPostsContent: {
    width: "100%",
  },

  smallProfilePic: {
    width: "0.7in",
    height: "0.7in",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "2px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  smallProfilePicX: {
    width: "0.5in",
    height: "0.5in",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "2px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  semiMediumProfilePic: {
    width: "0.7in",
    height: "0.7in",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "2px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  mediumProfilePic: {
    width: "0.7in",
    height: "0.7in",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "2px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  largeProfilePic: {
    width: "1in",
    height: "1in",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "2px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  largerProfilePic: {
    width: "1in",
    height: "1in",
    borderWidth: "2px",
    borderColor: "#1b140c",
    borderRadius: "8px",
    padding: "2px",
    backgroundColor: "rgba(248, 240, 227, 0.9)",
  },

  // smallProfileText:{
  //   // position: "absolute",
  //   // fontSize: 10,
  //   // fontFamily: "Comic",
  //   // fontWeight: 700,
  //   // fontStyle: "italic",
  //   // marginBottm: 10,
  //   // right: 0,
  //   position: 'relative',
  //   left: '75%',
  //   fontSize: 10,
  //   fontFamily: "Comic",
  //   // fontWeight: 700,
  //   // fontStyle: "italic",
  //   marginTop: '5px',

  // },
  smallProfileText: {
    // position: "absolute",
    // fontSize: 10,
    // fontFamily: "Comic",
    // fontWeight: 700,
    // fontStyle: "italic",
    // marginBottm: 10,
    // right: 0,
    position: "relative",
    left: "37%",
    fontSize: 10,
    fontFamily: "mayraid",
    fontWeight: 700,
    fontStyle: "italic",
    marginTop: "5px",
    fontSize: 8.5,
    fontFamily: "Roboto",
    color: "#111111",
    // textAlign:'center'
  },
  // smallProfileTextr:{
  // position: "absolute",
  // fontSize: 10,
  // fontFamily: "Comic",
  // fontWeight: 700,
  // fontStyle: "italic",
  // marginBottm: 0,
  // left: 0,
  // smallProfileTextr:{
  //   // position:'absolute',
  //   fontSize: 10,
  //   fontFamily: "Comic",
  //   // fontWeight: 700,
  //   // fontStyle: "italic",
  //   marginTop: '5px'
  // } ,
  smallProfileTextr: {
    position: "relative",
    fontSize: 10,
    fontFamily: "Comic",
    fontWeight: 700,
    fontStyle: "italic",
    marginTop: "5px",
    left: "45%",
    fontSize: 8.5,
    fontFamily: "Roboto",
    color: "#111111",
  },
  // mediumProfileText:{
  //   fontSize: 11,
  // },

  // largeProfileText:{
  //   fontSize: 12,
  // },

  verified: {
    width: "0.1in",
    height: "0.1in",
  },
});