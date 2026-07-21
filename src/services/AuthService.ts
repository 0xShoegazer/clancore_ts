import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // @route   GET api/auth
  // @desc    Get user by token
  // @access  Private
  // @route   POST api/auth
  // @desc    Authenticate user & get token
  // @access  Public
  async login(email: string) {
    try {
      //   let user = await User.findOne({ email });
      //   if (!user) {
      //     return res
      //       .status(400)
      //       .json({ errors: [{ msg: 'Invalid credentials' }] });
      //   }
      //   const isMatch = true;
      //   console.log(isMatch);
      //   if (!isMatch) {
      //     return res
      //       .status(400)
      //       .json({ errors: [{ msg: 'Invalid credentials' }] });
      //   }
      //   const payload = {
      //     user: {
      //       id: user.id,
      //     },
      //   };
      //   jwt.sign(
      //     payload,
      //     config.JWT_SECRET,
      //     { expiresIn: config.JWT_TOKEN_EXPIRES_IN },
      //     (err, token) => {
      //       if (err) throw err;
      //       res.json({ token });
      //     },
      //   );
    } catch (err) {
      throw err;
    }
  }

  async jwtSign(payload) {
    //   jwt.sign(
    //     payload,
    //     config.JWT_SECRET,
    //     { expiresIn: config.JWT_TOKEN_EXPIRES_IN },
    //     (err, token) => {
    //       if (err) throw err;
    //       res.json({ token });
    //     },
  }
}
