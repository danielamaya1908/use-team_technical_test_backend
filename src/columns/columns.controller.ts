import { Controller, Post, Get, Body, Param, Delete, Patch, Put } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { SocketService } from '../shared/socket.service';

@Controller('columns')
export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly socketService: SocketService,
  ) {}

  @Post()
  async create(@Body() dto: { title: string }) {
    const newColumn = await this.columnsService.create(dto);
    this.socketService.emitColumnCreated(newColumn);
    return newColumn;
  }

  @Get()
  findAll() {
    return this.columnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.columnsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: { title?: string; order?: number }) {
    const updated = await this.columnsService.update(id, dto);
    this.socketService.emitColumnUpdated(updated);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.columnsService.delete(id);
    this.socketService.emitColumnDeleted(result.id);
    return result;
  }

  @Put('reorder')
  async reorder(@Body() dto: { columnIds: string[] }) {
    const result = await this.columnsService.reorderColumns(dto.columnIds);
    // ✅ Emitir directamente el array de IDs
    this.socketService.emitColumnsReordered(dto.columnIds);
    return result;
  }
}