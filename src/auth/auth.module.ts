import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { ForgetPasswordProvider } from './forget-password.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MailModule
  ],
  controllers: [AuthController],
  providers: [ForgetPasswordProvider,AuthService],
})
export class AuthModule {}
