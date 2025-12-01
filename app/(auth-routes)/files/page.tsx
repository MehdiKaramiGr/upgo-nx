"use client";
import DirectoryGrid from "@/components/directory-grid";

const FilesPage = () => {
  return (
    <div className="p-5">
      <h2 className="mb-2 text-3xl">Files Panel</h2>

      <DirectoryGrid />
    </div>
  );
};

export default FilesPage;

// FilesPage.Layout = AuthLayout;
