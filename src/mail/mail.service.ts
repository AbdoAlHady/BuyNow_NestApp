import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailOptions } from 'src/utils/types';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService,private readonly configService:ConfigService) {}

  public async sendEmail(options:SendEmailOptions) {
    await this.mailerService.sendMail({
      from: `$BuyNow App <${options.from ||this.configService.get('MAIL_FROM_EMAIL')}>`, // sender address,
      to: options.to ,
      subject: options.subject,
      text: options.text,
  });
  }
}
