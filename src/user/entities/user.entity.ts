import { BlogEntity } from "src/blog/entities/blog.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
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
	@OneToMany(() => BlogEntity, (blog) => blog.user)
	blogs: BlogEntity[];
}
