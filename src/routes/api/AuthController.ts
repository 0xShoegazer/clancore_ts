import { Controller, Post, Req, Res } from '@nestjs/common';
import { validationResult } from 'express-validator';

@Controller('/api')
export class AuthController {
  constructor() {}

  @Post('auth')
  async login(@Req() req, @Res() res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // try {
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
    // } catch (err) {
    //   console.error(err.message);
    //   res.status(500).json({ msg: 'Internal server error' });
    // }
  }
}
