import express, { Express } from 'express';
import { Server } from 'http';
import { UserController } from './users/user.controller';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { json } from 'body-parser';
import { IConfigService } from './config/config.service.interface';
import { PostgresqlService } from './database/postgresql.service';
import { CollectionController } from './collections/collection.controller';
import { ICollectionService } from './collections/collection.service.interface';
import { ICollectionRepository } from './collections/collection.repository.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private userController: UserController,
		@inject(TYPES.IExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
		@inject(TYPES.PostgresqlService) private readonly postgresqlService: PostgresqlService,
		@inject(TYPES.CollectionController)
		private readonly collectionController: CollectionController,
		@inject(TYPES.CollectionService) private readonly collectionService: ICollectionService,
		@inject(TYPES.CollectionRepository)
		private readonly collectionRepository: ICollectionRepository,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/collections', this.collectionController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.postgresqlService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server has been ran on the: http://localhost:${this.port}`);
	}
}
