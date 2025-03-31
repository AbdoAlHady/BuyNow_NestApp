import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Brand {
  @Prop({
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  name: string;
  @Prop({ type: String })
  image: string;
}
const setImageUrl = (doc:BrandDocument) => {
  if (doc.image) {
    const imageUrl = `http://localhost:3000/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.post<BrandDocument>('init', setImageUrl);
BrandSchema.post<BrandDocument>('save', setImageUrl);
