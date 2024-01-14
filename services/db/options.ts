import {Prisma} from '@prisma/client';

const {
  DATABASE_URL,
  PG_DATABASE,
  PG_HOSTNAME,
  PG_PASSWORD,
  PG_PORT,
  PG_USERNAME,
} = process.env;
const dbURL =
  DATABASE_URL ||
  `postgresql://${encodeURIComponent(
    PG_USERNAME as string
  )}:${encodeURIComponent(PG_PASSWORD as string)}@${encodeURIComponent(
    PG_HOSTNAME as string
  )}:${encodeURIComponent(PG_PORT as string)}/${encodeURIComponent(
    PG_DATABASE as string
  )}?pool_timeout=15&connect_timeout=15`;
const prismaOpts: Prisma.PrismaClientOptions = {
  datasources: {
    db: {
      url: dbURL,
    },
  },
  log: ['error', 'warn', 'info'], // 'query'],
};

export default prismaOpts;
