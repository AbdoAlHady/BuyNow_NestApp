import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  UsePipes,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { AuthRolesGuard } from 'src/auth/guard/auth-roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayloadType } from 'src/utils/types';
import { ProductExistValidatePipe } from 'src/product/pipes/product-exist-validate.pipe';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['user'])
  @UsePipes(ProductExistValidatePipe)
  create(
    @Body() createCartDto: CreateCartDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.cartService.addProductToCart(createCartDto, payload.id);
  }

  @Get()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['user'])
  getAllUserCarts(@CurrentUser() payload: JwtPayloadType) {
    return this.cartService.getAllUserProduct(payload.id);
  }

  @Patch()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['user'])
  updateProductQuantityInCart(
    @Body() updateCartQuantityDto: UpdateCartQuantityDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.cartService.updateProductQuantityInCart(
      updateCartQuantityDto,
      payload.id,
    );
  }

  @Delete()
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['user'])
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUserCart( @CurrentUser() payload: JwtPayloadType){
    return this.cartService.deleteUserCart(payload.id);
  }

  @Patch('apply-coupon')
  @UseGuards(AuthGuard, AuthRolesGuard)
  @Roles(['user'])
  applyCoupon(
    @Body() coupon: ApplyCouponDto,
    @CurrentUser() payload: JwtPayloadType,
  ) {
    return this.cartService.applyCouponToCart(payload.id,coupon);
  }
}
