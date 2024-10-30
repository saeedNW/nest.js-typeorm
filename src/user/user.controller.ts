import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	Query,
	BadRequestException,
	DefaultValuePipe,
	Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { plainToClass } from "class-transformer";

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post("create")
	create(@Body() createUserDto: CreateUserDto) {
		//? Use 'plainToClass' method from 'class-transformer' module in order
		//? to filter client's sent data and removed unneeded and invalid data.
		const filteredData = plainToClass(CreateUserDto, createUserDto, {
			excludeExtraneousValues: true,
		});

		return this.userService.create(filteredData);
	}

	@Post("insert")
	insert(@Body() createUserDto: CreateUserDto) {
		const filteredData = plainToClass(CreateUserDto, createUserDto, {
			excludeExtraneousValues: true,
		});

		return this.userService.insert(filteredData);
	}

	@Get()
	findAll() {
		return this.userService.findAll();
	}

	@Get("search")
	search(@Query("search") search: string) {
		return this.userService.search(search);
	}

	@Get("date-filter")
	dateFilter(@Query("search") search: string) {
		return this.userService.dateFilter(search);
	}

	@Get("order")
	order(@Query("order") order: string) {
		if (!["ASC", "asc", "DESC", "desc"].includes(order)) {
			throw new BadRequestException("The given value is an invalid order type");
		}

		return this.userService.order(order);
	}

	@Get("paginate")
	async index(
		@Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
		@Query("limit", new DefaultValuePipe(5), ParseIntPipe) limit: number = 10,
		@Query("search") search: string,
		@Query("order", new DefaultValuePipe("ASC")) order: string
	) {
		if (!["ASC", "DESC"].includes(order)) {
			throw new BadRequestException("The given value is an invalid order type");
		}

		return this.userService.paginate(
			{
				page,
				limit,
				route: "http://localhost:3000/user/paginate",
			},
			search,
			order
		);
	}

	@Get("selection")
	selection() {
		return this.userService.selection();
	}

	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.userService.findOne(id);
	}

	@Patch(":id")
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto
	) {
		const filteredData = plainToClass(UpdateUserDto, updateUserDto, {
			excludeExtraneousValues: true,
		});

		return this.userService.update(id, filteredData);
	}

	@Put(":id")
	updateByField(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto
	) {
		const filteredData = plainToClass(UpdateUserDto, updateUserDto, {
			excludeExtraneousValues: true,
		});

		return this.userService.updateByField(id, filteredData);
	}

	@Delete("/remove/:id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.userService.remove(id);
	}

	@Delete("/delete/:id")
	delete(@Param("id", ParseIntPipe) id: number) {
		return this.userService.delete(id);
	}
}
