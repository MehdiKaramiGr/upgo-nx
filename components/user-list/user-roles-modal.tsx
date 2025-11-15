// useRoles
import { mutateUsersRole } from "@/framework/users/mutate-users-role";
import { useRoles } from "@/framework/users/use-roles";
import { useUsersRoles } from "@/framework/users/use-users-roles";
import { users } from "@/lib/prisma/generated/client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Spinner,
} from "@heroui/react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Radio,
  RadioGroup,
} from "@heroui/react";

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "action",
    label: "ACTION",
  },
];

interface UserRolesModalProps {
  onOpenChange: () => void;
  user: users | null;
}

export default function UserRolesModal({
  onOpenChange,
  user,
}: UserRolesModalProps) {
  let isOpen = user != null;

  const roles = useRoles();
  const usersRoles = useUsersRoles(user?.id ? { id: user?.id } : undefined);
  const mUsersRoles = mutateUsersRole();

  return (
    <>
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop:
            "bg-linear-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-1">
                <p>User's Roles </p>
                <Spinner
                  size="sm"
                  variant="gradient"
                  className="opacity-0 aria-busy:opacity-100 transition-all duration-200"
                  aria-busy={mUsersRoles.isPending}
                />
              </ModalHeader>
              <ModalBody>
                <Table aria-label="roles of the user">
                  <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    <TableColumn>ACTION</TableColumn>
                  </TableHeader>

                  <TableBody>
                    {(roles.data ?? []).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.name}</TableCell>

                        <TableCell>
                          <Checkbox
                            size="md"
                            isSelected={usersRoles?.data?.includes(item.id)}
                            isDisabled={mUsersRoles?.isPending}
                            onChange={() => {
                              if (user?.id) {
                                mUsersRoles.mutate({
                                  user_id: user?.id,
                                  role_id: item.id,
                                  active_state: !usersRoles?.data?.includes(
                                    item.id
                                  ),
                                });
                              }
                            }}>
                            access
                          </Checkbox>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
