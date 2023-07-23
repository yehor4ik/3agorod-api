import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ICollectionRepository } from '../components/controller/collection.repository.interface';
import { IProductImagesRepository } from '../components/product-images/product-images.repository.interface';
import { IImageRepository } from '../components/images/image.repository.interface';
import { ILogger } from '../logger/logger.interface';
import { PostgresqlService } from '../database/postgresql.service';

@injectable()
export class CronService {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.CollectionRepository)
		private readonly collectionRepository: ICollectionRepository,
		@inject(TYPES.ProductImagesRepository)
		private readonly productImagesRepository: IProductImagesRepository,
		@inject(TYPES.ImageRepository)
		private readonly imagesRepository: IImageRepository,
		@inject(TYPES.PostgresqlService) private readonly postgresqlService: PostgresqlService,
	) {}
	async initCronDeletingImages(): Promise<void> {
		cron.schedule('0 0 * * *', async () => {
			const transaction = await this.postgresqlService.client.transaction();
			try {
				const collections = await this.collectionRepository.getAllCollections({ transaction });
				const collectionImageIds = collections.map((collection) => collection.backgroundId);
				const productImages = await this.productImagesRepository.getAll({ transaction });
				const productImageIds = productImages.map((productImage) => productImage.imageId);
				const allImageIds = collectionImageIds.concat(productImageIds);
				const uniqueImageIds = new Set<number>();

				allImageIds.forEach((id) => {
					uniqueImageIds.add(id);
				});

				const uniqueImageIdsArray = Array.from(uniqueImageIds);
				await this.imagesRepository.delete({
					where: {
						[Op.not]: { id: uniqueImageIdsArray },
					},
				});
				const cleanedImages = await this.imagesRepository.getAllImages({ transaction });
				const imageDirectory = path.join(__dirname, '../../', 'public/images');

				await transaction.commit();

				fs.readdir(imageDirectory, (err, files) => {
					if (err) throw err;

					files.forEach((file) => {
						const filePath = path.join(imageDirectory, file);

						const compareFilePaths = cleanedImages.some((image) => image.filename === file);
						if (!compareFilePaths) {
							fs.unlink(filePath, (err) => {
								if (err) throw err;
								this.loggerService.log(`Deleted unused image: ${file}`);
							});
						}
					});
				});
			} catch (e) {
				this.loggerService.error((e as Error).message);
				await transaction.rollback();
			}
		});
	}
}
