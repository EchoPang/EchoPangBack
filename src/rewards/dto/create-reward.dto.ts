import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRewardDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  wasteType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  tokenAmount: number; // 정수형 토큰 양
}