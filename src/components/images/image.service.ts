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

	async createImage({ filename, size }: IFile): Promise<Image | HttpError> {
		try {
			const url = '/images/' + filename;

			const dto: IImageImageCreationAttributes = {
				url,
				filename,
				size,
			};
			const image = await this.imageRepository.createImage(dto);
			return image ?? new HttpError(500, 'Image has been not saved');
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
	async deleteImage(imageId: string): Promise<null | HttpError> {
		try {
			const { getImageById, deleteImage } = this.imageRepository;
			const id: number = +imageId;
			const currentImage = await getImageById(id);

			if (!currentImage) {
				return new HttpError(404, `Image with this ID: ${id} is not exist`);
			}

			const deletedImage = await deleteImage(id);
			const isNull = deletedImage === null;
			const errorMessage = new HttpError(500, `Failed to remove the collection with ${id}`);

			return isNull ? deletedImage : errorMessage;
		} catch (e) {
			return new HttpError(500, (e as Error).message);
		}
	}
}
