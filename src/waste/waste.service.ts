import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { ethers } from 'ethers';

@Injectable()
export class WasteService {
  // 스마트 컨트랙트 연결 설정
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
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

  // 스마트 컨트랙트에 해시값 저장
  async recordWaste(wasteData: any) {
    const hash = crypto.createHash('sha256').update(JSON.stringify(wasteData)).digest('hex');

    const tx = await this.contract.addWasteRecord(hash);
    await tx.wait();

    return { transactionHash: tx.hash, wasteHash: hash };
  }

  // async checkAndReward(wasteData: any, criteria: number, wasteType: string) {
  //   const difference = criteria - wasteData.amount;
  //   if (difference > 0) {
  //     const rewardAmount = calculateReward(difference); // 보상 계산 로직
  //     await this.contract.rewardTokens(wasteData.userAddress, wasteType, rewardAmount);
  //   }
  // }
}