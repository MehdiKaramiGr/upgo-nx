"use client";

import { mutateDeleteFolder } from "@/framework/folder/mutate-delete-folder";
import { folder } from "@/prisma/generated/client";
import { useDroppable } from "@dnd-kit/core";
import {
  Button,
  Card,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Folder, MenuIcon, PenIcon, Trash2Icon, TrashIcon } from "lucide-react";
import { memo } from "react";

export const FolderItem = function FolderItem({
  item,
  onEdit,
  handleNav,
  variant = "default",
}: {
  item: folder;
  onEdit?: (item?: folder) => void;
  handleNav: () => void;
  variant?: "default" | "shared" | "back";
}) {
  const mDeleteFolder = mutateDeleteFolder();
  const { isOver, setNodeRef } = useDroppable({
    id: item.id,
  });
  const items = [
    {
      key: "rename",
      label: "Rename Folder",
      description: "Change the folder name",
      startContent: <PenIcon />,
      action: () => {
        onEdit !== undefined && onEdit(item);
      },
    },

    {
      key: "delete_wf",
      label: "Delete Recursive",
      description: "Delete the folder with the items inside",
      startContent: <TrashIcon />,

      action: () => {
        mDeleteFolder.mutate({
          id: item.id,
          recursive: true,
        });
      },
    },
    {
      key: "delete",
      label: "Delete Folder",
      description: "Delete the folder and Move the items to the main Dir",
      startContent: <Trash2Icon />,
      action: () => {
        mDeleteFolder.mutate({
          id: item.id,
          recursive: false,
        });
      },
    },
  ];

  return (
    <Card
      ref={setNodeRef}
      className={`cursor-pointer relative group  border-2 transition duration-0  rounded-xl
        ${isOver ? "border-blue-500 bg-blue-100" : "border-transparent"}
      `}>
      <CardHeader
        className="flex items-center space-x-3"
        onClick={() => {
          handleNav();
        }}>
        <Folder
          className={`w-6 h-6 ${
            variant == "back"
              ? "text-emerald-500"
              : variant == "shared"
              ? "text-pink-600"
              : "text-amber-500"
          }`}
        />
        <p>{item.name}</p>
      </CardHeader>

      <div className="bottom-1 z-10 absolute flex gap-1 opacity-0 group-hover:opacity-100 transition duration-300 end-1">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="scale-85"
              size="sm"
              isIconOnly>
              <MenuIcon />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions" items={items}>
            {(item) => (
              <DropdownItem
                key={item.key}
                className={item.key.includes("delete") ? "text-danger" : ""}
                onPress={item?.action ? item.action : undefined}
                color={item.key === "delete" ? "danger" : "default"}
                description={item.description}
                startContent={item?.startContent}>
                {item.label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    </Card>
  );
};
