"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { Button, Card, CardBody, Progress, useDisclosure } from "@heroui/react";
import { useState, useEffect, useCallback, Suspense } from "react";
import FileItem from "./file-card";
import { useUsersFiles } from "@/framework/files/use-users-files";
import UploadFiles from "./upload-files";
import { useQueryClient } from "@tanstack/react-query";
import { FolderItem } from "./folder-item";
import { useAclFiles } from "@/framework/acl/use-acl-files";
import { useCurrentUser } from "@/framework/auth/use-current-user";
import { useFolders } from "@/framework/folder/use-folder";
import FolderModal from "./folder-modal";
import { folder } from "@/prisma/generated/client";
import { mutateMoveFile } from "@/framework/files/mutate-move-file";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function DirectoryGridContent() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingFile, setDraggingFile] = useState(false);

  const [filesUploadQ, setFilesUploadQ] = useState<FileList>();
  const [uploadings, setUploadings] = useState<boolean[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [curIndex, setcurIndex] = useState<number | null>(null);

  const [renameFolder, setRenameFolder] = useState<folder | undefined>();

  const folderModalMethods = useDisclosure();

  const userFiles = useUsersFiles();
  const aclFiles = useAclFiles();
  const queryClient = useQueryClient();
  const curUser = useCurrentUser();
  const folders = useFolders();
  const mMoveFile = mutateMoveFile();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let foid = searchParams.get("foid") || undefined;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleUpload = () => {
    if (!filesUploadQ) return;
    if (curIndex !== null) {
      const file = filesUploadQ[curIndex];

      setUploadings((prev) => {
        const copy = [...prev];
        copy[curIndex] = true;
        return copy;
      });

      setProgress((prev) => {
        const copy = [...prev];
        copy[curIndex] = 0;
        return copy;
      });

      setMessages((prev) => {
        const copy = [...prev];
        copy[curIndex] = "";
        return copy;
      });

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/files/upload");

      xhr.setRequestHeader("x-filename", file.name);
      xhr.setRequestHeader("x-filesize", `${file.size}`);
      xhr.setRequestHeader("x-filememetype", `${file.type}`);
      if (foid) {
        xhr.setRequestHeader("x-folderid", `${foid}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setProgress((prev) => {
            const copy = [...prev];
            copy[curIndex] = percent;
            return copy;
          });
        }
      };

      xhr.onload = () => {
        setUploadings((prev) => {
          const copy = [...prev];
          copy[curIndex] = false;
          return copy;
        });

        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setMessages((prev) => {
            const copy = [...prev];
            copy[curIndex] = `Uploaded successfully! File ID: ${res.fileId}`;
            return copy;
          });
          queryClient.invalidateQueries({
            queryKey: ["files"],
          });
          if (curIndex < filesUploadQ.length) {
            setcurIndex((prev) => (prev ?? 0) + 1);
          } else {
            setcurIndex(null);
          }
        } else {
          setMessages((prev) => {
            const copy = [...prev];
            copy[curIndex] = "Upload failed";
            return copy;
          });
        }
      };

      xhr.onerror = () => {
        setUploadings((prev) => {
          const copy = [...prev];
          copy[curIndex] = false;
          return copy;
        });

        setMessages((prev) => {
          const copy = [...prev];
          copy[curIndex] = "Upload failed";
          return copy;
        });
      };

      xhr.send(file);
    }
  };

  useEffect(() => {
    if (filesUploadQ && curIndex !== null && curIndex < filesUploadQ.length) {
      handleUpload();
    }
  }, [curIndex]);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDrop = async (e: DragEndEvent) => {
    const fileId = e.active.id;
    const folderId = e.over?.id;

    setActiveId(null);

    if (!folderId || folderId == "shared") return;

    mMoveFile.mutate({
      // @ts-ignore
      file_id: fileId,
      // @ts-ignore
      folder_id: folderId == "root" ? null : folderId,
    });
    console.log("Moved", fileId, "into", folderId);
  };

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <div className="p-4 border-default-200 border-b">
          <h2 className="font-semibold text-2xl">My Directory</h2>
          <p className="mt-1 text-default-900">
            Welcome, {curUser?.data?.email || "User"}! Manage your files and
            folders here.
          </p>
        </div>
        <CardBody>
          <div>
            <Progress
              classNames={{
                // base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: "bg-linear-to-r from-pink-500 to-yellow-500",
                label: "tracking-wider font-medium text-default-600",
                value: "text-foreground/60",
              }}
              label="Used Spcae"
              radius="sm"
              showValueLabel={true}
              size="sm"
              value={
                (Number(curUser.data?.storageUsed ?? 0) /
                  Number(curUser.data?.storageLimit ?? 1)) *
                100
              }
            />
            <div className="flex justify-between mt-2">
              <p className="text-default-500">
                {(Number(curUser.data?.storageUsed) / (1024 * 1024)).toFixed(2)}
                {" MB "}/{" "}
                {(Number(curUser.data?.storageLimit) / (1024 * 1024)).toFixed(
                  2
                )}
              </p>
              <p className="text-default-800">
                {(
                  (Number(curUser.data?.storageLimit ?? 0) -
                    Number(curUser.data?.storageUsed ?? 0)) /
                  (1024 * 1024)
                ).toFixed(2)}{" "}
                MB Free
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card
        className="relative p-1 min-h-[60vh]"
        onDragEnter={(e) => {
          setDraggingFile(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          // Prevent flicker when moving between children
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDraggingFile(false);
          }
        }}
        onDrop={async (e) => {
          e.preventDefault();
          setDraggingFile(false);
          const files = e.dataTransfer.files;
          if (!files || files.length === 0) return;
          setFilesUploadQ(files);

          Array.from(files).map((f) => {
            setUploadings((prev) => [...prev, true]);
            setProgress((prev) => [...prev, 0]);
            setMessages((prev) => [...prev, ""]);
          });

          setcurIndex(0);
        }}>
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDrop}>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
            {draggingFile && (
              <div className="z-20 absolute inset-0 flex justify-center items-center bg-blue-500/20 backdrop-blur-md border-4 border-blue-500 rounded-xl font-semibold text-blue-700 text-lg pointer-events-none">
                Drop files to upload
              </div>
            )}
            <div className="col-span-full">
              <p className="font-semibold text-lg">Folders</p>
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-6">
                {foid && (
                  <FolderItem
                    variant="back"
                    key="back"
                    item={{
                      id: "root",
                      name: ".. (Go Up)",
                      created_at: new Date(),
                      updated_at: new Date(),
                      owner_id: "",
                      parent_id: null,
                    }}
                    handleNav={() => {
                      router.push(pathname); // removes foid
                    }}
                    onEdit={undefined}
                  />
                )}
                {(folders?.data?.filter((f) => f.parent_id == foid) ?? []).map(
                  (item) => (
                    <FolderItem
                      key={item.id}
                      item={item}
                      onEdit={(item) => {
                        setRenameFolder(item);
                        folderModalMethods.onOpen();
                      }}
                      handleNav={() => {
                        router.push(
                          pathname + "?" + createQueryString("foid", item.id)
                        );
                      }}
                    />
                  )
                )}
                {!foid && aclFiles?.data && aclFiles?.data?.length > 0 && (
                  <FolderItem
                    variant="shared"
                    key="back"
                    item={{
                      id: "shared",
                      name: "Shared files",
                      created_at: new Date(),
                      updated_at: new Date(),
                      owner_id: "",
                      parent_id: null,
                    }}
                    handleNav={() => {
                      router.push(
                        pathname + "?" + createQueryString("foid", "shared")
                      );
                    }}
                    onEdit={undefined}
                  />
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="light"
                  color="secondary"
                  onPress={() => {
                    setRenameFolder(undefined);
                    folderModalMethods.onOpen();
                  }}>
                  Create New Folder
                </Button>
              </div>
            </div>

            {foid !== "shared" && (
              <>
                <div className="col-span-full">
                  <p className="font-semibold text-lg">Files</p>
                </div>

                {userFiles?.data
                  ?.filter((f) => f.folder_id == foid)
                  ?.map((f) => {
                    return (
                      <FileItem
                        key={f.id}
                        item={f}
                        canShare={true}
                        canWrite={true}
                      />
                    );
                  })}
              </>
            )}
            {foid == "shared" && (
              <>
                <div className="col-span-full">
                  <p className="font-semibold text-lg">Shared Files</p>
                </div>

                {aclFiles?.data?.map((acl) => {
                  return (
                    <div>
                      <FileItem
                        key={acl.id}
                        item={acl.file}
                        canShare={acl.can_share}
                        canWrite={acl.can_write}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <DragOverlay>
            {activeId
              ? (() => {
                  const activeItem = userFiles?.data?.find(
                    (f) => f.id == activeId
                  );
                  if (!activeItem) return null;
                  return (
                    <div className="bg-primary-900/5 dark:bg-primary-400/5 shadow-lg backdrop-blur-md p-1 border rounded-xl">
                      <FileItem
                        item={activeItem}
                        canShare={true}
                        canWrite={true}
                      />
                    </div>
                  );
                })()
              : null}
          </DragOverlay>
        </DndContext>
        {filesUploadQ !== undefined ? (
          <div className="mx-5 mt-4 p-4 border-primary-900/30 border-t">
            <div className="flex justify-between">
              <h3 className="mb-2 font-semibold">Files to Upload:</h3>
              <Button
                size="sm"
                color="secondary"
                className="text-default"
                onPress={() => {
                  setFilesUploadQ(undefined);
                  setUploadings([]);
                  setProgress([]);
                  setMessages([]);
                  setcurIndex(null);
                }}>
                Clear
              </Button>
            </div>
            <div className="gap-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array.from(filesUploadQ).map((file, index) => (
                <UploadFiles
                  key={index}
                  file={file}
                  progress={progress[index]}
                  message={messages[index]}
                  uploading={uploadings[index]}
                />
              ))}
            </div>
          </div>
        ) : undefined}
      </Card>
      <FolderModal {...folderModalMethods} renameFolder={renameFolder} />
    </div>
  );
}

export default function DirectoryGrid() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DirectoryGridContent />
    </Suspense>
  );
}
