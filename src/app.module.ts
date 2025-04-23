import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ParseQueryInterceptor } from './common/interceptors/parse-query.interceptor';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { TaxModule } from './tax/tax.module';
import { RequestProductModule } from './request-product/request-product.module';
import { ProductModule } from './product/product.module';
// import { CommonModule } from './common/common.module';

@Module({
  imports: [

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get('DATABASE_URL'),
        };
      },
      inject: [ConfigService],
    }),
   

    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => {

        return {
          secret: config.get('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get('JWT_EXPIRES_IN'),
          },
        };
      },
      
      inject: [ConfigService],
    }),
    // CommonModule,
    MailModule,
    UserModule,
    AuthModule,
    CategoryModule,
    SubcategoryModule,
    BrandModule,
    CouponModule,
    SuppliersModule,
    TaxModule,
    RequestProductModule,
    ProductModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ParseQueryInterceptor, // ✅ تطبيقه تلقائيًا على كل الطلبات
    }
   
  ],
})
export class AppModule {}
