// rewards.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from '../goals/goal.entity';
import { User } from '../users/user.entity';
import { Reward } from './reward.entity';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, User, Goal]), // 엔티티 추가
  ],
  providers: [RewardsService, ConfigService],
  controllers: [RewardsController],
})
export class RewardsModule {}
