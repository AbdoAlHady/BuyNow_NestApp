import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({timestamps: true,versionKey: false})
export class Category {
  @Prop({ type: String, required: true, minlength: 3, maxlength: 30 })
  name: string;

  @Prop({ type: String})
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
