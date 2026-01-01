'use client';

import { Toaster } from 'sonner';
import { SocketProvider } from './SocketProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SocketProvider>
      {children}
      <Toaster position="top-right" richColors />
    </SocketProvider>
  );
}
