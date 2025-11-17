"use client";
import { useCurrentUser } from "@/framework/auth/use-current-user";

import SignInModal from "../signin-modal";

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  User,
  AvatarIcon,
} from "@heroui/react";
import { mutateLogout } from "@/framework/auth/mutate-logout";

const UserBox = () => {
  const { data: user } = useCurrentUser();
  const mLogout = mutateLogout();

  return (
    <>
      {user ? (
        <Popover showArrow placement="bottom">
          <PopoverTrigger>
            <User
              as="button"
              avatarProps={{
                // src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                icon: <AvatarIcon />,
              }}
              className="transition-transform cursor-pointer"
              // description={user.email}
              name={user.full_name}
            />
          </PopoverTrigger>
          <PopoverContent className="p-1">
            <Card
              className="bg-transparent border-none max-w-[300px]"
              shadow="none">
              <CardHeader className="justify-between">
                <div className="flex gap-3">
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    // src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                  >
                    <AvatarIcon />
                  </Avatar>
                  <div className="flex flex-col justify-center items-start">
                    <h4 className="font-semibold text-default-600 text-small leading-none">
                      {user.full_name}
                    </h4>
                    <h5 className="text-default-500 text-small tracking-tight">
                      {user.username}
                    </h5>
                  </div>
                </div>
                <Button
                  className={
                    true
                      ? "bg-transparent text-foreground border-default-200"
                      : ""
                  }
                  color="primary"
                  radius="full"
                  size="sm"
                  variant={true ? "bordered" : "solid"}
                  onPress={() => mLogout.mutate()}>
                  logout
                </Button>
              </CardHeader>
              <CardBody className="px-3 py-0">
                <p className="pl-px text-default-500 text-small">
                  Full-stack developer
                  <span aria-label="confetti" role="img">
                    🎉
                  </span>
                </p>
              </CardBody>
              {/* <CardFooter className="gap-3">
								<div className="flex gap-1">
									<p className="font-semibold text-default-600 text-small">4</p>
									<p className="text-default-500 text-small">Following</p>
								</div>
								<div className="flex gap-1">
									<p className="font-semibold text-default-600 text-small">
										97.1K
									</p>
									<p className="text-default-500 text-small">Followers</p>
								</div>
							</CardFooter> */}
            </Card>
          </PopoverContent>
        </Popover>
      ) : (
        <SignInModal />
      )}
    </>
  );
};

export default UserBox;
