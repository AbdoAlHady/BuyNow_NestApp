import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, versionKey: false })
export class Category {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    unique: true,
  })
  name: string;

  @Prop({ type: String })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `http://localhost:3000/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

CategorySchema.post<CategoryDocument>('init', setImageUrl);
CategorySchema.post<CategoryDocument>('save', setImageUrl);
