import { Card } from "@heroui/react";
import React from "react";

const UploadFiles = ({
  file,
  progress,
  message,
  uploading,
}: {
  file: File;
  progress: number;
  message: string;
  uploading: boolean;
}) => {
  return (
    <Card className="bg-content1 shadow-md p-4 border border-default-200 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="flex flex-col flex-1">
          <span className="text-default-500 text-sm">Uploading</span>
          <span className="font-medium text-default-800">{file.name}</span>

          <div className="bg-default-100 mt-2 rounded-full w-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${progress}%` }}></div>
          </div>

          <span className="mt-1 text-default-400 text-xs">
            {uploading ? `${progress}%` : message}
          </span>
        </div>

        <div>
          {uploading ? (
            <div className="border-3 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin" />
          ) : (
            <div className="font-semibold text-success text-sm">Done</div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UploadFiles;
