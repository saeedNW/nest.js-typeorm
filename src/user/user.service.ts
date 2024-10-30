import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { isDate, isEmail } from "class-validator";
import { IPaginationOptions, paginate } from "nestjs-typeorm-paginate";
import {
	And,
	FindOptionsOrder,
	FindOptionsWhere,
	ILike,
	LessThanOrEqual,
	MoreThanOrEqual,
	Repository,
} from "typeorm";

@Injectable()
export class UserService {
	constructor(
		//? In order to be able to use an entity in a module's service, you need to add
		//? the entity to that service's constructor by using 'InjectRepository' decorator
		//? and define it as a private variable.
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
	) {}

	async create(createUserDto: CreateUserDto) {
		//? In typeorm, the 'create' method will create an instance of the repository
		//? with the given data, but unlike mongoose it wont save the data into
		//? database automatically. In order to save the data into database you
		//? need to call 'save' method and pass the created instance to it.
		//? The output of the 'create/save' method is an object of the data
		//? saved in database.
		const user = this.userRepository.create(createUserDto);
		return await this.userRepository.save(user);
	}

	async insert(createUserDto: CreateUserDto) {
		//? In typeorm, the 'insert' method will create an instance of the repository
		//? with the given data and save it into the database at the same time.
		//? Note that the output of the 'insert' method id a nested object of the data
		//? of the instance created from repository.
		return this.userRepository.insert(createUserDto);
	}

	async findAll() {
		//? In typeorm, you can use 'findBy' or 'find' methods to
		//? retrieve data from database.
		//? You cab use these methods with query options to retrieve certain
		//? data from database or without it to retrieve all of the data.
		//? Note that the 'findBy' method accept data name as query options while
		//? the 'find' method accept regular query options.
		//* findBy EX => this.userRepository.findBy({firstName:"Some first name"});
		return await this.userRepository.find({});
	}

	async search(search: string) {
		//? `where: FindOptionsWhere<UserEntity> = {}` — Initializes the `where` object, which will hold search
		//? criteria if any are specified. This object is later used to filter results in the query.
		let where: FindOptionsWhere<UserEntity> = {};

		if (search) {
			where["firstName"] = search;
		}
		return await this.userRepository.find({ where });
	}

	async dateFilter(search: string) {
		let where: FindOptionsWhere<UserEntity> = {};

		if (search && isDate(new Date(search))) {
			const date = new Date(search);
			const startedAt = new Date(date.setUTCHours(0, 0, 0));
			const finishedAt = new Date(date.setUTCHours(23, 59, 59));
			where["createdAt"] = And(
				MoreThanOrEqual(startedAt),
				LessThanOrEqual(finishedAt)
			);
		}

		return await this.userRepository.find({ where });
	}

	async order(order: string) {
		//? The `order` option in TypeORM allows you to specify the sorting order for query results, making it easy
		//? to retrieve data in a specified sequence. When using `find()` or `findMany()`, you can pass an `order`
		//? object to set sorting conditions based on the fields of the entity.
		return await this.userRepository.find({
			where: {},
			//? The `as FindOptionsOrder<UserEntity>["id"]` type assertion is used here to ensure that the
			//? `order` parameter aligns with TypeORM’s expected values (`ASC` or `DESC`) for the `id` field, preventing
			//? any type errors during compilation.
			order: { id: order as FindOptionsOrder<UserEntity>["id"] },
		});
	}

	async paginate(options: IPaginationOptions, search: string, order: string) {
		let where: FindOptionsWhere<UserEntity> = {};

		if (search) {
			where["firstName"] = ILike(search);
		}

		//? `createQueryBuilder("user")` — Creates a query builder instance named "user" for constructing the
		//? SQL query. Query builders allow complex SQL-like operations such as filtering, ordering, and pagination.
		const queryBuilder = this.userRepository
			.createQueryBuilder("user")
			.where(where)
			.orderBy("user.id", order as "ASC" | "DESC");

		//? Using the "pagination" method from the "nestjs-typeorm-paginate" module to automate the pagination process
		return await paginate<UserEntity>(queryBuilder, options);
	}

	async selection() {
		return await this.userRepository.find({
			where: {},
			select: { firstName: true, lastName: true },
		});
	}

	async findOne(id: number) {
		//? In typeorm, you can use 'findOne' method in order to be able to write
		//? queries to find and retrieve data from database
		const user = await this.userRepository.findOne({
			where: { id },
		});

		if (!user) {
			throw new NotFoundException("User was not found");
		}

		return user;
	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id);

		await this.userRepository.update({ id }, updateUserDto);

		return "User updated successfully";
	}

	async updateByField(id: number, updateUserDto: UpdateUserDto) {
		const user = await this.findOne(id);
		const { firstName, lastName, age, email } = updateUserDto;

		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (age) user.age = age;
		if (email && isEmail(email)) user.email = email;

		await this.userRepository.save(user);

		return "User updated successfully";
	}

	async remove(id: number) {
		const user = await this.findOne(id);

		await this.userRepository.remove(user);

		return `User has been removed`;
	}

	async delete(id: number) {
		await this.findOne(id);

		await this.userRepository.delete({ id });

		return `User has been removed`;
	}
}
