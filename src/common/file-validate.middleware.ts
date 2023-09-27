import { NextFunction, Request, Response } from 'express';
import { IMiddleware } from './middleware.interface';
import { IFile } from '../components/images/dto/file-create.dto';

export class FileValidateMiddleware implements IMiddleware {
	private MAX_SIZE = 2;
	private ALLOWED_FILES = ['png', 'jpeg', 'jpg', 'gif'];
	private ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];

	execute({ file }: Request, res: Response, next: NextFunction): void {
		if (!this.isCorrectFileExtensions(file) || !this.isCorrectFileType(file)) {
			res.status(400).send({ err: 'The picture must have an extension: png, jpeg, jpg, gif' });
			return;
		}

		if (this.isLargeSize(file)) {
			res.status(413).send({ err: 'The picture must have an extension: png, jpeg, jpg, gif' });
			return;
		}

		next();
	}

	private isLargeSize(file?: IFile): boolean {
		return !!file && file.size / (1024 * 1024) > this.MAX_SIZE;
	}

	private isCorrectFileExtensions(file?: IFile): boolean {
		if (!file) return false;

		const fileExtensions = file.originalname.slice(file.originalname.lastIndexOf('.') + 1);
		return this.ALLOWED_FILES.includes(fileExtensions);
	}

	private isCorrectFileType(file?: IFile): boolean {
		return !!file && this.ALLOWED_FILE_TYPES.includes(file.mimetype);
	}
}
