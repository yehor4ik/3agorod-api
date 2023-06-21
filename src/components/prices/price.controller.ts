import { BaseController } from '../../common/base.controller';
import { IPriceController, IPriceParams } from './price.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { IConfigService } from '../../config/config.service.interface';
import { RequestValidateMiddleware } from '../../common/request-validate.middleware';
import { PriceCreateDto } from './dto/price-create.dto';
import { IPriceService } from './price.service.interface';
import { Price } from './price.model';
import { AuthMiddleware } from '../../common/auth.middleware';
import { PriceUpdateDto } from './dto/price-update.dto';

@injectable()
export class PriceController extends BaseController implements IPriceController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.PriceService) private priceService: IPriceService,
	) {
		super(loggerService);
		this.setNameController(PriceController.name);
		const secret = this.configService.get<string>('JWT_SECRET_KEY');

		this.bindRoutes([
			{ method: 'get', path: '/', func: this.get, middlewares: [] },
			{
				method: 'delete',
				path: '/:priceId',
				func: this.delete,
				middlewares: [new AuthMiddleware(secret)],
			},
			{
				method: 'post',
				path: '/',
				func: this.create,
				middlewares: [new AuthMiddleware(secret), new RequestValidateMiddleware(PriceCreateDto)],
			},
			{
				method: 'put',
				path: '/:priceId',
				func: this.update,
				middlewares: [new AuthMiddleware(secret), new RequestValidateMiddleware(PriceUpdateDto)],
			},
		]);
	}
	async create(
		{ body }: Request<{}, {}, PriceCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const createdPrice = await this.priceService.create(body);
			this.created<Price>(res, createdPrice);
		} catch (e) {
			next(e);
		}
	}
	async get(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const prices = await this.priceService.getAll();
			this.created<Price[]>(res, prices);
		} catch (e) {
			next(e);
		}
	}
	async update(
		req: Request<IPriceParams, {}, PriceUpdateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { body, params } = req;
			const collectionId = params.priceId;
			const updatedPrice = await this.priceService.update(body, collectionId);

			this.ok<Price>(res, updatedPrice);
		} catch (e) {
			next(e);
		}
	}
	async delete(
		{ params }: Request<IPriceParams>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { priceId } = params;
			const result = await this.priceService.delete(priceId);

			this.ok(res, result);
		} catch (e) {
			next(e);
		}
	}
}
