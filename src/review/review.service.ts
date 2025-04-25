import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schemas/review.schema';
import mongoose, { Model } from 'mongoose';
import { BaseService } from 'src/common/services/base.service';
import { Product } from 'src/product/schemas/product.schema';

@Injectable()
export class ReviewService extends BaseService<Review> {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {
    super(reviewModel);
  }
  /**
   * Create a review
   * @param createReviewDto - the review data
   * @param userId - the user id of the user creating the review on the product
   * @returns  the created review
   * @access User
   */
  public async createReview(createReviewDto: CreateReviewDto, userId: string) {
    createReviewDto.user = userId;
    await this.checkUserHaveReview(userId);
    const review = await this.createOne(createReviewDto);
    await this.updateProductRating(createReviewDto.product);
    return review;
  }

  /**
   *  Get all reviews for a product
   * @param query  - the query params for filtering and pagination
   * @returns  the reviews from the database
   * @access public
   */
  public async getAllProductReview(productId: string) {
    const reviews = await this.reviewModel
      .find({ product: productId })
      .populate('user', 'name email')
      .populate('product', 'title description')
      .exec();
    return {
      status: 'success',
      results: reviews.length,
      data: {
        reviews,
      },
    };
  }

  /**
   *  Get all reviews for a user
   * @param userId - the user id of the user to get reviews for
   * @returns  the reviews from the database
   * @access Admin
   */
  public async getAllUserReview(userId: string) {
    const reviews = await this.reviewModel
      .find({ user: userId })
      .populate('user', 'name email')
      .populate('product', 'title description')
      .exec();
    return {
      status: 'success',
      results: reviews.length,
      data: reviews,
    };
  }

  /**
   * Update User review
   * @param reviewId
   * @param updateReviewDto  - the review data to update
   * @param userId  - the user id of the user updating the review
   * @returns  the updated review from the database
   * @access User
   */
  public async updateReview(
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
    userId: string,
  ) {
    const review = await this.findOne(reviewId);
    if (review.data.user.toString() === userId) {
      return await this.updateOne(reviewId, updateReviewDto);
    } else {
      throw new ForbiddenException('You are not allowed to update this review');
    }
  }
  /**
   * Delete User review
   * @param reviewId  - the id of the review to delete
   * @param userId  - the user id of the user deleting the review
   * @access User
   */

  public async deleteReview(reviewId: string, userId: string) {
    const review = await this.findOne(reviewId);
    if (review.data.user.toString() === userId) {
      await this.deleteOne(reviewId);
    } else {
      throw new ForbiddenException('You are not allowed to delete this review');
    }
  }
  
  /**
   *  Check if the user has already reviewed the product
   * @param userId - the user id of the user creating the review
   * @param productId - the product id of the product to check for reviews
   */
  /**
   *  Check if the user has already reviewed the product
   * @param userId - the user id of the user creating the review
   */
  private async checkUserHaveReview(userId: string) {
    const review = await this.reviewModel.findOne({ user: userId });
    if (review) {
      throw new BadRequestException('You have already reviewed this product');
    }
  }

  /**
   *  Update product review
   * @param productId - the product id of the product to update the rating for
   * @returns  the updated product rating
   */
  private async updateProductRating(productId: string) {
    const objectId = new mongoose.Types.ObjectId(productId);

    const results = await this.reviewModel.aggregate([
      // Satge 1: Get all reviews of specific product
      {
        $match: { product: objectId },
      },

      {
        $group: {
          _id: '$product',
          ratingQuantity: { $sum: 1 },
          ratingAverage: { $avg: '$rating' },
        },
      },
    ]);
    console.log(results);

    if (results.length > 0) {
      await this.productModel.findByIdAndUpdate(productId, {
        ratingAverage: results[0].ratingAverage,
        ratingQuantity: results[0].ratingQuantity,
      });
    } else {
      await this.productModel.findByIdAndUpdate(productId, {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      });
    }
  }
}
