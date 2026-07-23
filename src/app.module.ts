import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AuthController } from './routes/api/AuthController';
import { UserController } from './routes/api/UserController';
import { ChipsController } from './routes/api/ChipsController';
import { AuthService } from './services/AuthService';
import { UserService } from './services/UserService';
import { JwtModule } from '@nestjs/jwt';
import { config } from './config';
import { User, UserSchema } from './models/User';
import { SocketGateway } from './socket/SocketGateway';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: config.JWT_SECRET, // This would not work in production if env vars were not used
      signOptions: { expiresIn: '4hr' },
    }),
  ],
  controllers: [AppController, AuthController, UserController, ChipsController],
  providers: [SocketGateway, AuthService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware)
    // .forRoutes('');
  }
}
