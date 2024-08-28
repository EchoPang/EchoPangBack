import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Waste } from 'src/waste/waste.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { Goal } from './goal.entity';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal) private goalRepository: Repository<Goal>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Waste) private wasteRepository: Repository<Waste>,
  ) {}

  async setGoal(goalData: CreateGoalDto): Promise<Goal> {
    const user = await this.userRepository.findOne({
      where: { userId: goalData.userId },
    });
    if (!user) {
      throw new NotFoundException('사용자 없음');
    }

    // Waste 테이블에서 currentAmount를 가져옴
    const waste = await this.wasteRepository.findOne({
      where: {
        user: { userId: goalData.userId },
        wasteType: goalData.wasteType,
      },
    });
    if (!waste) {
      throw new NotFoundException('해당되는 폐기물 기록 없음');
    }

    const currentAmount = waste.wasteAmount;
    const achievementRate = (currentAmount / goalData.targetAmount) * 100;

    const goal = this.goalRepository.create({
      user: user,
      wasteType: goalData.wasteType,
      targetAmount: goalData.targetAmount, //parseFloat(goalData.targetAmount.toFixed(6)),
      currentAmount: currentAmount, //parseFloat(currentAmount.toFixed(6)), //goalData.currentAmount,
      unit: goalData.unit,
      achievementRate: achievementRate //parseFloat(achievementRate.toFixed(2)) //goalData.achievementRate
    });

    await this.goalRepository.save(goal);
    return goal;
  }
  
  async getGoals(userId: number): Promise<Goal[]> {
    return await this.goalRepository.find({ where: { user: { userId } } });
  }
}
