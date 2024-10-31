import { BlogEntity } from "src/blog/entities/blog.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { ProfileEntity } from "./profile.entity";

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
	@Column({ nullable: true })
	profileId: number;
	@OneToOne(() => ProfileEntity, (profile) => profile.user, {
		onDelete: "SET NULL",
		nullable: true,
		//? If you have a relation option which you want it to be returned when retrieving
		//? data from database automatically (No `relation` method required in find call)
		//? you can activate the option 'eager' for that filed.
		//? The 'eager' option can be use in all of the relation options such as
		//? 'One to One'  OR One to Many' but it's recommended to only use it for 'One to One'
		//? relations which has less data that needed to be retrieved and don't use it on fields
		//? which has some heavy data.
		//? Note that the usage of this method is optional and depends on you and your project
		//? codding style.
		// eager: true,
	})
	@JoinColumn({ name: "profileId" })
	profile: ProfileEntity;
}
