import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Waste {
  @PrimaryGeneratedColumn()
  wasteId: number;

  @ManyToOne(() => User, user => user.waste)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  wasteAmount: number;

  @Column()
  wasteType: string; // 예: '영농 폐기물', '폐비닐', '합성수지', ...

  @CreateDateColumn()
  recordDate: Date; // 자동으로 주차 단위로 관리

  @Column({ nullable: true })
  wasteHash: string; 
}