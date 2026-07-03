import React, { useEffect } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { handleMergePDF } from './merger'

const YearbookDashboard = ({ data }) => {
    useEffect(() => {
        if (data.length > 0) {
            const table = $('#yearbookTable').DataTable();
            return () => {
                table.destroy();
            };
        }
    }, [data]);


    //   const getCsrfToken = () => {
    //     const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    //     return tokenMeta ? tokenMeta.getAttribute('content') : '';
    //   };

    //   const getIdData = () => {
    //     fetch('http://127.0.0.1:8000/api/fetch_id_data/', {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': getCsrfToken()
    //       },
    //       body: JSON.stringify(postData),
    //     })
    //       .then(response => response.json())
    //       .then(result => {
    //         console.log('Success:', result);
    //       })
    //       .catch(error => {
    //         console.error('Error:', error);
    //       });
    //   };

    //   const handleViewPdf = () => {
    //     window.open('http://localhost:3000/', '_blank');
    //   };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Yearbook 2026</h1>
            <table id="yearbookTable" className="table table-striped table-dark table-bordered">
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th>Name(Yearbook ID)</th>
                        <th>Option Chosen</th>
                        <th>Other Selected IDs</th>
                        <th style={{ textAlign: 'center' }}>View PDF</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => {
                        const yearbookId = row.YearbookId;
                        const nameWithId = `${row.Name} (${yearbookId})`;
                        const optionChosen = row.Typeofcopy;
                        const allIds = row.all_id_updated;
                        // console.log("Yearbook ID: ", yearbookId);
                        // console.log("allIds: ", allIds);

                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="name">{nameWithId}</td>
                                <td className="optionChosen">{optionChosen}</td>
                                <td className="customIds">{allIds}</td>
                                <td>
                                    <button
                                        className="renderBtn btn btn-primary"
                                        // onClick={() => handleRender(yearbookId, allIds)}
                                        onClick={() => handleMergePDF(yearbookId, allIds)}
                                    >
                                        Render
                                    </button>
                                </td>
                                {/* <td>
                  <button
                    className="viewPdfBtn btn btn-secondary"
                    onClick={handleViewPdf}
                  >
                    View PDF
                  </button>
                </td> */}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <style dangerouslySetInnerHTML={{__html: `
        body {
          background-color: pink;
          color: black;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button {
          color: aliceblue !important;
        }

        .dataTables_wrapper .dataTables_length select,
        .dataTables_wrapper .dataTables_filter input {
          color: black;
        }

        button {
          padding: 5px;
          border: 2px solid burlywood;
          cursor: pointer;
        }

        button:hover {
          transform: scale(1.1);
        }

        .viewPdfBtn {
          width: 150px;
        }

        .optionChosen {
          width: 200px;
        }
            `}} />
        </div>
    );
};

export default YearbookDashboard;