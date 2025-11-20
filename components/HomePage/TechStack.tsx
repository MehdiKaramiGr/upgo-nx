import { CloudUpload, Server, Database, Layout, Lock, Box } from "lucide-react";

const techStack = [
  { name: "Next.js 16", icon: Server },
  { name: "React 19", icon: Box },
  { name: "Prisma ORM", icon: Database },
  { name: "PostgreSQL", icon: Database },
  { name: "MinIO", icon: CloudUpload },
  { name: "Tailwind CSS", icon: Layout },
  { name: "JWT Auth", icon: Lock },
];

export function TechStack() {
  return (
    <div className="lg:col-span-2 mt-6 w-full overflow-hidden opacity-80">
      <div className="flex gap-3 lg:gap-6 animate-scroll">
        {[...techStack, ...techStack, ...techStack].map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap shrink-0">
            <tech.icon className="h-4 w-4" />
            {tech.name}
          </div>
        ))}
      </div>
    </div>
  );
}
