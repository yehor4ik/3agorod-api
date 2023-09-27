import { IImageService } from './image.service.interface';
import { IImageImageCreationAttributes, Image } from './image.model';
import { injectable, inject } from 'inversify';
import { IImageRepository } from './image.repository.interface';
import { TYPES } from '../../types';
import { HttpError } from '../../errors/http-error.class';
import { IFile } from './dto/file-create.dto';
import path from 'path';

@injectable()
export class ImageService implements IImageService {
	constructor(@inject(TYPES.ImageRepository) private imageRepository: IImageRepository) {}
	getImagePath(fileName: string): string {
		const dirname = path.resolve();
		return path.join(dirname, '/public/images/' + fileName);
	}

	async createImage({ filename, size, mimetype }: IFile): Promise<Image> {
		const url = '/images/' + filename;

		const dto: IImageImageCreationAttributes = {
			url,
			filename,
			size,
			mimetype,
		};
		const image = await this.imageRepository.createImage(dto);

		if (!image) {
			throw new HttpError(500, 'Image has been not saved', 'ImageService');
		}

		return image;
	}
	async deleteImage(imageId: string): Promise<null> {
		const { getImageById, deleteImage } = this.imageRepository;
		const id: number = +imageId;
		const currentImage = await getImageById(id);

		if (!currentImage) {
			throw new HttpError(404, `Image with this ID: ${id} is not exist`, 'ImageService');
		}

		return await deleteImage(id);
	}
}
