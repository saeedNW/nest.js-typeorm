import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBlogDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsNotEmpty()
	@IsString()
	text: string;

	@IsNotEmpty()
	@IsNumber()
	userId: number;
}
