import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class MailFactory implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: this.configService.get('configs.mailer.transport'),
      defaults: this.configService.get('configs.mailer.defaults'),
      template: {
        dir: 'apps/service-notification/src/templates/emails',
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    } as MailerOptions;
  }
}
