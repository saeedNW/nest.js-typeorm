import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { ProfileEntity } from "./entities/profile.entity";

@Module({
	//? In order to be able to use an entity in a module you
	//? need to add that into the 'imports' option of that module
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		TypeOrmModule.forFeature([ProfileEntity]),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
