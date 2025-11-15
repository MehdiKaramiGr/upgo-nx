"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Chip,
  Spinner,
} from "@heroui/react";
import {
  EyeIcon,
  Lock,
  DeleteIcon,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import UserRolesModal from "./user-roles-modal";
import { useUserList } from "@/framework/users/use-user-list";
import { mutateChangeUserActiveState } from "@/framework/users/mutate-change-user-active-state";

export default function UserList() {
  const [curUser, setCurUser] = useState<any>(null);

  const usersList = useUserList();
  const mChangeUserActiveState = mutateChangeUserActiveState();

  return (
    <>
      {/* Modal */}
      <UserRolesModal user={curUser} onOpenChange={() => setCurUser(null)} />

      {/* SIMPLE STATIC TABLE */}
      <Table aria-label="Simple user table">
        <TableHeader>
          <TableColumn>Username</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Storage Used</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>

        <TableBody>
          {(usersList?.data ?? []).map((u) => {
            return (
              <TableRow key={u.id}>
                <TableCell>{u.full_name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  {(Number(u.storageUsed) / (1024 * 1024)).toFixed(2)} MB
                </TableCell>
                <TableCell>
                  {u.is_active ? (
                    <Chip color="success">Active</Chip>
                  ) : (
                    <Chip color="danger">Not Active</Chip>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip content="View User">
                      <Button isIconOnly color="primary" isDisabled>
                        <EyeIcon />
                      </Button>
                    </Tooltip>

                    <Tooltip content="Edit User Access">
                      <Button
                        isIconOnly
                        color="secondary"
                        onPress={() => {
                          setCurUser(u);
                        }}>
                        <Lock />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      content={u.is_active ? "Disable User" : "Enable User"}>
                      <Button
                        isIconOnly
                        color={u.is_active ? "danger" : "success"}
                        className="transition-all duration-300"
                        onPress={() => {
                          mChangeUserActiveState.mutate({
                            id: u.id,
                            active_state: !u.is_active,
                          });
                        }}>
                        {mChangeUserActiveState.isPending ? (
                          <Spinner
                            variant="gradient"
                            size="sm"
                            color={!u.is_active ? "danger" : "success"}
                          />
                        ) : u.is_active ? (
                          <ShieldBan />
                        ) : (
                          <ShieldCheck />
                        )}
                      </Button>
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
    </>
  );
}
