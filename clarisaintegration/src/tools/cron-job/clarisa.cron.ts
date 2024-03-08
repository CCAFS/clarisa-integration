import { Injectable } from '@nestjs/common';
import { ClarisaService } from '../../domain/clarisa/clarisa.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ClarisaCron {
  constructor(private readonly clarisaService: ClarisaService) {}

  @Cron(CronExpression.EVERY_8_HOURS)
  ClarisaCloning() {
    this.clarisaService.bootstrap();
  }
}
