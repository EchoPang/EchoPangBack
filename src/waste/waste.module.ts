import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { WasteController } from './waste.controller';
import { Waste } from './waste.entity';
import { WasteService } from './waste.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Waste]),
    UsersModule
  ],
  controllers: [WasteController],
  providers: [WasteService]
})
export class WasteModule {}
