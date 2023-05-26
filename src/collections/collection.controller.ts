import { BaseController } from '../common/base.controller';
import { ICollectionController, ICollectionParams } from './collection.controller.interface';
import e, { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { ICollectionService } from './collection.service.interface';
import { ICollectionEntity } from './types/ICollectionEntity';
import { CollectionCreateDto } from './dto/collection-create.dto';
import { RequestValidateMiddleware } from '../common/request-validate.middleware';
import { UserRegisterDto } from '../users/dto/user-register.dto';
import { CollectionUpdateDto } from './dto/collection-update.dto';
import { HttpError } from '../errors/http-error.class';

@injectable()
export class CollectionController extends BaseController implements ICollectionController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.CollectionService) private collectionService: ICollectionService,
	) {
		super(loggerService);
		this.setNameController(CollectionController.name);
		this.bindRoutes([
			{ method: 'get', path: '/', func: this.get },
			{ method: 'delete', path: '/:collectionId', func: this.delete },
			{
				method: 'post',
				path: '/',
				func: this.create,
				middlewares: [new RequestValidateMiddleware(CollectionCreateDto)],
			},
			{
				method: 'put',
				path: '/:collectionId',
				func: this.update,
				middlewares: [new RequestValidateMiddleware(CollectionUpdateDto)],
			},
		]);
	}
	async create(
		{ body }: Request<{}, {}, CollectionCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newCollection = await this.collectionService.createCollection(body);
		const isError = newCollection instanceof HttpError;

		isError ? next(newCollection) : this.created<ICollectionEntity>(res, newCollection);
	}
	async get(req: Request, res: Response, next: NextFunction): Promise<void> {
		const collections = await this.collectionService.getAllCollections();

		Array.isArray(collections) ? this.ok<ICollectionEntity[]>(res, collections) : next(collections);
	}
	async update(
		req: Request<ICollectionParams, {}, CollectionCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { body, params } = req;
		const collectionId = params.collectionId;
		const updatedCollection = await this.collectionService.updateCollectionById(body, collectionId);
		const isError = updatedCollection instanceof HttpError;

		isError ? next(updatedCollection) : this.ok(res, updatedCollection);
	}
	async delete(
		{ params }: Request<ICollectionParams>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { collectionId } = params;
		const deletedCollectionId = await this.collectionService.deleteCollectionById(collectionId);
		const isError = deletedCollectionId instanceof HttpError;

		isError ? next(deletedCollectionId) : this.ok(res, deletedCollectionId);
	}
}
