"use client";

import Link from "next/link";
import { usePages } from "@/framework/app-pages/use-pages";
import { Button } from "@heroui/react";
import { FileIcon } from "lucide-react";

const HeaderLinks = () => {
  const pages = usePages({
    cur_users: true,
  });

  return (
    <nav className="space-x-4">
      {pages?.data
        ?.filter((p) => p.id == 2)
        ?.map((page) => (
          <Link
            key={page.id}
            href={`${page.path}`}
            className="font-bold text-sm hover:underline">
            <Button isIconOnly variant="flat" radius="full">
              <FileIcon />
            </Button>
          </Link>
        ))}
    </nav>
  );
};

export default HeaderLinks;
