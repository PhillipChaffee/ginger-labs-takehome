import {Prisma, PrismaClient} from '@prisma/client';
import prismaOpts from './options';

export type DbClient = PrismaClient<typeof prismaOpts>;

let prisma: DbClient;
const client = (opts: Prisma.PrismaClientOptions = prismaOpts): DbClient => {
  if (prisma) {
    return prisma;
  }
  prisma = new PrismaClient(opts);
  return prisma;
};

export default client;
