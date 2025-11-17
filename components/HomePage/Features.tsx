"use client";

import {
  CloudUpload,
  Shield,
  FolderTree,
  Users,
  Link2,
  History,
} from "lucide-react";

const features = [
  {
    icon: CloudUpload,
    title: "File Upload & Management",
    description:
      "Upload files with support for various formats, secure storage in MinIO, and metadata management for each file.",
  },
  {
    icon: Shield,
    title: "Advanced Access Control",
    description:
      "ACL system for defining access levels (read, write, share) to files for each user individually.",
  },
  {
    icon: FolderTree,
    title: "Folder Organization",
    description:
      "Create a tree structure of folders for better file organization with unlimited subfolder capabilities.",
  },
  {
    icon: Users,
    title: "Role & User Management",
    description:
      "Complete user management system with different roles, access control to pages and actions based on user roles.",
  },
  {
    icon: Link2,
    title: "Public Sharing",
    description:
      "Create public links with expiration dates and download limits for easy file sharing.",
  },
  {
    icon: History,
    title: "File Versioning",
    description:
      "Save different versions of each file and rollback to previous versions to prevent data loss.",
  },
];

interface FeaturesProps {
  isVisible: boolean;
}

export function Features({ isVisible }: FeaturesProps) {
  return (
    <div className="lg:col-span-2">
      <ul
        role="list"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 dark:text-gray-400">
        {features.map((feature, index) => (
          <li
            key={feature.title}
            className={`flex gap-x-4 transition-all duration-600 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${(index + 1) * 100}ms` }}>
            <feature.icon
              aria-hidden="true"
              className="mt-1 size-5 flex-none text-indigo-600 dark:text-indigo-400"
            />
            <span>
              <strong className="font-semibold text-black dark:text-white">
                {feature.title}
              </strong>
              <br />
              {feature.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
