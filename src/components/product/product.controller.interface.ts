import { NextFunction, Request, Response } from 'express';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';

export interface IProductController {
	create: (
		req: Request<{}, {}, ProductCreateDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (
		req: Request<IProductParams, {}, ProductUpdateDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	delete: (req: Request<IProductParams>, res: Response, next: NextFunction) => Promise<void>;
}

export interface IProductParams {
	productId: string;
}
