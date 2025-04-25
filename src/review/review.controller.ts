import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrntUser } from 'src/common/decorators/current_user_decorators';
import { JwtPayloadType } from 'src/utils/types';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ProductExistValidatePipe } from 'src/product/pipes/product-exist-validate.pipe';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { UserExistValidatePipe } from 'src/user/pipes/user-exist-validate.pipe';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['user'])
  @UsePipes(ProductExistValidatePipe)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrntUser() payload: JwtPayloadType,
  ) {
    return this.reviewService.createReview(createReviewDto, payload.id);
  }

  @Get('product/:id')
  @UseGuards(AuthGuard)
  getAllReviews(
    @Param('id', MongoIdValidationPipe, ProductExistValidatePipe) id: string,
  ) {
    return this.reviewService.getAllProductReview(id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['admin'])
  getUserReviews(
    @Param('id', MongoIdValidationPipe, UserExistValidatePipe) id: string,
  ) {
    return this.reviewService.getAllUserReview(id);
  }

  @Patch('user/:id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['user'])
  updateUserReview(
    @Body() updateUserDto: UpdateReviewDto,
    @CurrntUser() payload: JwtPayloadType,
    @Param('id', MongoIdValidationPipe) id: string,
  ) {
    return this.reviewService.updateReview(id, updateUserDto, payload.id);
  }

  @Delete('user/:id')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['user'])
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUser(
    @CurrntUser() payload: JwtPayloadType,
    @Param('id', MongoIdValidationPipe) id: string,
  ) {
    return this.reviewService.deleteReview(id, payload.id);
  }
}
