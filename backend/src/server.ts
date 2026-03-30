import app from './app';
import { env } from './config/env';
import { prisma } from './utils/db';

const server = app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
  });
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
