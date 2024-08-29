import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { Goal } from '../goals/goal.entity';
import { User } from '../users/user.entity';
import { CreateRewardDto } from './\bdto/create-reward.dto';
import { Reward } from './reward.entity';

@Injectable()
export class RewardsService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(
    @InjectRepository(Reward) private rewardsRepository: Repository<Reward>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Goal) private goalRepository: Repository<Goal>,
    private configService: ConfigService,
  ) {
    const infuraProjectId = this.configService.get<string>('INFURA_PROJECT_ID');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    const contractAddress = this.configService.get<string>('TOKEN_CONTRACT_ADDRESS');

    this.provider = new ethers.JsonRpcProvider(`https://arbitrum-sepolia.infura.io/v3/${infuraProjectId}`);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    const contractABI = [
        "function balanceOf(address _user) public view returns (uint256)",
        "function rewardTokens(address _user, string memory _wasteType, uint256 _reward) public",
        "event RewardIssued(address indexed user, string wasteType, uint256 amount)"
    ];
    this.contract = new ethers.Contract(contractAddress, contractABI, this.wallet);
  }

  async createReward(createRewardDto: CreateRewardDto): Promise<Reward> {
    const { userId, goalId, wasteType, description } = createRewardDto;

    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const goal = await this.goalRepository.findOne({ where: { goalId } });
    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    const achievementRate = (goal.targetAmount / goal.currentAmount) * 100;
    let tokenAmount = this.calculateTokenAmount(achievementRate);
    tokenAmount = Math.ceil(tokenAmount);

    if (tokenAmount > 0) {
      const weiTokenAmount = ethers.parseUnits(tokenAmount.toString(), 18);
      const tx = await this.contract.rewardTokens(user.walletAddress, wasteType, weiTokenAmount);
      await tx.wait();

      const reward = this.rewardsRepository.create({
        transactionId: tx.hash,
        user,
        goal,
        wasteType: wasteType,
        description: description,
        rewardDate: new Date(),
        rewardState: '지급 완료',
        tokenAmount: tokenAmount,
      });

      return await this.rewardsRepository.save(reward);
    } else {
      throw new Error('No CO2 reduction achieved, no reward will be granted.');
    }
  }

  private calculateTokenAmount(achievementRate: number): number {
    const BASE_REWARD = 2; // 기본 보상 2 EFT

    let tokenAmount = 0;

    if (achievementRate >= 100) {
      // 목표 초과 달성 시 보상 증가
      tokenAmount = BASE_REWARD + BASE_REWARD * ((achievementRate - 100) / 5); // 100%를 넘는 달성률의 5%마다 보상 증가
    } else if (achievementRate >= 90) {
        tokenAmount = BASE_REWARD * 0.5; // 90% 이상 달성 시 기본 보상의 절반 지급
    } else {
        tokenAmount = 0; // 90% 미만 달성 시 보상 없음
    }

    return tokenAmount;
  }

  async getRewards(userId: number): Promise<Reward[]> {
    return await this.rewardsRepository.find({ where: { user: { userId } }, relations: ['goal'] });
  }

  async getBalance(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const balance = await this.contract.balanceOf(user.walletAddress);
    return ethers.formatUnits(balance, 18); // EFT 단위로 변환하여 반환
  }
}