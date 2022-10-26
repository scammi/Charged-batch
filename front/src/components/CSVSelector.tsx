import React, { useState } from "react";
import { Button, Paper } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Papa from "papaparse";
import _ from "lodash";
import styled from '@emotion/styled';
// Allowed extensions for input file
const allowedExtensions = ["csv"];

const CSVSelector = ({ setBatchData }) => {


  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [csvData, setCsvData] = useState([]);
  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      console.log(e.target.files)
      const inputFile = e.target.files[0];

      setFileName(inputFile?.name)

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      setFile(inputFile);
      handleParse(inputFile);
      // If input type is correct set the state
    }
  };
  const handleParse = (file) => {

    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      setCsvData(parsedData);

      setBatchData(parsedData);
    };
    reader.readAsText(file);
  };

  const rn = () => Math.floor(Math.random() * 10000000);
  return (
    <div>
      <input
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleFileChange}
        name="file"
      />
      <label htmlFor="raised-button-file">
        <Button component="span">
          Upload
        </Button>
      </label>
      <div style={{ marginTop: "1rem" }}>
        {error || fileName}
        {!_.isEmpty(csvData) && <CSVTable data={csvData} />}
      </div>
    </div>
  );
};

const CSVTable = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="">
        <TableHead>
          <TableRow>
            <TableCell>sending nftAddress</TableCell>
            <TableCell>sending tokenId</TableCell>
            <TableCell>sending amount</TableCell>
            <TableCell>receiving nftAddress</TableCell>
            <TableCell>receiving tokenId</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {_.map(data, (item, i) => {
            return (
              <TableRow key={i}>
                <TableCell>{item.nftTokenAddress}</TableCell>
                <TableCell>{item.nftTokenId}</TableCell>
                <TableCell>{item.nftTokenAmount}</TableCell>
                <TableCell>{item.basketNftAddress}</TableCell>
                <TableCell>{item.basketNftTokenId}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
const El = styled.span`
  background-color: #77777733;
  font-size:0.4em;
  color: black;
  padding: .1em;
  margin: .1em;
`

export { CSVSelector };