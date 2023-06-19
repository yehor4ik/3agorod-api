import { NextFunction, Request, Response } from 'express';
import { StockCreateDto } from './dto/stock-create.dto';
import { StockUpdateDto } from './dto/stock-update.dto';

export interface IStockController {
	create: (
		req: Request<{}, {}, StockCreateDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	get: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	update: (
		req: Request<IStockParams, {}, StockUpdateDto>,
		res: Response,
		next: NextFunction,
	) => Promise<void>;
	delete: (req: Request<IStockParams>, res: Response, next: NextFunction) => Promise<void>;
}

export interface IStockParams {
	stockId: string;
}
