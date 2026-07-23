// import * as mongoose from 'mongoose';
// import { config } from 'src/config';

// export const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   chipsAmount: {
//     type: Number,
//     default: config.INITIAL_CHIPS_AMOUNT,
//   },
//   type: {
//     type: Number,
//     default: 0,
//   },
//   created: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export const User = mongoose.model('user', UserSchema);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { config } from 'src/config';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: number;

  @Prop({ required: true })
  password: string;

  @Prop({ default: config.INITIAL_CHIPS_AMOUNT })
  chipsAmount: number;

  @Prop({ default: 0 })
  type: number;

  @Prop({ default: Date.now() })
  created: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
