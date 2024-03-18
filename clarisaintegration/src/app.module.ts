import { join } from 'path';

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER_NAME'),
        password: configService.get<string>('DB_USER_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [join(__dirname, 'domain/**/*.entity{.ts,.js}')],
        synchronize: false,
        migrationsRun: false,
        bigNumberStrings: false,
        logging: false,
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
