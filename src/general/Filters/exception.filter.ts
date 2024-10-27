import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from "@nestjs/common";
import { Response } from "express";

//? Implementing custom response logic for exceptions.

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response: Response = ctx.getResponse<Response>();
		const statusCode: number = exception.getStatus();

		const exceptionResponse: string | object = exception.getResponse();
		let message: string = "";

		// Check if the response is an object or a string
		if (typeof exceptionResponse === "string") {
			message = exceptionResponse; // Handle case where it's a string
		} else if (
			typeof exceptionResponse === "object" &&
			"message" in exceptionResponse
		) {
			message = (exceptionResponse as { message: string }).message; // Handle case where it's an object
		}

		response.status(statusCode).json({
			statusCode,
			success: false,
			message,
			timestamp: new Date().toISOString(),
		});
	}
}
