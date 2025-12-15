import { Controller, Post, Body, Patch, Param, Delete, Get, BadRequestException } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  // Crear tarjeta
  @Post()
  create(@Body() dto: { title: string; columnId: string; order?: number }) {
    if (!dto.title || !dto.columnId) {
      throw new BadRequestException('Title y columnId son requeridos');
    }
    return this.cardsService.create(dto);
  }

  // Obtener todas las tarjetas de una columna
  @Get(':columnId')
  findAll(@Param('columnId') columnId: string) {
    return this.cardsService.findAll(columnId);
  }

  // Mover tarjeta entre columnas
  @Patch('move/:id')
  move(@Param('id') id: string, @Body() dto: { columnId: string; order: number }) {
    return this.cardsService.moveCard({ cardId: id, ...dto });
  }

  // Actualizar tarjeta
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { title?: string; order?: number; columnId?: string }) {
    return this.cardsService.update(id, dto);
  }

  // Eliminar tarjeta
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cardsService.delete(id);
  }
}
