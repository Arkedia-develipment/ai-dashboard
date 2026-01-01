import { create } from 'zustand';
import type { Agent, RealtimeEvent, Project } from '@/lib/types';

interface AgentStore {
  agents: Agent[];
  projects: Project[];
  events: RealtimeEvent[];
  setAgents: (agents: Agent[]) => void;
  setProjects: (projects: Project[]) => void;
  addEvent: (event: RealtimeEvent) => void;
  setEvents: (events: RealtimeEvent[]) => void;
  updateAgentActiveStatus: (name: string, isActive: boolean) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  projects: [],
  events: [],
  setAgents: (agents) => set({ agents }),
  setProjects: (projects) => set({ projects }),
  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, 100), // Keep last 100 events
    })),
  setEvents: (events) => set({ events }),
  updateAgentActiveStatus: (name, isActive) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.name === name ? { ...agent, is_active: isActive } : agent
      ),
    })),
}));
