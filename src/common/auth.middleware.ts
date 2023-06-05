import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { IAuthMiddleware, IAuthRequest } from './auth.middleware.interface';

interface IDecodedToken {
	userId: number;
}

export class AuthMiddleware implements IAuthMiddleware {
	constructor(private secretKey: string) {}
	execute(req: IAuthRequest, res: Response, next: NextFunction): void {
		try {
			const authHeader = req.headers.authorization;

			if (!authHeader) {
				res.status(401).json({ err: 'Authorization header missing' });
			} else {
				const token = authHeader.split(' ')[1];
				const decodedToken = jwt.verify(token, this.secretKey) as IDecodedToken;
				req.userId = decodedToken.userId;
				next();
			}
		} catch {
			res.status(401).json({ error: 'Invalid token' });
		}
	}
}
