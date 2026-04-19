import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

// Clase Singleton
class PrismaSingleton {
  private static instance: PrismaClient;

  private constructor() {} // Evita que alguien haga "new PrismaSingleton()"

  public static getInstance(): PrismaClient {
    if (!PrismaSingleton.instance) {
      const pool = new pg.Pool({ connectionString: dbUrl });
      const adapter = new PrismaPg(pool);
      
      PrismaSingleton.instance = new PrismaClient({ adapter });
      console.log("🚀 Nueva conexión a la base de datos creada (Singleton)");
    }
    return PrismaSingleton.instance;
  }
}

// Exportamos la instancia única
export const prisma = PrismaSingleton.getInstance();