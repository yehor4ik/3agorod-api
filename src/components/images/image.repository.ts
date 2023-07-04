import { IImageRepository } from './image.repository.interface';
import { IImageImageCreationAttributes, Image } from './image.model';
import { injectable } from 'inversify';
import { HttpError } from '../../errors/http-error.class';
import { Attributes, DestroyOptions } from 'sequelize/types/model';

@injectable()
export class ImageRepository implements IImageRepository {
	async createImage(dto: IImageImageCreationAttributes): Promise<Image | null> {
		try {
			const image = Image.create(dto);
			return image ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ImageRepository');
		}
	}
	async deleteImage(id: number, options?: DestroyOptions<Attributes<Image>>): Promise<null> {
		const currentOptions = {
			where: { id },
			...(options ?? {}),
		};
		try {
			await Image.destroy(currentOptions);
			return null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ImageRepository');
		}
	}

	async getImageById(id: number): Promise<Image | null> {
		try {
			const image = await Image.findOne({ where: { id } });
			return image ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'ImageRepository');
		}
	}
}
