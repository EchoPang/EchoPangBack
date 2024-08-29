import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { ethers } from 'ethers';
import { Goal } from 'src/goals/goal.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CollectWasteDto } from './dto/collect-waste.dto';
import { CreateWasteRecordDto } from './dto/create-waste-record.dto';
import { Waste } from './waste.entity';

@Injectable()
export class WasteService {
  // 스마트 컨트랙트 연결 설정
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(
    @InjectRepository(Waste) private wasteRepository: Repository<Waste>,
    @InjectRepository(User) private userRepository: Repository<User>, 
    @InjectRepository(Goal) private goalRepository: Repository<Goal>,
    private configService: ConfigService
  ) {
    const infuraProjectId = this.configService.get<string>('INFURA_PROJECT_ID');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');

    this.provider = new ethers.JsonRpcProvider(`https://arbitrum-sepolia.infura.io/v3/${infuraProjectId}`);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    // 스마트 컨트랙트의 ABI 설정
    const contractABI = [
        "function addWasteRecord(string memory _wasteHash) public",
        "event WasteRecordAdded(address indexed user, string wasteHash, uint256 timestamp)"
    ];

    this.contract = new ethers.Contract(contractAddress, contractABI, this.wallet);
  }

  // 해시값 저장
  async recordWaste(wasteData: CreateWasteRecordDto) {
    // userId로 User 객체 조회
    const user = await this.userRepository.findOne({
      where: { userId: wasteData.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 해시 값 생성
    const hash = crypto.createHash('sha256').update(JSON.stringify(wasteData)).digest('hex');

    // 블록체인에 해시 값 기록
    const tx = await this.contract.addWasteRecord(hash);
    await tx.wait();

    // Waste 객체 생성 및 저장
    const wasteRecord = this.wasteRepository.create({
      user: user,
      wasteAmount: wasteData.wasteAmount,
      wasteType: wasteData.wasteType,
      recordDate: wasteData.recordDate,
      wasteHash: hash,
      transactionHash: tx.hash,
    });

    await this.wasteRepository.save(wasteRecord);

    // Goal 업데이트 로직 추가
    const goal = await this.goalRepository.findOne({
      where: {
        user: { userId: wasteData.userId },
        wasteType: wasteData.wasteType,
      },
    });

    if (goal) {
      // currentAmount와 achievementRate 업데이트
      goal.currentAmount = wasteData.wasteAmount;
      goal.achievementRate = goal.currentAmount > 0
        ? (goal.targetAmount / goal.currentAmount) * 100
        : 0;

      await this.goalRepository.save(goal);
    }

    return { wasteRecord: wasteRecord };
  }

  async getWasteRecords(userId: number): Promise<Waste[]> {
    return this.wasteRepository.find({
      where: { user: { userId } },
      relations: ['user'],
    });
  }

  async collectWaste(collectData: CollectWasteDto) {
    const { dischargeTime, dischargeAddress, processingBuilding } = collectData;

    return {
      dischargeTime,
      dischargeAddress,
      processingBuilding,
    };
  }

  // async checkAndReward(wasteData: any, criteria: number, wasteType: string) {
  //   const difference = criteria - wasteData.amount;
  //   if (difference > 0) {
  //     const rewardAmount = calculateReward(difference); // 보상 계산 로직
  //     await this.contract.rewardTokens(wasteData.userAddress, wasteType, rewardAmount);
  //   }
  // }
}