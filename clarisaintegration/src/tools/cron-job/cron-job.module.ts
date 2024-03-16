import { Module } from '@nestjs/common';

import { ClarisaModule } from '../../domain/clarisa/clarisa.module';

import { ClarisaCron } from './clarisa.cron';

@Module({
  imports: [ClarisaModule],
  providers: [ClarisaCron],
  exports: [ClarisaCron],
})
export class CronJobModule {}
