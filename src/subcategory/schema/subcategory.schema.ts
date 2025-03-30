import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SubCategoryDocument = HydratedDocument<SubCategory>;
@Schema({ timestamps: true, versionKey: false })
export class SubCategory {
  @Prop({
    required: true,
    type: String,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  })
  name: string;
  @Prop({
    required: true,
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  category: string;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
