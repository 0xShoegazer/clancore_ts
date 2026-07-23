import { Controller, Post, Req, Res } from '@nestjs/common';
import { validationResult } from 'express-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/User';
import { JwtService } from '@nestjs/jwt';

@Controller('/api')
export class AuthController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  @Post('auth')
  async login(@Req() req, @Res() res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // password isn't currently used to get the player
    const { email, password } = req.body;

    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // const isMatch = true;
      // console.log(isMatch)

      // if (!isMatch) {
      //   return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
      // }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = await this.jwtService.signAsync(payload);

      res.json({ token });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).json({ msg: 'Internal server error' });
    }
  }
}
