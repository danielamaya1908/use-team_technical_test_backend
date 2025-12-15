import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
})
export class ColumnsModule {}