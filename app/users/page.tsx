"use client";
import RoleList from "@/components/role-list";
import UserList from "@/components/user-list";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import React from "react";

const users = () => {
  return (
    <div className="p-4">
      <h4 className="mb-4 text-3xl">Manage Users</h4>

      <div className="flex flex-col w-full">
        <Tabs aria-label="Options">
          <Tab key="users" title="User's List">
            <UserList />
          </Tab>
          <Tab key="roles" title="Role's List">
            <RoleList />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default users;
