'use client';

import { Bot, Folder, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Agent, Project } from '@/lib/types';

interface StatsCardsProps {
  agents: Agent[];
  projects: Project[];
}

export function StatsCards({ agents, projects }: StatsCardsProps) {
  const activeAgents = agents.filter((a) => a.is_active === true).length;
  const inactiveAgents = agents.filter((a) => a.is_active === false).length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;

  const stats = [
    {
      title: 'Total Agents',
      value: agents.length,
      icon: <Bot className="h-5 w-5" />,
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-400',
      subtitle: `${activeAgents} active, ${inactiveAgents} inactive`,
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: <Folder className="h-5 w-5" />,
      color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400',
      subtitle: `of ${projects.length} total`,
    },
    {
      title: 'Active Agents',
      value: activeAgents,
      icon: <Activity className="h-5 w-5" />,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-400',
      subtitle: 'ready to work',
    },
    {
      title: 'Inactive',
      value: inactiveAgents,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: inactiveAgents > 0
        ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400'
        : 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400',
      subtitle: inactiveAgents > 0 ? 'agents disabled' : 'all agents active',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {stat.subtitle}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
