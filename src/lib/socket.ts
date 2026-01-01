import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    socket = io(socketUrl, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function connectSocket(): void {
  const sock = getSocket();
  if (!sock.connected) {
    sock.connect();
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export type SocketEventType =
  | 'new_event'
  | 'agent_update'
  | 'project_update'
  | 'task_progress'
  | 'connect'
  | 'disconnect';
