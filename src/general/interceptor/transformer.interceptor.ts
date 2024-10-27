import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { map } from "rxjs";

//? Implementing custom response logic for server responses.

@Injectable()
export class TransformerInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): any {
		return next.handle().pipe(
			map((data) => {
				const ctx = context.switchToHttp();
				const Response = ctx.getResponse();
				const statusCode = Response.statusCode;

				if (typeof data === "string") {
					return {
						statusCode,
						success: true,
						message: data,
					};
				}
				return {
					statusCode,
					success: true,
					message: "Process ended successfully",
					data,
				};
			})
		);
	}
}
