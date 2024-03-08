import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ormConfig } from './db/config/orm.config';
import { ClarisaModule } from './domain/clarisa/clarisa.module';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { mainRoutes } from './routes/main.routes';
import { CronJobModule } from './tools/cron-job/cron-job.module';
import { ClarisaCron } from './tools/cron-job/clarisa.cron';
import { ScheduleModule } from '@nestjs/schedule';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { GlobalExceptions } from './shared/error-management/global.exception';

@Module({
  imports: [
    MikroOrmModule.forRoot(ormConfig),
    RouterModule.register(mainRoutes),
    ScheduleModule.forRoot(),
    ClarisaModule,
    CronJobModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptions,
    },
  ],
})
export class AppModule {}
