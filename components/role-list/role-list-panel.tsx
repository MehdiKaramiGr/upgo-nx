import { useActions } from "@/framework/access-actions/use-actions";
import { usePages } from "@/framework/app-pages/use-pages";
import { mutateRoleAction } from "@/framework/users/mutate-roles-action";
import { mutateRolePage } from "@/framework/users/mutate-roles-page";
import { roles } from "@/lib/prisma/generated/client";
import { Card, Checkbox, CheckboxGroup } from "@heroui/react";
import React from "react";

const RoleListPanel = ({ role }: { role: roles }) => {
  let queryProps = {
    only_ids: true,
    role_id: role.id,
  };

  const pages = usePages();
  const actions = useActions();

  const rolesPage = usePages(queryProps);
  const rolesAction = useActions(queryProps);

  const mRolePages = mutateRolePage();
  const mRoleActions = mutateRoleAction();

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-primary-900/10 p-4">
        <CheckboxGroup
          value={rolesPage?.data?.map((p) => `${p}`)}
          label="Accessable Pages to the role"
          orientation="horizontal">
          {pages?.data?.map((p) => {
            return (
              <Checkbox
                key={p.id}
                value={`${p.id}`}
                onChange={(e) => {
                  mRolePages.mutate({
                    role_id: role.id,
                    page_id: p.id,
                    active_state: e.target.checked,
                  });
                }}>
                {p.name}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      </Card>
      <Card className="bg-primary-900/10 p-4">
        <CheckboxGroup
          value={rolesAction?.data?.map((p) => `${p}`)}
          label="Accessable Actions to the role"
          orientation="horizontal">
          {actions?.data?.map((a) => {
            return (
              <Checkbox
                key={a.id}
                value={`${a.id}`}
                onChange={(e) => {
                  mRoleActions.mutate({
                    role_id: role.id,
                    action_id: a.id,
                    active_state: e.target.checked,
                  });
                }}>
                {a.name}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      </Card>
    </div>
  );
};

export default RoleListPanel;
