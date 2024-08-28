import { Reward } from 'src/rewards/reward.entity';
import { Waste } from 'src/waste/waste.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  walletAddress: string;

  @Column({ unique: true })
  email: string;

  @Column('json')
  farmInfo: {
    businessRegistrationNumber: string;
    companyName: string;
    representativeName: string;
    sector: string; // 예: "시설원예", "과수", "노지"
    location: string;
  };

  @CreateDateColumn()
  registeredAt: Date;

  // FK definition
  @OneToMany(() => Waste, waste => waste.user)
  waste: Waste[];

  @OneToMany(() => Reward, waste => waste.user)
  rewards: Reward[];
}