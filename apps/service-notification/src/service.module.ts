import { MailFactory } from './mail/mail.factorry';
import { Module } from '@nestjs/common';
import { CoreModuleBootstrap } from '@skygate/core';
import { MailModule } from './mail/mail.module';
import { QueuesModule } from './queues/queues.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    CoreModuleBootstrap.register({
      path: process.env.configfile || 'apps/service-notification/service.config.yaml',
      envFilePath: process.env.envfile || 'apps/service-notification/.env',
      serviceName: 'ServiceNotification',
    }),
    MailerModule.forRootAsync({ useClass: MailFactory }),
    MailModule,
    QueuesModule,
  ],
})
export class ServiceModule {}
