import {Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export abstract class BaseTimeEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    // 엔티티 생성 시 자동으로 현재 시간 저장
    @CreateDateColumn({ type: 'timestamptz' })  // PostgreSQL의 timestamp with time zone 타입
    createdAt!: Date;

    // 엔티티가 업데이트될 때 자동으로 값이 들어감
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;

    // 생성한 사용자 ID (숫자 타입)
    @Column({ type: 'int', nullable: true })
    createdBy?: number;

    // 수정한 사용자 ID (숫자 타입)
    @Column({ type: 'int', nullable: true })
    updatedBy?: number;
}
