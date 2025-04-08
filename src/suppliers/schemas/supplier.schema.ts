import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true, versionKey: false })
export class Supplier {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  name: string;
  @Prop({ required: true, type: String })
  website: string;
}


export const SupplierSchema = SchemaFactory.createForClass(Supplier);
