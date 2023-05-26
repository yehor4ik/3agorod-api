import { NextFunction, Request, Response } from 'express';

export interface ICollectionController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (req: Request<ICollectionParams>, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request<ICollectionParams>, res: Response, next: NextFunction) => Promise<void>;
}

export interface ICollectionParams {
	collectionId: string;
}
