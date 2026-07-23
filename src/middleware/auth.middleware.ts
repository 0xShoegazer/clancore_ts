import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');

    const token = req.header('x-auth-token');
    console.log(token);
    if (!token) return res.status(401).json({ msg: 'Unauthorized request!' });

    try {
      const payload = await this.jwtService.verifyAsync(token);

      //   jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      //     if (err) {
      //       res.status(401).json({ msg: 'Unauthorized request!' });
      //       console.error(err);
      //     } else {
      //       req.user = decoded.user;
      //       next();
      //     }
      //   });
    } catch (err) {
      console.error(
        'Internal auth error - error in token validation middleware',
      );
      res.status(500).json({ msg: 'Internal auth error' });
    }

    next();
  }
}
