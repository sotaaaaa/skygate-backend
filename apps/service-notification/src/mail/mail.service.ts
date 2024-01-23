import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Send mail with default from email
   * @param options
   * @returns
   */
  async send(options: ISendMailOptions) {
    // Set default from email
    const now = new Date().getTime();
    const response = await this.mailerService.sendMail(options);
    Logger.log(`Sent email to ${options.to} ${Date.now() - now}ms`);
    return response;
  }
}
