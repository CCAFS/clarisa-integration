import { Routes } from '@nestjs/core';

import { ClarisaModule } from '../domain/clarisa/clarisa.module';

export const mainRoutes: Routes = [
  { path: 'api', children: [{ path: 'clarisa', module: ClarisaModule }] },
];
