import { BaseController } from '../../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { IConfigService } from '../../config/config.service.interface';
import { RequestValidateMiddleware } from '../../common/request-validate.middleware';
import { IProductController, IProductParams } from './product.controller.interface';
import { IProductService } from './product.service.interface';
import { Product } from './product.model';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';

@injectable()
export class ProductController extends BaseController implements IProductController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.ProductService) private productService: IProductService,
	) {
		super(loggerService);
		this.setNameController(ProductController.name);
		const secret = this.configService.get<string>('JWT_SECRET_KEY');

		this.bindRoutes([
			{ method: 'get', path: '/', func: this.get },
			// {
			// 	method: 'delete',
			// 	path: '/:stockId',
			// 	func: this.delete,
			// 	middlewares: [new AuthMiddleware(secret)],
			// },
			{
				method: 'post',
				path: '/',
				func: this.create,
				middlewares: [
					/*new AuthMiddleware(secret),*/ new RequestValidateMiddleware(ProductCreateDto),
				],
			},
			{
				method: 'put',
				path: '/:productId',
				func: this.update,
				middlewares: [
					/*new AuthMiddleware(secret),*/ new RequestValidateMiddleware(ProductUpdateDto),
				],
			},
		]);
	}
	async create(
		{ body }: Request<{}, {}, ProductCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const createdStock = await this.productService.create(body);
			this.created<Product>(res, createdStock);
		} catch (e) {
			next(e);
		}
	}
	async get(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const stocks = await this.productService.getAll();
			this.created<Product[]>(res, stocks);
		} catch (e) {
			next(e);
		}
	}
	async update(
		req: Request<IProductParams, {}, ProductUpdateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { body, params } = req;
			const productId = params.productId;
			const updatedStock = await this.productService.update(body, productId);
			this.ok<Product>(res, updatedStock);
		} catch (e) {
			next(e);
		}
	}
	// async delete(
	// 	{ params }: Request<IStockParams>,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> {
	// 	try {
	// 		const { stockId } = params;
	// 		const result = await this.stockService.delete(stockId);
	// 		this.ok(res, result);
	// 	} catch (e) {
	// 		next(e);
	// 	}
	// }
}
