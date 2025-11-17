// @ts-nocheck
"use client";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
// import { useQuery } from "@tanstack/react-query";

export default function ImageCropper({
  src,
  onSave,
  onCancel,
  aspect,
  saveOg,
}: {
  src: string;
  onSave: (blob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
  saveOg?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 50,
    height: aspect ? 50 / aspect : 50,
    x: 25,
    y: 25,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ✅ use real pixel size from original image
    const pixelWidth = crop.width * scaleX;
    const pixelHeight = crop.height * scaleY;

    canvas.width = pixelWidth;
    canvas.height = pixelHeight;

    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      pixelWidth,
      pixelHeight,
      0,
      0,
      pixelWidth,
      pixelHeight
    );
  }, [completedCrop]);

  const handleSave = () => {
    if (!previewCanvasRef.current) return;

    // Determine MIME type from original extension
    const ext = src.split(".").pop()?.toLowerCase();
    const mimeTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const mimeType = mimeTypeMap[ext || ""] || "image/png";

    previewCanvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          let finalBlob = blob;

          if (saveOg && src) {
            // Keep original extension
            const newName = src.split("/").pop() || "cropped." + ext;
            finalBlob = new File([blob], newName, { type: mimeType });
          }

          onSave(finalBlob);
          setOpen(false);
        }
      },
      saveOg ? mimeType : "image/webp", // use original type if saveOg, else webp
      saveOg ? 1 : 0.85 // quality only matters for webp/jpeg
    );
  };
  const handleCancel = () => {
    onCancel();
    setOpen(false);
  };

  // console.log("src", src);

  return (
    <div style={{ direction: "rtl" }}>
      <Dialog open={!!src} onClose={setOpen} className="z-50 relative">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 data-[closed]:opacity-0 transition-opacity data-[enter]:duration-300 data-[leave]:duration-200 data-[leave]:ease-in data-[enter]:ease-out"
        />

        <div className="z-10 fixed inset-0 w-screen overflow-y-auto">
          <div className="flex justify-center items-end sm:items-center p-4 sm:p-0 min-h-full text-center">
            <DialogPanel
              transition
              className="relative bg-gray-800 data-[closed]:opacity-0 shadow-xl sm:my-8 rounded-lg outline outline-1 outline-white/10 -outline-offset-1 sm:w-full sm:max-w-lg max-h-[90vh] overflow-y-auto text-left data-[closed]:sm:scale-95 transition-all data-[closed]:sm:translate-y-0 data-[closed]:translate-y-4 data-[enter]:duration-300 data-[leave]:duration-200 data-[leave]:ease-in data-[enter]:ease-out transform">
              <div className="bg-gray-800 sm:p-6 px-4 pt-5 pb-4 sm:pb-4">
                <DialogTitle as="h3" className="mb-4 font-semibold text-white">
                  برش عکس
                </DialogTitle>
                <div>
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}>
                    <img
                      ref={imgRef}
                      src={src}
                      alt="Source"
                      style={{ maxHeight: "40vh", maxWidth: "100%" }}
                    />
                  </ReactCrop>
                </div>
                {completedCrop && (
                  <div className="mt-4">
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        border: "1px solid #ccc",
                        objectFit: "contain",
                        width: completedCrop.width,
                        height: completedCrop.height,
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="sm:flex sm:flex-row-reverse bg-gray-700/25 px-4 sm:px-6 py-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex justify-center bg-red-500 hover:bg-red-400 sm:ml-3 px-3 py-2 rounded-md w-full sm:w-auto font-semibold text-white text-sm">
                  Save
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={handleCancel}
                  className="inline-flex justify-center bg-white/10 hover:bg-white/20 mt-3 sm:mt-0 px-3 py-2 rounded-md ring-1 ring-white/5 ring-inset w-full sm:w-auto font-semibold text-white text-sm">
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
