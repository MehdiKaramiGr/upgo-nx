import { mutateToggleAcl } from "@/framework/acl/mutate-toggle-acl";
import { useAcl } from "@/framework/acl/use-acl";
import { useCurrentUser } from "@/framework/auth/use-current-user";
import { useUserList } from "@/framework/users/use-user-list";
import { file } from "@/lib/prisma/generated/client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TableHeader,
  Table,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  Spinner,
} from "@heroui/react";
import { CircleOff, DeleteIcon, Lock, Share2Icon } from "lucide-react";

export default function FileCardShare({
  isOpen,
  onOpen,
  onOpenChange,
  file,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (open: boolean) => void;
  file?: file;
}) {
  const usersList = useUserList();
  const me = useCurrentUser();
  const fileAcl = useAcl(file?.id ? { file_id: file?.id } : undefined);
  const mAcl = mutateToggleAcl();

  return (
    <div>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p>
                  Share{" "}
                  <span className="inline text-primary">{file?.name}</span> with
                  others
                </p>
              </ModalHeader>
              <ModalBody>
                <Table aria-label="Simple user table">
                  <TableHeader>
                    <TableColumn>Has Access</TableColumn>

                    <TableColumn>Status</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {(
                      usersList?.data?.filter(
                        ({ id }) => me?.data?.id !== id
                      ) ?? []
                    ).map((u) => {
                      let hasAccess = fileAcl?.data?.find(
                        (acl) => acl.user_id == u.id
                      );
                      console.log("hasAccess", hasAccess);
                      return (
                        <TableRow key={u.id}>
                          <TableCell>{u.email}</TableCell>

                          <TableCell>
                            {hasAccess !== undefined ? (
                              <Chip color="success">Shared with</Chip>
                            ) : (
                              <Chip color="danger">Not shared</Chip>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Tooltip content="View User">
                                <Button
                                  radius="md"
                                  size="sm"
                                  color={
                                    hasAccess == undefined
                                      ? "success"
                                      : "danger"
                                  }
                                  endContent={
                                    mAcl?.isPending ? (
                                      <Spinner size="sm" />
                                    ) : hasAccess == undefined ? (
                                      <Share2Icon size="15px" />
                                    ) : (
                                      <CircleOff size="15px" />
                                    )
                                  }
                                  onPress={() => {
                                    if (file != undefined) {
                                      mAcl?.mutate({
                                        file_id: file.id,
                                        user_id: u.id,
                                        active_state:
                                          hasAccess == undefined ? true : false,
                                      });
                                    }
                                  }}>
                                  {hasAccess == undefined
                                    ? "Share"
                                    : "Stop Sharing"}
                                </Button>
                              </Tooltip>

                              <Tooltip content="Edit User Access">
                                <Button
                                  isIconOnly
                                  color="secondary"
                                  onPress={() => {
                                    // setCurUser(u);
                                  }}>
                                  <Lock />
                                </Button>
                              </Tooltip>

                              <Tooltip
                                content={
                                  u.is_active ? "Disable User" : "Enable User"
                                }>
                                <Button
                                  isIconOnly
                                  color={u.is_active ? "danger" : "success"}
                                  className="transition-all duration-300"
                                  onPress={() => {
                                    // mChangeUserActiveState.mutate({
                                    //   id: u.id,
                                    //   active_state: !u.is_active,
                                    // });
                                  }}></Button>
                              </Tooltip>
                              <Tooltip content="Delete User">
                                <Button isIconOnly color="danger" isDisabled>
                                  <DeleteIcon />
                                </Button>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Sign in
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
