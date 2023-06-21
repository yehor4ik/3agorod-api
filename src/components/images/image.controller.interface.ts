import { NextFunction, Request, Response } from 'express';

export interface IImageController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request<IRemoveImageParams>, res: Response, next: NextFunction) => Promise<void>;
	get: (req: Request<IGetImageParams>, res: Response, next: NextFunction) => Promise<void>;
}

export interface IRemoveImageParams {
	imageId: string;
}

export interface IGetImageParams {
	filename: string;
}
