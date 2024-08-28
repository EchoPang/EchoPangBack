import { IsDecimal, IsInt, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsInt()
  userId: number;

  @IsString()
  wasteType: string;

  @IsDecimal()
  targetAmount: number;

  @IsDecimal()
  currentAmount: number;

  @IsString()
  unit: string;

  @IsDecimal()
  achievementRate: number;
}
