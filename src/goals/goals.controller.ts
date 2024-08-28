import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalService } from './goals.service';

@Controller('goals')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post('set')
  async setGoal(@Body() createGoalDto: CreateGoalDto) {
    const goal = await this.goalService.setGoal(createGoalDto);
    return { message: '목표가 성공적으로 생성되었습니다!', goal };
  }

  @Get()
  async getGoals(@Query('userId') userId: number) {
    return this.goalService.getGoals(userId);
  }
}
