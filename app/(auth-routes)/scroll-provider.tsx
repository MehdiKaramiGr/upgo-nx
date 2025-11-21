"use client";

import { ScrollShadow } from "@heroui/react";

export default function ScrollProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <ScrollShadow className={className}>{children}</ScrollShadow>;
}
