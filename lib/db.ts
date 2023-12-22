import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/*
  Only Adding globalThis.prisma for any stage other than production
  because nextjs uses hot reload and during that hot reload
  new PrismaClient() will be generated multiple times that 
  will create a warning inside your project, 
  We are using globalThis because globalThis is excluded from
  hot reload;
*/

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
