import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

export type CartItemType = {
  product: string;
  quantity: number;
  color: string;
  price: number;
};

@Schema({ _id: true })
export class CartItem {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id?: Types.ObjectId; 
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product: string;

  @Prop({ type: Number, required: true, min: 1, default: 1 })
  quantity: number;

  @Prop()
  color: string;

  @Prop()
  price: number;
}

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({type:[CartItem],default:[]})
  cartItems: CartItem[];
  @Prop({ type: Number })
  totalPrice: number;
  @Prop({ type: Number })
  totalPriceAfterDiscount: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' })
  coupon: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
