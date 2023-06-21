import { Image } from './image.model';
import { IFile } from './dto/file-create.dto';

export interface IImageService {
	createImage: (file: IFile) => Promise<Image>;
	deleteImage: (id: string) => Promise<null>;
	getImagePath: (fileName: string) => string;
}
