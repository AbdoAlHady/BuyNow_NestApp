import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true, versionKey: false })
export class Coupon {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  name: string;

  @Prop({
    type: Date,
    required: true,
  })
  expireDate: Date;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
