import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { ChipsController } from './controllers/ChipsController';

@Module({
  imports: [],
  controllers: [AppController, AuthController, UserController, ChipsController],
  providers: [AppService],
})
export class AppModule {}
