"use client";

import { GitHubStarsButton } from "@/components/Shadcn/GitHubStarsButton";

export function GithubBadge() {
  return (
    <GitHubStarsButton
      inViewOnce={false}
      username="MehdiKaramiGr"
      repo="upgo-nx"
      className="bg-default-200 absolute top-0 right-0 m-4 text-sm"
      onClick={(event) => event.preventDefault()}
    />
  );
}
