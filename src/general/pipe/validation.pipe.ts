import {
	ArgumentMetadata,
	BadRequestException,
	UnprocessableEntityException,
	ValidationPipe,
} from "@nestjs/common";

//? Change the status code of the validation pipe to 422 instead of 400
//? Use this class instead of original validation pipe

export class ValidationPipe422 extends ValidationPipe {
	public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
		try {
			return await super.transform(value, metadata);
		} catch (err) {
			if (err instanceof BadRequestException) {
				const exceptionResponse: string | object = err.getResponse();
				let message: string = "";

				if (typeof exceptionResponse === "string") {
					message = exceptionResponse;
				} else if (
					typeof exceptionResponse === "object" &&
					"message" in exceptionResponse
				) {
					message = (exceptionResponse as { message: string }).message;
				}
				
				throw new UnprocessableEntityException(message);
			}
		}
	}
}
