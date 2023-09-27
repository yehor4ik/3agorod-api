import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './components/users/user.controller';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { json } from 'body-parser';
import { PostgresqlService } from './database/postgresql.service';
import { CollectionController } from './components/controller/collection.controller';
import cors from 'cors';
import { ImageController } from './components/images/image.controller';
import { PriceController } from './components/prices/price.controller';
import { StockController } from './components/stocks/stock.controller';
import { ProductController } from './components/product/product.controller';
import { CronService } from './cron/cron.service';

interface ICorsOptions {
	origin: string;
}

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;
	corsOptions: ICorsOptions;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.PostgresqlService) private readonly postgresqlService: PostgresqlService,
		@inject(TYPES.CollectionController)
		private readonly collectionController: CollectionController,
		@inject(TYPES.ImageController)
		private readonly imageController: ImageController,
		@inject(TYPES.PriceController) private readonly priceController: PriceController,
		@inject(TYPES.StockController) private readonly stockController: StockController,
		@inject(TYPES.ProductController) private readonly productController: ProductController,
		@inject(TYPES.CronService) private readonly croneService: CronService,
	) {
		this.app = express();
		this.port = 8000;
		this.corsOptions = {
			origin: 'http://localhost:3000',
		};
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/collections', this.collectionController.router);
		this.app.use('/images', this.imageController.router);
		this.app.use('/prices', this.priceController.router);
		this.app.use('/stocks', this.stockController.router);
		this.app.use('/products', this.productController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	useCors(): void {
		this.app.use(cors(this.corsOptions));
	}

	public async init(): Promise<void> {
		await this.postgresqlService.connect();
		await this.croneService.initCronDeletingImages();
		this.useMiddleware();
		this.useCors();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server has been ran on the: http://localhost:${this.port}`);
	}
}
