import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 사용자 조회 및 업데이트

  // @UseGuards(JwtAuthGuard)
  // @Get('me')
  // async getMe(@Req() req: Request) {
  //   const userId = req.user['sub'];
  //   return this.usersService.findById(userId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put('me')
  // async updateMe(
  //   @Req() req: Request,
  //   @Body('email') email: string,
  //   @Body('farmInfo') farmInfo: any,
  // ) {
  //   const userId = req.user['sub'];
  //   return this.usersService.updateUser(userId, email, farmInfo);
  // }
}
