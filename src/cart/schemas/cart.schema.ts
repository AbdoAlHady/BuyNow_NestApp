import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop([
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
      color: {
        type: String,
        required: true,
      },
    },
  ])
  cartItems: [
    {
      product: string;
      quantity: number;
      color: string;
    },
  ];
  @Prop({ type: Number })
  totalPrice: number;
  @Prop({ type: Number })
  totalPriceAfterDiscount: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' })
  coupon: string;
}
