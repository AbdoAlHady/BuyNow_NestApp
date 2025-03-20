import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) =>{
        return{
          uri: config.get('DATABASE_URL'),
        }
      },
      inject: [ConfigService],
    }),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
