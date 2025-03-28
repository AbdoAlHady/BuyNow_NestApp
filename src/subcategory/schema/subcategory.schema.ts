import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/schemas/category-schema';

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
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  })
  category: Category[];
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
