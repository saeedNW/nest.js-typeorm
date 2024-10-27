import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { HttpExceptionFilter } from "./general/Filters/exception.filter";
import { ValidationPipe422 } from "./general/pipe/validation.pipe";

@Module({
	imports: [
		//? In NestJS, TypeORM is a popular choice for managing database interactions using the Active Record or
		//? Data Mapper patterns. TypeORM simplifies handling complex SQL operations by using object-oriented
		//? programming principles, allowing you to define entities as classes and perform database operations
		//? through methods rather than writing raw SQL.

		//? To use TypeORM in NestJS, start by configuring it in `AppModule`. Import `TypeOrmModule`
		//? and use the `forRoot` method to specify connection details such as database type, host, port,
		//? username, password, and entities.
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "localhost",
			port: 5432,
			username: "postgres",
			password: "root",
			database: "typeorm",
			autoLoadEntities: true,
			entities: [],
			synchronize: true, //? Don't set this value to true in production. Data Lost Warning
		}),
		UserModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_PIPE,
			useClass: ValidationPipe422,
		},
	],
})
export class AppModule {}
