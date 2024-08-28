import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { walletAddress } });
  }

  async createUser(walletAddress: string, email: string, farmInfo: any): Promise<User> {
    const newUser = this.usersRepository.create({
      walletAddress,
      email,
      farmInfo,
      registeredAt: new Date(),
    });
    return this.usersRepository.save(newUser);
  }
}
