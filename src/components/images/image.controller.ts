import {
	IImageController,
	IRemoveImageParams,
	IGetImageParams,
} from './image.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.interface';
import { IConfigService } from '../../config/config.service.interface';
import { BaseController } from '../../common/base.controller';
import { AuthMiddleware } from '../../common/auth.middleware';
import { IImageService } from './image.service.interface';
import { HttpError } from '../../errors/http-error.class';
import { NextFunction, Request, Response } from 'express';
import multer, { Multer } from 'multer';
import { Image } from './image.model';

@injectable()
export class ImageController extends BaseController implements IImageController {
	private imageUpload: Multer = multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, 'public/images/');
			},
			filename: function (req, file, cb) {
				cb(null, new Date().valueOf() + '_' + file.originalname);
			},
		}),
	});

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.ImageService) private imageService: IImageService,
	) {
		super(loggerService);
		this.setNameController(ImageController.name);

		const secret = this.configService.get<string>('JWT_SECRET_KEY');

		this.bindRoutes([
			{
				method: 'post',
				path: '/',
				func: this.create,
				middlewares: [new AuthMiddleware(secret), { execute: this.imageUpload.single('image') }],
			},
			{
				method: 'get',
				path: '/:filename',
				func: this.get,
			},
			{
				method: 'delete',
				path: '/:imageId',
				func: this.delete,
				middlewares: [new AuthMiddleware(secret)],
			},
		]);
	}

	async create({ file }: Request, res: Response, next: NextFunction): Promise<void> {
		if (!file) {
			next(new HttpError(401, 'Image is required field', 'ImageController'));
			return;
		}
		const newImage = await this.imageService.createImage(file);
		const isError = newImage instanceof HttpError;

		isError ? next(newImage) : this.created<Image>(res, newImage);
	}

	async get(req: Request<IGetImageParams>, res: Response): Promise<void> {
		const imagePath = this.imageService.getImagePath(req.params.filename);
		return res.sendFile(imagePath);
	}

	async delete(req: Request<IRemoveImageParams>, res: Response, next: NextFunction): Promise<void> {
		const { imageId } = req.params;
		const deletedImage = await this.imageService.deleteImage(imageId);
		const isError = deletedImage instanceof HttpError;

		isError ? next(deletedImage) : this.ok<null>(res, deletedImage);
	}
}
