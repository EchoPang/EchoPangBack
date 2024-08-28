import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Goal } from '../goals/goal.entity';
import { User } from '../users/user.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  rewardId: number;

  @Column()
  transactionId: string; // 보상 지급 tx id

  @ManyToOne(() => User, user => user.rewards)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Goal, goal => goal.reward)
  @JoinColumn({ name: 'goalId' })
  goal: Goal; // 달성한 목표

  @Column()
  wasteType: string; // 영농 폐기물, 폐비닐, 합성수지(PE류 제외), 기타 폐기물, 오수

  @Column()
  description: string; // 보상 사유

  @CreateDateColumn()
  rewardDate: Date; // 지급 일자

  @Column()
  rewardState: string; // 지급 상태 (지급 완료...?)

  @Column('decimal')
  tokenAmount: number; // 지급 토큰양
}
