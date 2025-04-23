// import { forwardRef, Global, Module } from '@nestjs/common';
// import { APP_GUARD, APP_PIPE } from '@nestjs/core';
// import { BrandModule } from 'src/brand/brand.module';
// import { CategoryModule } from 'src/category/category.module';
// import { UserModule } from 'src/user/user.module';
// import { CategoryExistValidatePipe } from './pipes/category-exist-validate.pipe';
// import { AuthGuard } from 'src/auth/guard/auth.guard';
// import { BrandExistValidatePipe } from '../brand/pipes/brand-exist-validate.pipe';
// @Global()
// @Module({
//   imports: [
//     forwardRef(() => BrandModule), // 👈 لحل الـ Circular Dependency
//     forwardRef(() => CategoryModule),
//     forwardRef(() => UserModule),
//   ],
//   providers: [
//     CategoryExistValidatePipe,
//     BrandExistValidatePipe,
//     {
//       provide: APP_GUARD,
//       useClass: AuthGuard,
//     },
//   ],
//   exports: [CategoryExistValidatePipe, BrandExistValidatePipe],
// })
// export class CommonModule {}
