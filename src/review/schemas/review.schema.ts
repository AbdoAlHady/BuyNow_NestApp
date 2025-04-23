import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "src/product/schemas/product.schema";
import { User } from "src/user/schemas/user.schema";


export type ReviewDocument = HydratedDocument<Review>;
@Schema({ timestamps: true })
export class Review {
    @Prop({ required: false, type: String, minlength:3 })
    reviewText:string;
    @Prop({ required: true, type: Number, min:1, max:5 })
    rating: number;
    @Prop({ required: true,type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: string;
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Product.name })
    product: string;

}



export const ReviewSchema = SchemaFactory.createForClass(Review);