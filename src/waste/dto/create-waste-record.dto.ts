import { IsInt, IsString } from 'class-validator';

export class CreateWasteRecordDto {
  @IsInt()
  userId: number;

  @IsString()
  wasteType: string;

  @IsString()
  wasteAmount: number;

  @IsString()
  recordDate: string;
}
