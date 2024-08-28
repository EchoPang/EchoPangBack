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
  wasteAmount: number;

  @Column()
  wasteType: string; // '영농 폐기물', '폐비닐', '합성수지'

  @Column()
  targetWasteAmount: number;

  @Column()
  currentProgress: number;

  @OneToOne(() => Reward, reward => reward.goal)
  reward: Reward;
}