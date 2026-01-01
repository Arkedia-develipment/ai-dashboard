'use client';

import { Bot, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Agent } from '@/lib/types';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const isActive = agent.is_active ?? true;

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600',
        isActive && 'ring-2 ring-green-400 ring-opacity-50'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {agent.model || 'claude-sonnet-4-20250514'}
              </p>
            </div>
          </div>
          <Badge
            className={cn(
              'flex items-center gap-1',
              isActive
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            )}
          >
            {isActive ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Inactive
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {agent.description || 'No description available'}
        </p>
        {agent.webhook_path && (
          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-800">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Webhook</p>
            <p className="text-sm text-gray-900 dark:text-white font-mono truncate">
              {agent.webhook_path}
            </p>
          </div>
        )}
        {agent.updated_at && (
          <p className="mt-2 text-xs text-gray-400">
            Updated: {new Date(agent.updated_at).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
