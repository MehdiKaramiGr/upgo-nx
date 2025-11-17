"use client";

import { GitHubStarsButton } from "@/components/Shadcn/GitHubStarsButton";

export function GithubBadge() {
  return (
    <GitHubStarsButton
      inViewOnce={false}
      username="MehdiKaramiGr"
      repo="upgo-nx"
      className=" absolute top-0 right-0 m-4 text-sm bg-primary-800/60 dark:bg-primary-300/50 transition-all duration-500 "
      onClick={(event) => event.preventDefault()}
    />
  );
}
