import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartItem } from './schemas/cart.schema';
import { Product } from 'src/product/schemas/product.schema';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CouponService } from 'src/coupon/coupon.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly couponService: CouponService,
  ) {}

  /**
   * * Adds a product to the cart of a user.
   * @param createCartDto - The DTO containing the product ID and color.
   * @param userId  - The ID of the user.
   * @returns  Cart object with the updated cart items and total price.
   * @access User
   */
  public async addProductToCart(createCartDto: CreateCartDto, userId: string) {
    // Check if the product exists
    const product = await this.productModel.findById(createCartDto.product);
    //Get the cart of the user
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = await this.cartModel.create({
        user: userId,
        cartItems: [
          {
            product: product!._id,
            quantity: 1,
            color: createCartDto.color,
            price:product?.priceAfterDiscount ? product?.priceAfterDiscount : product?.price,
          },
        ],
      });
    } else {
      // Check if the product is already in the cart
      const index = cart.cartItems.findIndex(
        (item) =>
          item.product.toString() === createCartDto.product &&
          item.color === createCartDto.color,
      );
      if (index > -1) {
        cart.cartItems[index].quantity += 1;
      } else {
        cart.cartItems.push({
          product: product!._id.toString(),
          quantity: 1,
          color: createCartDto.color,
          price: product!.price,
        });
      }
    }
    cart.totalPrice = this.calculateTotalPrice(cart.cartItems);
    cart.totalPriceAfterDiscount = undefined as any;
    await cart.save();
    return {
      status: 'success',
      message: 'Product added to cart successfully',
      data: cart,
    };
  }

  /**
   *  * Retrieves all products in the cart for a specific user.
   * @param userId  - The ID of the user.
   * @returns  An object containing the cart details.
   * @access User
   */
  public async getAllUserProduct(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    return {
      status: 'success',
      data: cart,
    };
  }

  /**
   *  * Updates the quantity of a product in the cart.
   * @param updateCartDto - The DTO containing the product ID, color, and new quantity.
   * @param userId  - The ID of the user.
   * @returns  An object containing the updated cart details.
   * @access User
   */
  public async updateProductQuantityInCart(
    updateCartQuantityDto: UpdateCartQuantityDto,
    userId: string,
  ) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('There is no cart for this user');
    }
    const index = cart.cartItems.findIndex(
      (item) => item._id?.toString() === updateCartQuantityDto.cartItem,
    );
    console.log('index', index);
    if (index > -1) {
      updateCartQuantityDto.type = updateCartQuantityDto.type ?? 'increase';
      if (updateCartQuantityDto.type === 'increase') {
        cart.cartItems[index].quantity += 1;
      }
      if (updateCartQuantityDto.type === 'decrease') {
        cart.cartItems[index].quantity -= 1;
        if (cart.cartItems[index].quantity === 0) {
          cart.cartItems.splice(index, 1);
        }
      }
    }

    cart.totalPrice = this.calculateTotalPrice(cart.cartItems);
    cart.totalPriceAfterDiscount = undefined as any;
    await cart.save();
    return {
      status: 'success',
      message: 'Product quantity updated successfully',
      data: cart,
    };
  }

  /**
   *  * Deletes the cart for a specific user.
   * @param userId  - The ID of the user.
   * @access User
   */
  public async deleteUserCart(userId: string) {
    const cart = await this.cartModel.findOneAndDelete({ user: userId });
    if (!cart) {
      throw new NotFoundException('There is no cart for this user');
    }
  }

  public async applyCouponToCart(userId:string,applyCouponDto:ApplyCouponDto){
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('There is no cart for this user');
    }
    // Assuming you have a method to validate the coupon and get the discount amount
    const copoun = await this.couponService.validateCoupon(applyCouponDto.coupon);
    const totalPrice = this.calculateTotalPrice(cart.cartItems);
    const totalAfterDiscount:string =( totalPrice - (totalPrice * copoun.discount) / 100).toFixed(2);
    cart.totalPriceAfterDiscount = parseFloat(totalAfterDiscount);
    cart.coupon = copoun._id.toString();
    await cart.save();
    return {
      status: 'success',
      message: 'Coupon applied successfully',
      data: cart,
    };

  }

  private calculateTotalPrice(cart: CartItem[]) {
    let totalPrice = 0;
    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  }
}
