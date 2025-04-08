import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './schemas/supplier.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
  imports: [
    MongooseModule.forFeature([
      { schema: SupplierSchema, name: Supplier.name },
    ]),
    UserModule
  ],
})
export class SuppliersModule {}
