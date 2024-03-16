import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ClarisaService } from '../../domain/clarisa/clarisa.service';

@Injectable()
export class ClarisaCron {
  constructor(private readonly clarisaService: ClarisaService) {}

  @Cron(CronExpression.EVERY_8_HOURS)
  ClarisaCloning() {
    this.clarisaService.bootstrap();
  }
}
