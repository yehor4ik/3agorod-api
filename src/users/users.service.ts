import { injectable, inject } from 'inversify';
import { IUserService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.model';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserEntity } from './user.entity';
import { HttpError } from '../errors/http-error.class';
import { IResponseUserLogin } from './types/response-user-login';
import jwt from 'jsonwebtoken';

@injectable()
export class UsersService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
		@inject(TYPES.IUsersRepository) private readonly usersRepository: IUsersRepository,
	) {}
	async createUser({ password, email, name }: UserRegisterDto): Promise<User | HttpError> {
		try {
			const existingUser = await this.usersRepository.findUserByEmail(email);
			if (existingUser) {
				return new HttpError(404, `This ${email} email address already in use.`);
			}

			const salt = this.configService.get<number>('SALT');

			const newPassword = await UserEntity.getPassword(password, salt);
			const newUser = await this.usersRepository.createUser({ email, name, password: newPassword });
			return newUser ?? new HttpError(500, `Failed to create this user ${email}`);
		} catch (e) {
			return new HttpError(500, (e as Error).message, 'UsersService');
		}
	}

	async loginUser({ email, password }: UserLoginDto): Promise<IResponseUserLogin | HttpError> {
		try {
			const existingUser = await this.usersRepository.findUserByEmail(email);

			if (!existingUser) {
				return new HttpError(401, 'Invalid email or password');
			}

			const matchPassword = UserEntity.checkPassword(password, existingUser.password);

			if (!matchPassword) {
				return new HttpError(401, 'Invalid email or password');
			}

			const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
			const token = jwt.sign({ userId: existingUser.id }, secretKey, { expiresIn: 60 * 60 });
			return {
				user: {
					id: existingUser.id,
					name: existingUser.name,
					email: existingUser.email,
					createdAt: existingUser.createdAt,
					updatedAt: existingUser.updatedAt,
				},
				token,
			};
		} catch {
			return new HttpError(500, 'Server error. Please try again later.');
		}
	}
}
