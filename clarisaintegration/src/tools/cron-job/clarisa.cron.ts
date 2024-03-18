import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { ClarisaService } from '../../domain/clarisa/clarisa.service';
import { CronTime } from '../../shared/enums/cron-time.enum';

@Injectable()
export class ClarisaCron {
  constructor(private readonly clarisaService: ClarisaService) {}

  @Cron(CronTime.getFromName(process.env.CRON_TIME).value)
  ClarisaCloning(): void {
    this.clarisaService.dataReplicationProcess();
  }
}
