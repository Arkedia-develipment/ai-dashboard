'use client';

import { useEffect, useCallback, useState } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';
import { useAgentStore } from '@/lib/stores/agentStore';
import type { RealtimeEvent, Agent, Project } from '@/lib/types';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const { addEvent, setAgents, setProjects } = useAgentStore();

  const handleNewEvent = useCallback(
    (event: RealtimeEvent) => {
      addEvent(event);
    },
    [addEvent]
  );

  const handleAgentUpdate = useCallback(
    (agents: Agent[]) => {
      setAgents(agents);
    },
    [setAgents]
  );

  const handleProjectUpdate = useCallback(
    (projects: Project[]) => {
      setProjects(projects);
    },
    [setProjects]
  );

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_event', handleNewEvent);
    socket.on('agent_update', handleAgentUpdate);
    socket.on('project_update', handleProjectUpdate);

    // Connect when the hook mounts
    connectSocket();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_event', handleNewEvent);
      socket.off('agent_update', handleAgentUpdate);
      socket.off('project_update', handleProjectUpdate);
      disconnectSocket();
    };
  }, [handleNewEvent, handleAgentUpdate, handleProjectUpdate]);

  return { isConnected };
}
