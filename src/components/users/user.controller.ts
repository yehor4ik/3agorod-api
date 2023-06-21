import { BaseController } from '../../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILogger } from '../../logger/logger.interface';
import { TYPES } from '../../types';
import 'reflect-metadata';
import { IUserController } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UsersService } from './users.service';
import { RequestValidateMiddleware } from '../../common/request-validate.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: UsersService,
	) {
		super(loggerService);
		this.setNameController(UserController.name);
		this.bindRoutes([
			{
				method: 'post',
				path: '/login',
				func: this.login,
				middlewares: [new RequestValidateMiddleware(UserLoginDto)],
			},
			{
				method: 'post',
				path: '/register',
				func: this.register,
				middlewares: [new RequestValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const createdUser = await this.userService.createUser(body);
			this.ok(res, createdUser);
		} catch (e) {
			next(e);
		}
	}

	async login(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const result = await this.userService.loginUser(body);
			this.ok(res, result);
		} catch (e) {
			next(e);
		}
	}
}
