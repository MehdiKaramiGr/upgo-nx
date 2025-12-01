import { mutateAclAccess } from "@/framework/acl/mutate-acl-access";
import { mutateToggleAcl } from "@/framework/acl/mutate-toggle-acl";
import { useAcl } from "@/framework/acl/use-acl";
import { useCurrentUser } from "@/framework/auth/use-current-user";
import { useUserList } from "@/framework/users/use-user-list";
import { file } from "@/prisma/generated/client";
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
import { CircleOff, DeleteIcon, Lock, PenIcon, Share2Icon } from "lucide-react";

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
  const mAclAccess = mutateAclAccess();

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
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Has Access</TableColumn>
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
                          <TableCell>
                            {hasAccess !== undefined ? (
                              <Chip color="success" variant="dot">
                                Shared{" "}
                              </Chip>
                            ) : (
                              <Chip color="danger" variant="dot">
                                Not shared
                              </Chip>
                            )}
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
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
                                    ? "Grant View Access"
                                    : "Deny View Access"}
                                </Button>
                              </Tooltip>

                              <Tooltip content="Edit User Access">
                                <Button
                                  radius="md"
                                  // isIconOnly
                                  size="sm"
                                  isDisabled={hasAccess == undefined}
                                  color={
                                    hasAccess?.can_write ? "danger" : "success"
                                  }
                                  onPress={() => {
                                    mAclAccess.mutate({
                                      acl_id: hasAccess!.id,
                                      permission: "write",
                                      active_state: !hasAccess?.can_share,
                                    });
                                  }}
                                  endContent={<PenIcon size="15px" />}>
                                  {hasAccess?.can_write
                                    ? "Deny Write Access"
                                    : "Grant Write Access"}
                                </Button>
                              </Tooltip>

                              <Tooltip content="Edit User Access">
                                <Button
                                  radius="md"
                                  // isIconOnly
                                  size="sm"
                                  isDisabled={hasAccess == undefined}
                                  color={
                                    hasAccess?.can_share ? "danger" : "success"
                                  }
                                  onPress={() => {
                                    mAclAccess.mutate({
                                      acl_id: hasAccess!.id,
                                      permission: "share",
                                      active_state: !hasAccess?.can_share,
                                    });
                                  }}
                                  endContent={<PenIcon size="15px" />}>
                                  {hasAccess?.can_share
                                    ? "Deny Share Access"
                                    : "Grant Share Access"}
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
