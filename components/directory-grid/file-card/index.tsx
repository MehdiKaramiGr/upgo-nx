import { file } from "@/lib/prisma/generated/client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { FileIcon, ImageIcon, VideoIcon } from "lucide-react";
import { memo } from "react";
import FileCardMenu from "./file-card-menu";
import FileCardMakePublic from "./file-card-make-public";
import FileCardShare from "./file-card-share";

const FileItem = memo(function FileItem({ item }: { item: file }) {
  const { listeners, attributes, setNodeRef, transform } = useDraggable({
    id: item.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  const makeFilePublicMethods = useDisclosure();
  const shareMethods = useDisclosure();

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        // isFooterBlurre
        className="bg-primary-300/30 dark:bg-primary-300/20 border border-primary-300/30 dark:border-slate-600/20 rounded-xl duration-75 cursor-move">
        <CardBody className="relative p-0 overflow-visible">
          {item.mime_type?.includes("image") ? (
            <Image
              alt={item.name}
              className="border-secondary-600/70 border-b w-full h-[200px] object-cover"
              radius="none"
              shadow="sm"
              src={`api/files/download?id=${item.id}&thm=true`}
              width="100%"
            />
          ) : (
            <div className="flex justify-center items-center bg-slate-300 border-secondary-200/70 border-b w-full h-[200px] object-cover">
              <VideoIcon className="text-secondary-500" size="90px" />
            </div>
          )}
          <div className="top-1 z-10 absolute start-1">
            {" "}
            <FileCardMenu
              file={item}
              makeFilePublicMethods={makeFilePublicMethods}
              shareMethods={shareMethods}
            />
          </div>
        </CardBody>

        <CardFooter className="flex gap-3 text-small">
          <ImageIcon className="text-secondary-500" />
          <Tooltip
            content={
              <div className="flex flex-col gap-1">
                <b className="text-xs line-clamp-1">{item.name}</b>
                <p className="text-xs line-clamp-1">{item.size}</p>
              </div>
            }>
            <b className="text-xs line-clamp-1">{item.name}</b>
          </Tooltip>

          {/* <p className="text-default-500">{item.size}</p> */}
        </CardFooter>
      </Card>
      {makeFilePublicMethods?.isOpen && (
        <FileCardMakePublic {...makeFilePublicMethods} file={item} />
      )}
      {shareMethods?.isOpen && <FileCardShare {...shareMethods} file={item} />}
    </>
  );
});

export default FileItem;
