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
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
