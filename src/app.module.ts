import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthController } from './routes/api/AuthController';
import { UserController } from './routes/api/UserController';
import { ChipsController } from './routes/api/ChipsController';
import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { JwtModule } from '@nestjs/jwt';
import { config } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO_URI),
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET, // This would not work in production if env vars were not used
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController, AuthController, UserController, ChipsController],
  providers: [AuthService, UserService],
})
export class AppModule {}
