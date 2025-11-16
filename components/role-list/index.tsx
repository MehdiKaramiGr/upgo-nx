import React from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { useRoles } from "@/framework/users/use-roles";
import RoleListPanel from "./role-list-panel";

const RoleList = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["1"]));

  const roles = useRoles();

  return (
    <Accordion
      variant="splitted"
      selectedKeys={selectedKeys}
      // @ts-ignore
      onSelectionChange={setSelectedKeys}>
      {(roles?.data ?? [])?.map((r) => {
        let isOpen = selectedKeys.has(r.id.toString());
        return (
          <AccordionItem
            key={r.id}
            aria-label={r.name}
            title={r.name}
            subtitle={r.description || "No description"}>
            {isOpen && <RoleListPanel role={r} />}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default RoleList;
