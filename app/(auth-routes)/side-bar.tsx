"use client";
// @ts-ignore: allow side-effect CSS import without type declarations
import ScrollProvider from "./scroll-provider";
import Link from "next/link";

import { usePages } from "@/framework/app-pages/use-pages";
import UserBox from "@/components/header/user-box";
import { usePathname } from "next/navigation";
import {
  FolderIcon,
  LayoutDashboardIcon,
  Share2Icon,
  Users2Icon,
} from "lucide-react";
import { ReactNode } from "react";

let iconMap: { [key: number]: ReactNode } = {
  1: <LayoutDashboardIcon />,
  2: <FolderIcon />,
  3: <Users2Icon />,
  4: <Share2Icon />,
};

export default function SideBar({}) {
  const pages = usePages({
    cur_users: true,
  });

  const path = usePathname();

  return (
    <ScrollProvider className="col-span-0 md:col-span-2 lg:col-span-3 bg-gray-100/90 dark:bg-black/90 shadow m-2 p-2 rounded-2xl h-[calc(100vh-7rem)]">
      <div className="flex flex-col items-center rounded h-full overflow-hidden text-gray-400">
        <div className="px-2 w-full">
          <div className="flex flex-col items-center mt-3 w-full">
            {pages?.data?.map((p) => {
              return (
                <Link
                  aria-selected={path?.includes(p.path)}
                  key={p.id}
                  className="flex items-center aria-selected:bg-primary-950/10 hover:bg-primary-950/40 mt-2 px-3 rounded w-full h-12 hover:text-white"
                  href={p.path}>
                  {iconMap?.[p.id]}
                  <span className="ml-2 font-medium text-sm">{p.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="mt-auto">
          <UserBox fullTitle />
        </div>
      </div>
    </ScrollProvider>
  );
}
