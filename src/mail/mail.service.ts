import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailOptions } from 'src/utils/types';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService,private readonly configService:ConfigService) {}

  public async sendEmail(options:SendEmailOptions) {
    try {
      await this.mailerService.sendMail({
          from: `$BuyNow App <${options.from ||this.configService.get('MAIL_FROM_EMAIL')}>`, // sender address,
          to: options.to ,
          subject: options.subject,
          text: options.text,
      });

      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new RequestTimeoutException();
      
    }
  }
}
