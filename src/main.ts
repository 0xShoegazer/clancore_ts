import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';

// Load env vars if env is not production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './server/config/local.env' });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
