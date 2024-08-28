import { Reward } from 'src/rewards/reward.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  goalId: number;

  @ManyToOne(() => User, user => user.waste)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  wasteType: string; // 영농 폐기물, 폐비닐, 합성수지(PE류 제외), 기타 폐기물, 오수

  @Column('decimal', { precision: 10, scale: 6 })
  targetAmount: number; // 목표량

  @Column('decimal', { precision: 10, scale: 6 })
  currentAmount: number; // 현재 배출량

  @Column()
  unit: string; // 단위 (예: t/day, L/day)
  
  @Column('decimal', { precision: 5, scale: 2 })
  achievementRate: number; // 달성 현황(%)

  @OneToOne(() => Reward, reward => reward.goal)
  reward: Reward;
}