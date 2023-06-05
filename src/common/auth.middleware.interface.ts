import { NextFunction, Request, Response } from 'express';

export interface IAuthRequest extends Request {
	userId: number;
}

export interface IAuthMiddleware {
	execute: (req: IAuthRequest, res: Response, next: NextFunction) => void;
}
