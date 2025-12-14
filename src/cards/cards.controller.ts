import { Controller, Post, Body } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(
    @Body()
    dto: {
      title: string;
      columnId: string;
    },
  ) {
    return this.cardsService.create(dto);
  }
}
