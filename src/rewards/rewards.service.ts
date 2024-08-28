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

    const co2Reduction = this.calculateCo2Reduction(wasteType, goal.currentAmount);
    const tokenAmount = this.calculateTokenAmount(co2Reduction);

    if (tokenAmount > 0) {
      const tx = await this.contract.rewardTokens(user.walletAddress, wasteType, tokenAmount);
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

  private calculateCo2Reduction(wasteType: string, currentAmount: number): number {
    const CO2_FACTORS = {
    // target: 기준값, factor: CO2 발생계수
      '영농 폐기물': { target: 0.0022, factor: 1.65 },
      '폐비닐': { target: 0.0023, factor: 1.65 },
      '합성수지(PE류 제외)': { target: 0.001, factor: 1.989 },
      '기타 폐기물': { target: 0.000026, factor: 0.565 },
      '우수 및 오수': { target: 1500, factor: 0.0623 / 1000 } // L/day to t/day
    };

    const { target, factor } = CO2_FACTORS[wasteType] || { target: 0, factor: 0 };
    // 기준값보다 많이 발생한 경우 보상 제외 (0으로 설정)
    const reduction = Math.max(0, target - currentAmount); 

    return reduction * factor;
  }

  private calculateTokenAmount(co2Reduction: number): number {
    const TOKEN_PER_TON_CO2 = 100; // 1톤의 CO2 저감 = 100 EFT
    const MINIMUM_REWARD = 2; // 최소 보상 양 (2 EFT)
    
    // 기본적으로 CO2 저감량에 따라 보상 계산
    let tokenAmount = Math.floor(co2Reduction * TOKEN_PER_TON_CO2);

    // 만약 계산된 토큰 양이 최소 보상 양보다 작다면, 최소 보상 적용
    if (tokenAmount > 0 && tokenAmount < MINIMUM_REWARD) {
        tokenAmount = MINIMUM_REWARD;
    }

    return tokenAmount;
  }

  async getRewards(userId: number): Promise<Reward[]> {
    return await this.rewardsRepository.find({ where: { user: { userId } }, relations: ['goal'] });
  }
}