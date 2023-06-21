import { BaseController } from '../../common/base.controller';
import { ICollectionController, ICollectionParams } from './collection.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { ICollectionService } from './collection.service.interface';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { RequestValidateMiddleware } from '../../common/request-validate.middleware';
import { CollectionUpdateDto } from './dto/collection-update.dto';
import { Collection } from './collection.model';
import { AuthMiddleware } from '../../common/auth.middleware';
import { IConfigService } from '../../config/config.service.interface';

@injectable()
export class CollectionController extends BaseController implements ICollectionController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.CollectionService) private collectionService: ICollectionService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.setNameController(CollectionController.name);

		const secret = this.configService.get<string>('JWT_SECRET_KEY');
		this.bindRoutes([
			{ method: 'get', path: '/', func: this.get },
			{
				method: 'delete',
				path: '/:collectionId',
				func: this.delete,
				middlewares: [new AuthMiddleware(secret)],
			},
			{
				method: 'post',
				path: '/',
				func: this.create,
				middlewares: [
					new AuthMiddleware(secret),
					new RequestValidateMiddleware(CollectionCreateDto),
				],
			},
			{
				method: 'put',
				path: '/:collectionId',
				func: this.update,
				middlewares: [
					new AuthMiddleware(secret),
					new RequestValidateMiddleware(CollectionUpdateDto),
				],
			},
		]);
	}
	async create(
		{ body }: Request<{}, {}, CollectionCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const newCollection = await this.collectionService.createCollection(body);

			this.created<Collection>(res, newCollection);
		} catch (e) {
			next(e);
		}
	}
	async get(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const collections = await this.collectionService.getAllCollections();
			this.ok<Collection[]>(res, collections);
		} catch (e) {
			next(e);
		}
	}
	async update(
		req: Request<ICollectionParams, {}, CollectionCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { body, params } = req;
			const collectionId = params.collectionId;
			const updatedCollection = await this.collectionService.updateCollectionById(
				body,
				collectionId,
			);
			this.ok(res, updatedCollection);
		} catch (e) {
			next(e);
		}
	}
	async delete(
		{ params }: Request<ICollectionParams>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { collectionId } = params;
			const deletedCollectionId = await this.collectionService.deleteCollectionById(collectionId);

			this.ok(res, deletedCollectionId);
		} catch (e) {
			next(e);
		}
	}
}
