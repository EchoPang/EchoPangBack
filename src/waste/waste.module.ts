import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsModule } from 'src/goals/goals.module';
import { UsersModule } from 'src/users/users.module';
import { WasteController } from './waste.controller';
import { Waste } from './waste.entity';
import { WasteService } from './waste.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Waste]),
    UsersModule,
    GoalsModule
  ],
  controllers: [WasteController],
  providers: [WasteService]
})
export class WasteModule {}
