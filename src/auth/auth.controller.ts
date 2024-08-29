import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')  // Base URL
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body('walletAddress') walletAddress: string) {
    const user = await this.usersService.findByWalletAddress(walletAddress);

    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다. 먼저 회원가입을 진행하세요.');
    }

    const jwt = await this.authService.generateJwt(user);
    return { userId: user.userId, accessToken: jwt };
  }

  @Post('register')
  async register(
    @Body('walletAddress') walletAddress: string,
    @Body('email') email: string,
    @Body('farmInfo') farmInfo: any,
  ) {
    const existingUser = await this.usersService.findByWalletAddress(walletAddress);

    if (existingUser) {
      throw new UnauthorizedException('이미 등록된 지갑 주소입니다.');
    }

    const newUser = await this.usersService.createUser(walletAddress, email, farmInfo);
    const jwt = await this.authService.generateJwt(newUser);
    return { userId: newUser.userId, accessToken: jwt };
  }
}
