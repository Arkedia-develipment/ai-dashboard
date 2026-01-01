'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageSquare,
  BookOpen,
  Settings,
  Workflow,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Agents', href: '/agents', icon: Users },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Learning', href: '/learning', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <span className="text-lg font-bold text-white">A</span>
        </div>
        <span className="text-lg font-semibold text-white">AI Team</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Agent Status Quick View */}
      <div className="border-t border-gray-700 p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Agent Status
        </h4>
        <div className="space-y-2">
          <AgentStatusItem name="Maestro" status="idle" />
          <AgentStatusItem name="Developer" status="working" task="Building dashboard" />
          <AgentStatusItem name="DevOps" status="idle" />
        </div>
      </div>
    </div>
  );
}

function AgentStatusItem({
  name,
  status,
  task,
}: {
  name: string;
  status: 'idle' | 'working' | 'error' | 'blocked';
  task?: string;
}) {
  const statusColors = {
    idle: 'bg-gray-400',
    working: 'bg-green-500',
    error: 'bg-red-500',
    blocked: 'bg-yellow-500',
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'h-2 w-2 rounded-full',
          statusColors[status],
          status === 'working' && 'animate-pulse'
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-300 truncate">{name}</p>
        {task && (
          <p className="text-xs text-gray-500 truncate">{task}</p>
        )}
      </div>
    </div>
  );
}
