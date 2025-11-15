// /app/sandbox/page.tsx
"use client";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleUpload = () => {
    if (!file) {
      setMessage("Select a file first");
      return;
    }

    setUploading(true);
    setProgress(0);
    setMessage("");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload");

    xhr.setRequestHeader("x-filename", file.name);
    xhr.setRequestHeader("x-filesize", `${file.size}`);
    xhr.setRequestHeader("x-filememetype", `${file.type}`);
    if (false) {
      xhr.setRequestHeader("x-folderid", ``);
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        setMessage(`Uploaded successfully! File ID: ${res.fileId}`);
      } else {
        setMessage("Upload failed");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setMessage("Upload failed");
    };

    xhr.send(file);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>MinIO Upload Test with Progress</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{ padding: "10px 18px", marginTop: 20, cursor: "pointer" }}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploading && (
        <div style={{ marginTop: 10 }}>
          Progress: {progress.toFixed(2)}%
          <div
            style={{
              width: "100%",
              height: 10,
              background: "#eee",
              marginTop: 5,
            }}>
            <div
              style={{
                width: `${progress}%`,
                height: 10,
                background: "green",
              }}
            />
          </div>
        </div>
      )}

      {message && (
        <p style={{ marginTop: 20, fontWeight: "bold" }}>{message}</p>
      )}
      <img
        src={"/api/files/download?id=fa830202-767a-455d-b207-ed1f25d30d2e"}
        alt="test"
      />
    </div>
  );
}
