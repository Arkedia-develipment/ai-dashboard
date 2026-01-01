'use client';

import { useEffect, useRef } from 'react';
import { Activity, Bot, Folder, AlertTriangle, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RealtimeEvent } from '@/lib/types';

interface LiveEventFeedProps {
  events: RealtimeEvent[];
}

const eventTypeConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  task_started: {
    color: 'text-blue-500',
    icon: <Activity className="h-4 w-4" />,
  },
  task_completed: {
    color: 'text-green-500',
    icon: <CheckCircle className="h-4 w-4" />,
  },
  task_failed: {
    color: 'text-red-500',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  agent_handoff: {
    color: 'text-purple-500',
    icon: <ArrowRight className="h-4 w-4" />,
  },
  file_created: {
    color: 'text-indigo-500',
    icon: <Folder className="h-4 w-4" />,
  },
  agent_status_change: {
    color: 'text-orange-500',
    icon: <Bot className="h-4 w-4" />,
  },
  default: {
    color: 'text-gray-500',
    icon: <Zap className="h-4 w-4" />,
  },
};

export function LiveEventFeed({ events }: LiveEventFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events]);

  const getEventConfig = (eventType: string) => {
    return eventTypeConfig[eventType] || eventTypeConfig.default;
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-indigo-500" />
            Live Activity Feed
          </CardTitle>
          <Badge variant="outline" className="animate-pulse">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-500 inline-block" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-4" ref={scrollRef}>
          {events.length === 0 ? (
            <div className="flex h-full items-center justify-center py-8">
              <p className="text-sm text-gray-500">No events yet. Waiting for activity...</p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {events.map((event) => {
                const config = getEventConfig(event.event_type);
                return (
                  <div
                    key={event.id}
                    className="flex gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className={cn('flex-shrink-0 mt-0.5', config.color)}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {event.agent_name && (
                          <Badge variant="secondary" className="text-xs">
                            {event.agent_name}
                          </Badge>
                        )}
                        {event.project_name && (
                          <Badge variant="outline" className="text-xs">
                            {event.project_name}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {event.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatTime(event.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
