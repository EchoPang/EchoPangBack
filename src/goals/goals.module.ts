import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Waste } from 'src/waste/waste.entity';
import { Goal } from './goal.entity';
import { GoalController } from './goals.controller';
import { GoalService } from './goals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Goal, User, Waste]), // GoalRepository를 제공하기 위해 Goal 엔티티 추가
  ],
  providers: [GoalService],
  controllers: [GoalController],
  exports: [GoalService, TypeOrmModule],
})
export class GoalsModule {}
