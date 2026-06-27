import { StyleSheet } from "@react-pdf/renderer";


export const stylesSigningOff = StyleSheet.create({
  page: {
    flexDirection: 'row',
  },
  backgroundImg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  section: {
    position: "relative",
    zIndex: 1,
    margin: 0,
    padding: 0,
    flexGrow: 1,
  },
  text: {
    fontFamily: "LobsterFont",
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 1.5,
    position: 'absolute',
    top: '640px',
    left: '420px',
    marginLeft: '-25px',
  },
  rollno: {
    fontFamily: "LobsterFont",
    fontSize: 18,
    textAlign: 'justify',
    lineHeight: 1.5,
    position: 'absolute',
    top: '660px',
    left: '420px',
    marginLeft: '-20px',
  },
  paragraph: {
    fontFamily: "LobsterFont",
    fontSize: 10,
    textAlign: 'justify',
    lineHeight: 2.5,
    marginLeft: '100px',
    marginRight: '100px',
    marginTop: '300px',
  }
});