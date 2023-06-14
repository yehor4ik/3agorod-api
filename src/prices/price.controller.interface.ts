import { NextFunction, Request, Response } from 'express';
import { PriceCreateDto } from './dto/price-create.dto';
import { PriceUpdateDto } from './dto/price-update.dto';

export interface IPriceController {
	create: (
		req: Request<{}, {}, PriceCreateDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (
		req: Request<IPriceParams, {}, PriceUpdateDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	delete: (req: Request<IPriceParams>, res: Response, next: NextFunction) => Promise<void>;
}

export interface IPriceParams {
	priceId: string;
}
