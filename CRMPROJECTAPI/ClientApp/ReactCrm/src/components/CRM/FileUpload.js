import React from "react";

export default function FileUpload({ setFileData }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFileData([file]);
  };

  return <input type="file" onChange={handleFileUpload} />;
}
