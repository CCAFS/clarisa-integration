import { Controller, Get, HttpStatus, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { ResponseUtils } from './shared/utils/response.utils';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  mainPage(@Req() req: Request) {
    return ResponseUtils.format({
      message: 'Aliance Management',
      status: HttpStatus.OK,
      data: {
        message: 'Welcome to the Aliance Management API',
        author: 'One CGIAR - IBD',
        ip: req.ip,
        client: req.headers['user-agent'],
      },
    });
  }
}
