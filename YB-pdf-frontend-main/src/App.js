import React, { useState, useEffect, useRef } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  PDFViewer,
} from "@react-pdf/renderer";
import Merger from "./Pages/merger"
import axios from 'axios';
import Dashboard from './Pages/Dashboard'

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await axios.get('http://127.0.0.1:8000/api/fetch_id_data')
      .then(response => {
        setData(response.data.data);
        // console.log(response.data);
      })
      .catch(error => {
        console.log('error')
        
        console.error('There was an error fetching the data!', error);
      });
    }
    
    fetchData();
  }, []);

  // const idList = (data.length !== 0) ? [data[data.length - 1].yearbookId] : []; // Replace this with your actual list of ids
  // console.log("idList = ",idList);

  // let ids = [[]];
  // if(data.length !== 0 && data[data.length - 1].otherSelectedPeople === ""){
  //   ids = [[]];
  // }
  // else{
  //   ids = (data.length !== 0) ? [JSON.parse(data[data.length - 1].otherSelectedPeople)] : [[]];
  // }
  // // console.log("ids = ",JSON.parse(data[data.length - 1].otherSelectedPeople));
  // console.log('ids = ', ids[0]);

  // const idList = [205];

  // const ids = [[]]

  // const downloadAnchorRef = useRef(null);
  // const [readyToDownload, setReadyToDownload] = useState(false);
  // useEffect(() => {
  //   const generatePDFs = async () => {
  //     for (const id of idList) {
  //       // Simulate the asynchronous PDF generation process with a timeout
  //       await new Promise((resolve) => setTimeout(resolve, 5000));
  //       // Actual PDF generation logic can be placed here
  //     }
  //     setReadyToDownload(true);
  //     // download()
  //   };

  //   generatePDFs();
  // }, []);

  // function download(){
  //   const downloadLinks = downloadAnchorRef.current.querySelectorAll('a');
  //   downloadLinks.forEach((link) => link.click());
  // }

  return (
    <div style={{ 
      // width: "100%", 
      // height: "97.5vh", 
      // backgroundColor: "#4599bb", 
      // margin: "0px", 
      // padding: "0px", 
      // border: "2px solid black"
      }}>
      <Dashboard data={ data }/>
      {/* {idList.map((entry, index) => (
        // <PDFViewer key={entry} style={{ width: "100%", height: "100%" }}>
        //   <PDFGenerator id={entry} idList={ids[index]} />
        // </PDFViewer>
        <Merger id={entry} idList={ids[index]}/>
      ))} */}
    </div>
  );
};

export default App;
