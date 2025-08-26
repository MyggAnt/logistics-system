import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { readFileSync } from 'fs';
import path from 'path';
import cors from 'cors';
import { AppDataSource } from './data-source';

// Load schema from file
const typeDefs = readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

// Import resolvers with proper typing
import { resolvers } from './resolvers';

// Import routes
import ordersRouter from './routes/orders';
import vehiclesRouter from './routes/vehicles';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, { 
  cors: { origin: '*' } 
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io available globally
app.set('io', io);

// REST API routes
app.use('/api/orders', ordersRouter);
app.use('/api/vehicles', vehiclesRouter);

app.get('/api', (req, res) => {
  res.json({
    message: '📦 Logistics System REST API',
    version: '1.0.0',
    endpoints: {
      orders: '/api/orders',
      vehicles: '/api/vehicles',
      graphql: '/graphql',
      health: '/health'
    },
    documentation: 'Use the specific endpoints to interact with the system.',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Logistics System Backend API',
    version: '1.0.0',
    endpoints: {
      graphql: '/graphql',
      rest: '/api',
      health: '/health'
    },
    documentation: 'Welcome to the Logistics System Backend API. Use the endpoints above to interact with the system.',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: AppDataSource.isInitialized ? 'Connected' : 'Disconnected'
  });
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });
  
  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`Client ${socket.id} left room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });

async function startServer() {
  const apolloServer = new ApolloServer({ 
    typeDefs, 
    resolvers,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        path: error.path,
        extensions: error.extensions
      };
    }
  });

  await apolloServer.start();
  
  // Apply Apollo Server middleware
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => ({
      req,
      io: app.get('io') // Make io available in resolvers
    })
  }));

  httpServer.listen(3001, () => {
    console.log(`🚀 Server ready at http://localhost:3001`);
    console.log(`📊 GraphQL at http://localhost:3001/graphql`);
    console.log(`🔌 REST API at http://localhost:3001/api`);
    console.log(`💚 Health check at http://localhost:3001/health`);
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});