import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ClarisaService } from './clarisa.service';
import { ResponseUtils } from '../../shared/utils/response.utils';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class ClarisaController {
  constructor(private readonly clarisaService: ClarisaService) {}

  @ApiTags('CLARISA')
  @Get('/cloning')
  @ApiOperation({ summary: `clone clarisa's data in aiccra` })
  @ApiResponse({
    status: 200,
    description: `Clarisa's data is being cloned`,
  })
  dataCloning() {
    this.clarisaService.bootstrap();
    return ResponseUtils.format({
      message: `Clarisa's data is being cloned`,
      status: HttpStatus.OK,
    });
  }
}
