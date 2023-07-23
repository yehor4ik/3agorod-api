import { Response, Request } from 'express';
import { IExceptionFilter } from './exception.filter.interface';
import { HttpError } from './http-error.class';
import { injectable, inject } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode} ${err.message}`);
			res.status(err.statusCode).send(err.message);
		} else {
			this.logger.error(`${err.message}`);
		}
	}
}
