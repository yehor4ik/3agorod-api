import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';
import { IAuthMiddleware } from './auth.middleware.interface';

export interface IControllerRoute<T = {}> {
	path: string;
	func: (req: Request<any>, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: (IMiddleware | IAuthMiddleware)[];
}

export type TReturnExpress = Response<any, Record<string, any>>;
