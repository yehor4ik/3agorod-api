import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class RequestValidateMiddleware implements IMiddleware {
	constructor(private classToValidate: ClassConstructor<object>) {}
	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToClass(this.classToValidate, body);
		validate(instance, { whitelist: true, forbidNonWhitelisted: true }).then((errors) => {
			if (errors.length > 0) {
				const newErrors: Record<string, string> = errors.reduce((acc, cur) => {
					if (Array.isArray(cur.children) && cur.children.length > 0) {
						return {
							...acc,
							...this.handleArrayError(cur.children, cur.property),
						};
					}
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

	protected handleArrayError(
		errorArray: ValidationError[],
		parent = '',
		result: Record<string, string> = {},
	): Record<string, string> {
		errorArray.forEach(({ property, constraints, children }) => {
			const propertyKey = parent ? `${parent}.${property}` : property;

			if (children && children.length > 0) {
				this.handleArrayError(children, propertyKey, result);
			} else {
				result[propertyKey] = Object.values(constraints ?? {})[0];
			}
		});

		return result;
	}
}
