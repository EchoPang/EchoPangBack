import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Goal } from './goals/goal.entity';
import { GoalsModule } from './goals/goals.module';
import { Reward } from './rewards/reward.entity';
import { RewardsModule } from './rewards/rewards.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { Waste } from './waste/waste.entity';
import { WasteModule } from './waste/waste.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Waste, Reward, Goal],
        synchronize: true, // 개발 환경 true
      }),
    }),
    AuthModule,
    UsersModule,
    WasteModule,
    GoalsModule,
    RewardsModule,
  ],
})
export class AppModule {}