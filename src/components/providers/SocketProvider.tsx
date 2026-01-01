'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSocket } from '@/hooks/useSocket';

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ isConnected: false });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isConnected } = useSocket();

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
