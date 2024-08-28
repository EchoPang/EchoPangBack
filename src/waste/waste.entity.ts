import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Waste {
  @PrimaryGeneratedColumn()
  wasteId: number;

  @ManyToOne(() => User, user => user.waste)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('decimal', { precision: 10, scale: 6 })
  wasteAmount: number; // 폐기물 배출량

  @Column()
  wasteType: string; // 영농 폐기물, 폐비닐, 합성수지(PE류 제외), 기타 폐기물, 오수

  @CreateDateColumn()
  recordDate: Date; // 일주일에 한 번 날짜로 기록되게 함

  @Column({ nullable: true })
  wasteHash: string; // waste data hash 값을 blockchain에 저장
}