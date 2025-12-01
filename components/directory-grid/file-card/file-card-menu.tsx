import { mutateDeleteFiles } from "@/framework/files/mutate-delete-file";
import { file } from "@/prisma/generated/client";
// import { file } from "@/prisma/generated/client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Button,
  cn,
  addToast,
  useDisclosure,
} from "@heroui/react";
import {
  Copy,
  DownloadIcon,
  FileKeyIcon,
  HistoryIcon,
  MenuIcon,
  ShareIcon,
  Trash2,
} from "lucide-react";

export default function FileCardMenu({
  file,
  makeFilePublicMethods,
  shareMethods,
  canShare,
  canWrite,
}: {
  file: file;
  canShare: boolean;
  canWrite: boolean;

  makeFilePublicMethods: ReturnType<typeof useDisclosure>;
  shareMethods: ReturnType<typeof useDisclosure>;
}) {
  const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";
  const mDelFile = mutateDeleteFiles();

  let dlLink = window.location.origin + `/api/files/download?id=${file.id}`;

  let disabledKeys = ["up_version", "make_public", "copy_public"];
  if (!canShare) {
    disabledKeys.push("make_public", "copy_public", "share");
  }
  if (!canWrite) {
    disabledKeys.push("delete");
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="flat" size="sm" color="secondary" isIconOnly>
            <MenuIcon size="20px" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dropdown menu with description"
          variant="faded"
          disabledKeys={disabledKeys}>
          <DropdownSection showDivider title="Actions">
            <DropdownItem
              key="download"
              description="Download the file"
              startContent={<DownloadIcon className={iconClasses} />}
              href={dlLink}
              target="_blank">
              Download file
            </DropdownItem>
            <DropdownItem
              key="copy_private"
              description="Copy the file link"
              onPress={() => {
                navigator.clipboard.writeText(dlLink);
                addToast({
                  title: "Link Copied",
                  description: "The private link has been copied to clipboard.",
                  color: "success",
                });
              }}
              startContent={<Copy className={iconClasses} />}>
              Copy Private Link
            </DropdownItem>
            <DropdownItem
              key="up_version"
              description="Upload Another Version"
              startContent={<HistoryIcon className={iconClasses} />}>
              Upload Version
            </DropdownItem>
          </DropdownSection>
          <DropdownSection showDivider title="Share">
            <DropdownItem
              key="make_public"
              description="Make the file public"
              onPress={() => {
                makeFilePublicMethods.onOpen();
              }}
              startContent={<FileKeyIcon className={iconClasses} />}>
              Make Public
            </DropdownItem>
            <DropdownItem
              key="copy_public"
              description="Copy the file link"
              startContent={<Copy className={iconClasses} />}>
              Copy Public Link
            </DropdownItem>
            <DropdownItem
              key="share"
              description="Share with others"
              onPress={() => {
                shareMethods.onOpen();
              }}
              startContent={<ShareIcon className={iconClasses} />}>
              Share with users
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Danger zone">
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              description="Permanently delete the file"
              startContent={
                <Trash2 className={cn(iconClasses, "text-danger")} />
              }
              onPress={() => {
                mDelFile.mutate({ id: [file.id] });
              }}>
              Delete file
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
