import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;


@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user',
  })
  role: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Number })
  age: number;

  @Prop({ type: String, minlength: 11, maxlength: 11 })
  phoneNumber: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: Boolean, default: true })
  active: boolean;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String })
  verificationCode: string;

  @Prop({ type: Date })
  verificationCodeExpires: Date;

  @Prop({ type: Date })
  changePasswordDate: Date;

  @Prop({ type: String, enum: ['male', 'female'] })
  gender: string;

  createdAt?: Date; // ✅ تعريف createdAt هنا
  updatedAt?: Date; // ✅ تعريف updatedAt هنا
}

export const UserSchema = SchemaFactory.createForClass(User);
