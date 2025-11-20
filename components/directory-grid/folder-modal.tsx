import { mutateFolder } from "@/framework/folder/mutate-folder";
import { folder } from "@/lib/prisma/generated/client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@heroui/react";
import {
  FolderArchiveIcon,
  FolderEditIcon,
  LockIcon,
  MailOpenIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function FolderModal({
  isOpen,
  onOpen,
  onOpenChange,
  renameFolder,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  renameFolder?: folder;
}) {
  const mFolder = mutateFolder();
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (renameFolder?.id) {
      form.reset({
        name: renameFolder.name,
      });
    }
  }, [renameFolder?.id]);

  return (
    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={form.handleSubmit((data) => {
                let payload: { name: string; id?: string } = {
                  name: data.name,
                };
                if (renameFolder?.id) {
                  payload = { ...payload, id: renameFolder.id };
                }
                mFolder.mutate(payload);
                onOpen();
              })}>
              <ModalHeader className="flex flex-col gap-1">
                {renameFolder?.id ? "Rename Folder" : "Create Folder"}
              </ModalHeader>
              <ModalBody>
                <Input
                  endContent={
                    <FolderEditIcon className="text-default-400 text-2xl pointer-events-none shrink-0" />
                  }
                  label="Name"
                  placeholder="Enter the name of the folder"
                  variant="bordered"
                  {...form.register("name", {
                    required: true,
                  })}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Save
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
