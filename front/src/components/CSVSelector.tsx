import React, { useState } from "react";
import { Button, FilledInput } from "@mui/material";
import Papa from "papaparse";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

const CSVSelector = ({ setBatchData }) => {


  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

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
      console.log(parsedData);

      setBatchData(parsedData);
    };
    reader.readAsText(file);
  };

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
      </div>
    </div>
  );
};

export { CSVSelector };