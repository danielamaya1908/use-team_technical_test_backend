import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  client: {
    adapter: {
      provider: 'mongodb',
      url: process.env.DATABASE_URL!,
    },
  },
});
