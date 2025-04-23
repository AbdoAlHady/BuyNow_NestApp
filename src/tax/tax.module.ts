import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tax, TaxSchema } from './schemas/tax.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TaxController],
  providers: [TaxService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Tax.name,
        schema: TaxSchema,
      },
    ]),
    UserModule
  ],
})
export class TaxModule {}
