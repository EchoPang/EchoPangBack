import { IsString } from 'class-validator';

export class CollectWasteDto {
  @IsString()
  dischargeTime: string;

  @IsString()
  dischargeAddress: string;

  @IsString()
  processingBuilding: string;
}
