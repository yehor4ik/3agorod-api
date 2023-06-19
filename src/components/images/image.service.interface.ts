import { Image } from './image.model';
import { HttpError } from '../../errors/http-error.class';
import { IFile } from './dto/file-create.dto';

export interface IImageService {
	createImage: (file: IFile) => Promise<Image | HttpError>;
	deleteImage: (id: string) => Promise<null | HttpError>;
	getImagePath: (fileName: string) => string;
}
