import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@Expose()
	firstName: string;
	@IsString()
	@IsNotEmpty()
	@Expose()
	lastName: string;
	@IsNumber()
	@IsNotEmpty()
	@Expose()
	age: number;
	@IsEmail()
	@IsNotEmpty()
	@Expose()
	email: string;
}
