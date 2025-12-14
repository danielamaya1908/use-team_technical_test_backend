import { Controller, Post, Get, Body } from '@nestjs/common';
import { ColumnsService } from './columns.service';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(@Body() dto: { title: string }) {
    return this.columnsService.create(dto);
  }

  @Get()
  findAll() {
    return this.columnsService.findAll();
  }
}
