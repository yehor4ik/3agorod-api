import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UsersService } from './users.service';
import { HttpError } from '../errors/http-error.class';
import { RequestValidateMiddleware } from '../common/request-validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: UsersService,
	) {
		super(loggerService);
		this.setNameController(UserController.name);
		this.bindRoutes([
			{ method: 'post', path: '/login', func: this.login },
			{
				method: 'post',
				path: '/register',
				func: this.register,
				middlewares: [new RequestValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		// next(new HttpError(401, 'Error login'));
		this.ok(res, '33333');
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'This user has already exist'));
		}
		this.ok(res, result);
	}
}
