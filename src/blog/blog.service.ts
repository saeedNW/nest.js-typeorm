import { Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";

@Injectable()
export class BlogService {
	constructor(
		@InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>
	) {}

	async create(createBlogDto: CreateBlogDto) {
		const { text, title, userId } = createBlogDto;
		await this.blogRepository.insert({ text, title, userId });
		return "This action adds a new blog";
	}

	async findAll() {
		//? Retrieve all blogs data and use relation to get author (use) data.
		//? Relations in typeorm use SQL joins to joni tables data and retrieve
		//? a joined data.
		return await this.blogRepository.find({
			relations: {
				user: true,
			},
			select: {
				user: {
					id: true,
					firstName: true,
					lastName: true,
				},
			},
		});
	}

	findOne(id: number) {
		return `This action returns a #${id} blog`;
	}

	update(id: number, updateBlogDto: UpdateBlogDto) {
		return `This action updates a #${id} blog`;
	}

	remove(id: number) {
		return `This action removes a #${id} blog`;
	}
}
