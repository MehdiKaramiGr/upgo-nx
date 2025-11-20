import DirectoryGrid from "@/components/directory-grid";
import { Card } from "@components/ui/card";
import React from "react";

const items = [
  { id: "f1", name: "Projects", type: "folder" },
  { id: "f2", name: "Music", type: "folder" },
  { id: "file-1", name: "photo.png", type: "file" },
  { id: "file-2", name: "notes.txt", type: "file" },
];

const FilesPage = () => {
  return (
    <div className="p-5">
      <h2 className="mb-2 text-3xl">Files Panel</h2>

      <DirectoryGrid items={items} />
    </div>
  );
};

export default FilesPage;
