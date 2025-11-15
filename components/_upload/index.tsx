"use client";

import http from "@framework/utils/http";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ImageCropper from "./ImageCropper";
import { useQuery } from "@tanstack/react-query";
import { FileTypes, vFileMeta } from "@prisma/client";

const CHUNK_SIZE = 0.5 * 1024 * 1024; // 0.5MB

interface ChunkUploaderProps {
	validTypes?: string[];
	aspectRatio?: number;
	fileType: number;
	linkChain: number; // e.g. if uploading a profile pic, this would be the user ID
	onUploadCallBack: (url: string) => void;
	saveOg?: boolean;
}

export default function Upload({
	validTypes,
	aspectRatio = 13.4 / 9,
	fileType,
	linkChain,
	onUploadCallBack,
	saveOg,
}: ChunkUploaderProps) {
	const [progress, setProgress] = useState<Record<string, number>>({});
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [cropIndex, setCropIndex] = useState<number | null>(null); // which file is being cropped

	const fileTypeQ = useQuery<FileTypes>({
		queryKey: ["fileType", fileType],
		queryFn: () => {
			return http.get(`/file/filetype?ID=${fileType}`).then((res) => res.data);
		},
		enabled: !!fileType,
	});

	// console.log("fileTypeQ?.data", fileTypeQ?.data);

	const uploadFile = async (file: File) => {
		const fileId = uuidv4();
		const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

		for (let i = 0; i < totalChunks; i++) {
			const start = i * CHUNK_SIZE;
			const end = Math.min(start + CHUNK_SIZE, file.size);
			const chunk = file.slice(start, end);

			try {
				let res = await http.post(
					`file/upload?fileId=${fileId}&chunkIndex=${i}&totalChunks=${totalChunks}&filename=${encodeURIComponent(
						file.name
					)}&type=${file.type}&fileType=${fileType || ""}&linkChain=${
						linkChain || ""
					}`,
					chunk,
					{ headers: { "Content-Type": "application/octet-stream" } }
				);

				if (res?.data?.ezPath) {
					onUploadCallBack(res?.data?.ezPath);
				}

				setProgress((prev) => ({
					...prev,
					[file.name]: Math.round(((i + 1) / totalChunks) * 100),
				}));
			} catch (err) {
				console.error("Upload failed for chunk", i, err);
				alert(`Failed uploading ${file.name} (chunk ${i + 1}/${totalChunks})`);
				break;
			}
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			let selected = Array.from(e.target.files);

			if (validTypes?.length) {
				selected = selected.filter((file) => validTypes.includes(file.type));
			}

			setFiles(selected);
			setPreviews(selected.map((file) => URL.createObjectURL(file)));
		}
	};

	const handleCropSave = (croppedBlob: Blob, index: number) => {
		let originalName = files[index].name;
		let newName = originalName;

		if (croppedBlob instanceof Blob && croppedBlob.type.includes("webp")) {
			let newNameArry = originalName?.split(".");
			newNameArry.pop();
			newNameArry.push(".webp");
			newName = newNameArry.join("");
		}

		const croppedFile = new File([croppedBlob], newName, {
			type: croppedBlob.type || files[index].type,
		});

		// replace file
		const newFiles = [...files];
		newFiles[index] = croppedFile;
		setFiles(newFiles);

		// replace preview
		const newPreviews = [...previews];
		newPreviews[index] = URL.createObjectURL(croppedFile);
		setPreviews(newPreviews);

		setCropIndex(null);
	};

	const handleUploadAll = () => {
		files.forEach((file) => uploadFile(file));
	};
	// console.log("cropIndex", cropIndex);
	return (
		<div className=" mx-auto p-6 bg-slate-900/5  border rounded-lg shadow-lg flex flex-col items-center shadow-xl shadow-cyan-500/50">
			{/* title for the file input */}
			<div className="w-full border-b mb-4">
				<h2 className="text-md text-right font-light -mt-2 mb-2">
					{"بارگزاری " + (fileTypeQ?.data?.FileTypeName || "Upload Files")}
				</h2>
			</div>
			<label className="block w-full cursor-pointer">
				<span className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
					انتخاب فایل
				</span>
				<input
					type="file"
					multiple={fileTypeQ?.data?.Multi}
					accept={fileTypeQ?.data?.AcceptableTypes ?? undefined}
					onChange={handleChange}
					className="hidden"
					// filetypes
				/>
			</label>

			{/* Previews */}
			{previews.length > 0 && (
				<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3 mt-4">
					{previews.map((src, i) => (
						<div key={i} className="relative w-64">
							<img
								src={src}
								alt={`preview-${i}`}
								className="w-full h-full object-cover rounded"
							/>
							<button
								className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs"
								onClick={() => setCropIndex(i)}
							>
								برش
							</button>
							<p className="text-xs text-center truncate">{files[i]?.name}</p>
							{progress[files[i]?.name] && (
								<div className="absolute top-0 left-0 right-0 bg-black/50 text-white text-xs">
									{`در حال بارگذاری: ${progress[files[i]?.name]}%`}
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{/* Upload button */}
			{files.length > 0 && (
				<button
					onClick={handleUploadAll}
					className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
				>
					Upload All
				</button>
			)}

			{/* Crop Modal */}
			{cropIndex !== null && aspectRatio ? (
				<ImageCropper
					src={previews[cropIndex]}
					aspect={aspectRatio}
					onSave={(blob) => handleCropSave(blob, cropIndex)}
					onCancel={() => setCropIndex(null)}
					saveOg={saveOg}
				/>
			) : null}
		</div>
	);
}
