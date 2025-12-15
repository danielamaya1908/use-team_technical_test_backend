import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
