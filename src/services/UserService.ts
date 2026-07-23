import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/User';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private catModel: Model<User>) {}

  async register() {
    try {
      //
    } catch (err) {
      throw err;
    }
  }

  async getCurrentUser() {}
}
