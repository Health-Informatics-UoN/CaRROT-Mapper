import { CircleCheckBig, Loader2, Upload } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export function UploadSR() {
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      maxFiles: 1,
      onDrop,
    });
  const acceptedFileItems = acceptedFiles.map((file) => (
    <p key={file.name} className="flex items-center text-carrot">
      <CircleCheckBig className="mr-2" /> {file.name} -{" "}
      {(file.size / 1028).toFixed(2)} KB
    </p>
  ));
  const [uploading, setUpLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            {/*loading state*/}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">Uploading</p>
          </>
        ) : (
          <>
            <Upload className="w-10 10-10 text-carrot" />
            <p className="mt-2 text-sm text-slate-400">
              {" "}
              Select a Scan Report (.xlsx) by clicking or dragging the file here
            </p>
          </>
        )}
      </div>
      <div className="flex gap-2 mt-2 items-center text-sm">
        <h4>Accepted file:</h4>
        {acceptedFileItems}
      </div>
    </div>
  );
}
