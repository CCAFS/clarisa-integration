import { Module } from '@nestjs/common';
import { ClarisaController } from './clarisa.controller';
import { ClarisaService } from './clarisa.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ClarisaController],
  providers: [ClarisaService],
  exports: [ClarisaService],
})
export class ClarisaModule {}
