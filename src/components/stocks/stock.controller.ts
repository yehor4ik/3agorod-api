import { BaseController } from '../../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { IConfigService } from '../../config/config.service.interface';
import { IStockController, IStockParams } from './stock.controller.interface';
import { StockCreateDto } from './dto/stock-create.dto';
import { StockUpdateDto } from './dto/stock-update.dto';
import { IStockService } from './stock.service.interface';
import { HttpError } from '../../errors/http-error.class';
import { Stock } from './stock.model';
import { AuthMiddleware } from '../../common/auth.middleware';
import { RequestValidateMiddleware } from '../../common/request-validate.middleware';
import { ICreateStockResponse } from './types/create-stock-response.interface';

@injectable()
export class StockController extends BaseController implements IStockController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.StockService) private stockService: IStockService,
	) {
		super(loggerService);
		this.setNameController(StockController.name);
		const secret = this.configService.get<string>('JWT_SECRET_KEY');

		this.bindRoutes([
			{ method: 'get', path: '/', func: this.get },
			{
				method: 'delete',
				path: '/:stockId',
				func: this.delete,
				middlewares: [new AuthMiddleware(secret)],
			},
			{
				method: 'post',
				path: '/',
				func: this.create,
				middlewares: [new AuthMiddleware(secret), new RequestValidateMiddleware(StockCreateDto)],
			},
			{
				method: 'put',
				path: '/:stockId',
				func: this.update,
				middlewares: [new AuthMiddleware(secret), new RequestValidateMiddleware(StockUpdateDto)],
			},
		]);
	}
	async create(
		{ body }: Request<{}, {}, StockCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const createdStock = await this.stockService.create(body);
		const isError = createdStock instanceof HttpError;

		isError ? next(createdStock) : this.created<ICreateStockResponse>(res, createdStock);
	}
	async get(req: Request, res: Response, next: NextFunction): Promise<void> {
		const stocks = await this.stockService.getAll();
		const isError = stocks instanceof HttpError;

		isError ? next(stocks) : this.created<Stock[]>(res, stocks);
	}
	async update(
		req: Request<IStockParams, {}, StockUpdateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { body, params } = req;
		const stockId = params.stockId;
		const updatedStock = await this.stockService.update(body, stockId);
		const isError = updatedStock instanceof HttpError;

		isError ? next(updatedStock) : this.ok<Stock>(res, updatedStock);
	}
	async delete(
		{ params }: Request<IStockParams>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { stockId } = params;
		const result = await this.stockService.delete(stockId);
		const isError = result instanceof HttpError;

		isError ? next(result) : this.ok(res, result);
	}
}
