import React from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ onUpload }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-dashed border-2 border-gray-400 p-4 text-center rounded mb-4 cursor-pointer"
    >
      <input {...getInputProps()} />
      <p>Drag & drop a PDF or image here, or click to select file</p>
    </div>
  );
};

export default FileUploader;
