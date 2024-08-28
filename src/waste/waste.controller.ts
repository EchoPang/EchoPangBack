import { Body, Controller, Post } from '@nestjs/common';
import { WasteService } from './waste.service';

@Controller('waste')
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}

  @Post()
  async create(@Body() wasteRecordData: any) {
    const result = await this.wasteService.recordWaste(wasteRecordData);
    return {
      message: '폐기물 기록이 블록체인에 저장되었습니다.',
      transactionHash: result.transactionHash,
      wasteHash: result.wasteHash,
    };
  }
}