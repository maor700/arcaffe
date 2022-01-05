import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('users')
  getCards() {
    return this.appService.getUsers();
  }

  @Get('users/:id')
  getCard(@Param() { id }) {
    return this.appService.getUsers(id);
  }

  @Get('materials')
  getMaterials() {
    return this.appService.getMaterials();
  }

  @Get('materials/:id')
  getMaterial(@Param() { id }) {
    return this.appService.getMaterials(id);
  }
}
