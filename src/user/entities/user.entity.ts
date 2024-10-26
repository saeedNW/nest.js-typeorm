import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity("user")
export class UserEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;
	@Column()
	firstName: string;
	@Column()
	lastName: string;
	@Column()
	email: string;
	@Column({ nullable: true })
	age: number;
	@CreateDateColumn()
	createdAt: Date;
}
