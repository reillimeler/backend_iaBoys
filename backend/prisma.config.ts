import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL, // Aquí es donde ahora se define la conexión
  },
});
