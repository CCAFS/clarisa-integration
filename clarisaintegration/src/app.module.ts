import { join } from 'path';

import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MySqlDriver } from '@mikro-orm/mysql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClarisaModule } from './domain/clarisa/clarisa.module';
import { mainRoutes } from './routes/main.routes';
import { CronJobModule } from './tools/cron-job/cron-job.module';
import { ResponseInterceptor } from './shared/interceptor/response.interceptor';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { GlobalExceptions } from './shared/error-management/global.exception';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        entities: [join(__dirname, 'domain/**/*.entity{.ts,.js}')],
        dbName: configService.get<string>('DB_NAME'),
        driver: MySqlDriver,
        user: configService.get<string>('DB_USER_NAME'),
        password: configService.get<string>('DB_USER_PASSWORD'),
        host: configService.get<string>('DB_HOST'),
      }),
    }),
    RouterModule.register(mainRoutes),
    ScheduleModule.forRoot(),
    ClarisaModule,
    CronJobModule,
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
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
