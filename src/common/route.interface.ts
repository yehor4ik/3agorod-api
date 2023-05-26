import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';
import { ICollectionParams } from '../collections/collection.controller.interface';

export interface IControllerRoute<T = {}> {
	path: string;
	func: (req: Request<any>, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleware[];
}

export type TReturnExpress = Response<any, Record<string, any>>;
