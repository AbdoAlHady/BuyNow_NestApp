import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';


export type RequestProductDocument = RequestProduct & mongoose.Document;
@Schema({
  timestamps: true,
  versionKey: false,
})
export class RequestProduct {
  @Prop({
    required: true,
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  title: string;
  @Prop({
    required: true,
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 255,
  })
  details: string;
  @Prop({
    required: true,
    type: Number,
    min: 1,
  })
  quantity: number;

  @Prop({
    type: String,
  })
  category: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: string;
}


export const RequestProductSchema = SchemaFactory.createForClass(RequestProduct); // MongooseModule will handle the schema creation
