"use client";

import Link from "next/link";
import { usePages } from "@/framework/app-pages/use-pages";

const HeaderLinks = () => {
  const pages = usePages({
    cur_users: true,
  });
  return (
    <nav className="space-x-4">
      {pages?.data?.map((page) => (
        <Link
          key={page.id}
          href={`${page.path}`}
          className="font-bold text-sm hover:underline">
          {page.name}
        </Link>
      ))}
    </nav>
  );
};

export default HeaderLinks;
