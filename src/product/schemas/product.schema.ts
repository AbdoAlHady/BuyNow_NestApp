import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/schema/brand.schema';
import { Category } from 'src/category/schemas/category-schema';
import { SubCategory } from 'src/subcategory/schema/subcategory.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ type: String, required: true, trim: true, minlength: 3 })
  title: string;

  @Prop({ type: String, required: true, trim: true, minlength: 20 })
  description: string;

  @Prop({ type: Number, min: 1, max: 500, default: 1 })
  quantity: number;

  @Prop({ type: String })
  imageCover: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ type: Number, required: true, min: 1, max: 20000 })
  price: number;

  @Prop({ type: Number, required: true, min: 0, max: 20000, default: 0 })
  priceAfterDiscount: number;

  @Prop({ type: [String] })
  colors: string[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
  })
  category: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: SubCategory.name,
  })
  subCategory: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
  })
  brand: string;

  @Prop({ type: Number, default: 0 })
  ratingAverage: number;
  @Prop({ type: Number, default: 0 })
  ratingQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
const setImageUrl = (doc: ProductDocument) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000/products/'; // Use base URL from environment (e.g., for prod)

  if (doc.imageCover && !doc.imageCover.startsWith('http')) {
    doc.imageCover = `${baseUrl}${doc.imageCover}`;
  }

  // تحديث images
  if (doc.images && doc.images.length > 0) {
    doc.images = doc.images.map((image) => {
      return image.startsWith('http') ? image : `${baseUrl}${image}`;
    });
  }
};
// init => when the document is retrieved from the database (e.g., when you call findOne or findById)
// save => when the document is saved to the database (e.g., when you call save or create)
ProductSchema.post<ProductDocument>('init', setImageUrl);
ProductSchema.post<ProductDocument>('save', setImageUrl);
