import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class RequestValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}
	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance, { whitelist: true, forbidNonWhitelisted: true }).then((errors) => {
			if (errors.length > 0) {
				const newErrors: Record<string, string> = errors.reduce((acc, cur) => {
					const firstFieldError = Object.values(cur?.constraints ?? {})[0];
					return {
						...acc,
						[cur.property]: firstFieldError,
					};
				}, {});
				res.status(400).send(newErrors);
			} else {
				next();
			}
		});
	}
}
