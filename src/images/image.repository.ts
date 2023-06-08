import { IImageRepository } from './image.repository.interface';
import { IImageImageCreationAttributes, Image } from './image.model';
import { injectable } from 'inversify';

@injectable()
export class ImageRepository implements IImageRepository {
	async createImage(dto: IImageImageCreationAttributes): Promise<Image | null> {
		const image = Image.create(dto);
		return image ?? null;
	}
	async deleteImage(id: number): Promise<null> {
		await Image.destroy({ where: { id } });
		return null;
	}

	async getImageById(id: number): Promise<Image | null> {
		const image = await Image.findOne({ where: { id } });
		return image ?? null;
	}
}
