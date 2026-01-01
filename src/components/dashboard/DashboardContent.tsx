'use client';

import { useEffect } from 'react';
import { useAgentStore } from '@/lib/stores/agentStore';
import { StatsCards } from './StatsCards';
import { AgentCard } from './AgentCard';
import { LiveEventFeed } from './LiveEventFeed';
import type { Agent, Project, RealtimeEvent } from '@/lib/types';

interface DashboardContentProps {
  initialAgents: Agent[];
  initialProjects: Project[];
  initialEvents: RealtimeEvent[];
}

export function DashboardContent({
  initialAgents,
  initialProjects,
  initialEvents,
}: DashboardContentProps) {
  const { agents, projects, events, setAgents, setProjects, setEvents } = useAgentStore();

  useEffect(() => {
    setAgents(initialAgents);
    setProjects(initialProjects);
    setEvents(initialEvents);
  }, [initialAgents, initialProjects, initialEvents, setAgents, setProjects, setEvents]);

  const displayAgents = agents.length > 0 ? agents : initialAgents;
  const displayProjects = projects.length > 0 ? projects : initialProjects;
  const displayEvents = events.length > 0 ? events : initialEvents;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Stats Overview */}
      <StatsCards agents={displayAgents} projects={displayProjects} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Agent Cards */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            AI Agents
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {displayAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Live Event Feed */}
        <div className="lg:col-span-1">
          <LiveEventFeed events={displayEvents} />
        </div>
      </div>
    </div>
  );
}
