import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: User): Promise<string> {
    const payload = { sub: user.userId, walletAddress: user.walletAddress };
    return this.jwtService.sign(payload);
  }
}
