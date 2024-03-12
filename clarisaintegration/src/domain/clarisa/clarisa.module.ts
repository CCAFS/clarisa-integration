import { Module } from '@nestjs/common';
import { ClarisaController } from './clarisa.controller';
import { ClarisaService } from './clarisa.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [ClarisaController],
  providers: [ClarisaService, ConfigService],
  exports: [ClarisaService],
})
export class ClarisaModule {}
