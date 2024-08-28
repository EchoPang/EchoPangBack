import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CollectWasteDto } from './dto/collect-waste.dto';
import { CreateWasteRecordDto } from './dto/create-waste-record.dto';
import { WasteService } from './waste.service';

@Controller('waste')
export class WasteController {
  constructor(private readonly wasteService: WasteService) {}

  @Post('record')
  async create(
    @Body() wasteRecordData: CreateWasteRecordDto
  ) {
    const result = await this.wasteService.recordWaste(wasteRecordData);
    return {
      message: '폐기물 기록이 블록체인에 저장되었습니다.',
      transactionHash: result.transactionHash,
      wasteRecord: result.wasteRecord,
    };
  }

  @Get('record')
  async getWasteRecords(@Query('userId') userId: number) {
    return this.wasteService.getWasteRecords(userId);
  }

  @Post('collect')
  async collectWaste(@Body() collectWasteDto: CollectWasteDto) {
    const result = await this.wasteService.collectWaste(collectWasteDto);
    return {
      message: '폐기물 수거 신청이 완료되었습니다.',
      data: result,
    };
  }
}