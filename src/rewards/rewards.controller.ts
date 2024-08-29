import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRewardDto } from './\bdto/create-reward.dto';
import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  async createReward(
    @Body() createRewardDto: CreateRewardDto
  ) {
    const reward = await this.rewardsService.createReward(
      createRewardDto
    );
    return { message: '보상이 성공적으로 지급되었습니다!', reward };
  }

  @Get()
  async getRewards(@Query('userId') userId: number) {
    const rewards = await this.rewardsService.getRewards(userId);
    return { rewards };
  }

  @Get('balance')
  async getBalance(@Query('userId') userId: number) {
    const balance = await this.rewardsService.getBalance(userId);
    return { userId, balance: `${balance} EFT` };
  }
}
