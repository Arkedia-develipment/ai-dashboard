const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Store connected clients
  const connectedClients = new Set();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    connectedClients.add(socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      connectedClients.delete(socket.id);
    });

    // Handle incoming events from agents (broadcast to all clients)
    socket.on('agent_event', (data) => {
      console.log('Received agent event:', data);
      io.emit('new_event', data);
    });

    socket.on('agent_status', (data) => {
      console.log('Received agent status:', data);
      io.emit('agent_update', data);
    });

    socket.on('project_status', (data) => {
      console.log('Received project status:', data);
      io.emit('project_update', data);
    });
  });

  // Make io available globally for API routes
  global.io = io;

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO server running`);
  });
});
