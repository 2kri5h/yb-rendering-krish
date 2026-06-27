import React from 'react';

const withTimeout = async (promise, ms, label) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms / 1000}s`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
};

const assertPdfBytes = (bytes, label) => {
  const header = new TextDecoder().decode(bytes.slice(0, 5));
  if (!header.startsWith('%PDF-')) {
    throw new Error(
      `${label} is not a valid PDF (got "${header.trim() || 'empty'}"). ` +
        'If this is an external snapshot, ensure the file exists under public/snapshots/.'
    );
  }
};

const loadPdfBlob = async (blob, label, PDFDocument) => {
  const bytes = await blob.arrayBuffer();
  assertPdfBytes(bytes, label);
  return PDFDocument.load(bytes);
};

// Function to dynamically generate and merge PDFs
const mergePDFs = async (externalPdfPaths, id, idList) => {
  const [
    reactPdfModule,
    pdfLibModule,
    initialPagesModule,
    finalPagesModule,
    initialFetchModule,
    finalFetchModule,
  ] = await Promise.all([
    import('@react-pdf/renderer'),
    import('pdf-lib'),
    import('./InitialPages'),
    import('./FinalPages'),
    import('./InitialFetchPageData'),
    import('./FinalFetchPageData'),
  ]);

  const ReactPDF = reactPdfModule.default;
  const { PDFDocument } = pdfLibModule;
  const InitialPages = initialPagesModule.default;
  const FinalPages = finalPagesModule.default;
  const InitialFetchPageData = initialFetchModule.default;
  const FinalFetchPageData = finalFetchModule.default;

  console.log("Before calling InitialFetchPageData: id:", id, "idList:", idList);
  const initialData = await withTimeout(
    InitialFetchPageData(id),
    150000,
    'Fetching initial profile data'
  );
  const finalData = await withTimeout(
    FinalFetchPageData(id, idList),
    240000,
    'Fetching posts data'
  );

  
  if (!initialData || !initialData.email || !initialData.name) {
    throw new Error('Initial profile data is incomplete. Cannot generate PDF.');
  }

  if (!finalData) {
    throw new Error('Fetching posts data returned no result.');
  }

  if (!Array.isArray(finalData.userPosts)) {
    finalData.userPosts = [];
  }
  if (!Array.isArray(finalData.otherPeopleData)) {
    finalData.otherPeopleData = [];
  }

  const { hydrateReviewPostImages, embedInitialProfileImages } = await import('./reviewProfileImages');
  await withTimeout(
    hydrateReviewPostImages(finalData),
    180000,
    'Loading review profile images'
  );

  await withTimeout(
    embedInitialProfileImages(initialData),
    300000,
    'Loading profile page images'
  );

  // console.log('id : ', typeof id.id, id.id);
  const mergedPdf = await PDFDocument.create();

  // Generate and add the first chunk of pages (1–insertAfterPage)
  const firstChunkBlob = await withTimeout(
    ReactPDF.pdf(<InitialPages /*id={id} idList={idList}*/ profile={initialData} />).toBlob(),
    600000,
    'Rendering initial PDF pages'
  );
  const firstChunkPdf = await loadPdfBlob(firstChunkBlob, 'Initial PDF render', PDFDocument);
  const firstChunkPages = await mergedPdf.copyPages(firstChunkPdf, firstChunkPdf.getPageIndices());
  firstChunkPages.forEach((page) => mergedPdf.addPage(page));

  const finalPostsBlob = await withTimeout(
    ReactPDF.pdf(
      <FinalPages
        id={id}
        idList={idList}
        data={finalData}
        profile={initialData}
        includeSigningOffPages={false}
      />
    ).toBlob(),
    600000,
    'Rendering final post pages'
  );
  const finalPostsPdf = await loadPdfBlob(finalPostsBlob, 'Final post pages render', PDFDocument);
  const finalPostsPages = await mergedPdf.copyPages(finalPostsPdf, finalPostsPdf.getPageIndices());
  finalPostsPages.forEach((page) => mergedPdf.addPage(page));

  // Add external PDFs after the post pages so they appear at the end of the book.
  const pdfPathMap = new Map(
    externalPdfPaths.map((pdfPath) => [pdfPath.split('/').pop(), pdfPath])
  );

  if (pdfPathMap.has(`${id}.pdf`)) {
    const pdfPath = pdfPathMap.get(`${id}.pdf`);
    console.log('Merging external snapshot:', pdfPath);
    const res = await fetch(pdfPath);
    if (!res.ok) {
      throw new Error(
        `External snapshot not found: ${pdfPath} (HTTP ${res.status}). ` +
          'Place the file in YB-pdf-frontend-main/public/snapshots/.'
      );
    }
    const externalBytes = await res.arrayBuffer();
    assertPdfBytes(externalBytes, `External snapshot ${pdfPath}`);
    const externalPdf = await PDFDocument.load(externalBytes);
    const externalPages = await mergedPdf.copyPages(externalPdf, externalPdf.getPageIndices());
    externalPages.forEach((page) => mergedPdf.addPage(page));
  }

  const finalSigningOffBlob = await withTimeout(
    ReactPDF.pdf(
      <FinalPages
        id={id}
        idList={idList}
        data={finalData}
        profile={initialData}
        includePostPages={false}
        includePersonPages={false}
      />
    ).toBlob(),
    600000,
    'Rendering final signing-off pages'
  );
  const finalSigningOffPdf = await loadPdfBlob(
    finalSigningOffBlob,
    'Final signing-off render',
    PDFDocument
  );
  const finalSigningOffPages = await mergedPdf.copyPages(
    finalSigningOffPdf,
    finalSigningOffPdf.getPageIndices()
  );
  finalSigningOffPages.forEach((page) => mergedPdf.addPage(page));

  // Save the final merged PDF
  const mergedPdfBytes = await mergedPdf.save({
    addDefaultPage: false,
  });

  const rollNo = initialData.email.split('@')[0];
  return [new Blob([mergedPdfBytes], { type: 'application/pdf' }), rollNo, initialData.name];
};

// const Merger = ({ id, idList }) => {
// console.log('id : ', id); 
// console.log('idList in merger.jsx : ', idList);
export const handleMergePDF = async ( id, idList ) => {
  // External PDF file paths (stored in the public folder)
  const externalPdfPaths = [
    "/snapshots/72.pdf",
  ];
  // const externalPdfPaths = [
  //   "/snapshots/1.pdf",
  //   "/snapshots/2.pdf",
  //   "/snapshots/3.pdf",
  //   "/snapshots/4.pdf",
  //   "/snapshots/5.pdf",
  //   "/snapshots/6.pdf",
  //   "/snapshots/7.pdf",
  //   "/snapshots/8.pdf",
  //   "/snapshots/9.pdf",
  //   "/snapshots/10.pdf",
  //   "/snapshots/11.pdf",
  //   "/snapshots/12.pdf",
  //   "/snapshots/13.pdf",
  //   "/snapshots/14.pdf"
  // ];

  // Merge PDFs with an insertion point after the 14th page
  // console.log(id);
  // const mergedPdfBlob = await mergePDFs(externalPdfPaths, id, idList);
  // console.log('mergedPdfBlob : ', typeof mergedPdfBlob, mergedPdfBlob[1]);
  // // Create a download link for the merged PDF
  // const url = URL.createObjectURL(mergedPdfBlob[0]);
  // // console.log(url);
  // const a = document.createElement('a');
  // a.href = url;
  // a.download = `${mergedPdfBlob[1]}.pdf`;
  // a.click();
  // URL.revokeObjectURL(url);
  console.log("id value in handleMergePDF", id);

  try {
    const [mergedPdfBlob, roll_no, name] = await mergePDFs(externalPdfPaths, id, idList);
    const fileName = `${name}_${roll_no}`;
    console.log(fileName);

    // Create a download link for the merged PDF
    const url = URL.createObjectURL(mergedPdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    console.log(`PDF downloaded: ${fileName}.pdf`);
  } catch (error) {
    console.error('Failed to generate/download PDF:', error);
    alert(`PDF generation failed: ${error.message}`);
  }
};

//   return (
//     <div>
//       <h1 style={{
//         textAlign: 'center',
//         fontFamily: 'Calibri',
//         margin: '10px',
//         padding: '15vh 0 0  0'
//         }} >Download PDF for Yearbook ID: {id}</h1>
//       <button onClick={handleMergePDF} style={{
//         border: '2px solid black',
//         backgroundColor: 'rgb(26 165 74)',
//         padding: '10px 20px',
//         fontSize: 'large',
//         margin: '5vh 43vw',
//         cursor: 'pointer',
//         borderRadius: '5px'
//       }}
//         onMouseEnter={(e) => {
//         e.target.style.transform = "scale(1.1)";
//       }}
//         onMouseLeave={(e) => {
//           e.target.style.transform = "scale(1)";
//         }}>Upload YB to G-Drive</button>
//     </div>
//   );
// };

// export default Merger;




