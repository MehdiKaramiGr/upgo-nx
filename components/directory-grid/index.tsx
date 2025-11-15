"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardHeader } from "@heroui/react";
import { Folder, File as FileIcon } from "lucide-react";
import { useState, memo } from "react";

type Item = {
  id: string;
  name: string;
  type: "file" | "folder";
};

export default function DirectoryGrid({ items }: { items: Item[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDrop = async (e: DragEndEvent) => {
    const fileId = e.active.id;
    const folderId = e.over?.id;

    setActiveId(null);

    if (!folderId) return;

    await fetch("/api/move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId, folderId }),
    });

    console.log("Moved", fileId, "into", folderId);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDrop}>
      <div className="gap-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 p-4">
        {items.map((item) =>
          item.type === "folder" ? (
            <FolderItem key={item.id} item={item} />
          ) : (
            <FileItem key={item.id} item={item} />
          )
        )}
      </div>
      <DragOverlay>
        {activeId
          ? (() => {
              const activeItem = items.find((i) => i.id === activeId);
              if (!activeItem) return null;
              return (
                <div className="flex items-center space-x-3 bg-white shadow-lg p-3 border rounded-xl">
                  {activeItem.type === "file" ? (
                    <FileIcon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Folder className="w-6 h-6 text-amber-500" />
                  )}
                  <p>{activeItem.name}</p>
                </div>
              );
            })()
          : null}
      </DragOverlay>
    </DndContext>
  );
}

// ---------------- FOLDER ----------------

const FolderItem = memo(function FolderItem({ item }: { item: Item }) {
  const { isOver, setNodeRef } = useDroppable({
    id: item.id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={`cursor-pointer border-2 transition rounded-xl
        ${isOver ? "border-blue-500 bg-blue-100" : "border-transparent"}
      `}>
      <CardHeader className="flex items-center space-x-3">
        <Folder className="w-6 h-6 text-amber-500" />
        <p>{item.name}</p>
      </CardHeader>
    </Card>
  );
});

// ---------------- FILE ----------------

const FileItem = memo(function FileItem({ item }: { item: Item }) {
  const { listeners, attributes, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border rounded-xl cursor-move">
      <CardHeader className="flex items-center space-x-3">
        <FileIcon className="w-5 h-5 text-gray-600" />
        <p>{item.name}</p>
      </CardHeader>
    </Card>
  );
});
