// local-chat-frontend/src/components/FileUploader.jsx
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
      className="border-2 border-dashed border-gray-400 p-4 text-center rounded-lg mb-4 cursor-pointer hover:bg-gray-50 transition"
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">Drag & drop a PDF or image here, or click to select</p>
    </div>
  );
};

export default FileUploader;

