import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({
  timestamps: true,
  versionKey: false,
})
class Brand {
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

export const BrandSchema = SchemaFactory.createForClass(Brand);
