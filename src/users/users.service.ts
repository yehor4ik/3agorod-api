import { injectable, inject } from 'inversify';
import { IUserService } from './user.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';

@injectable()
export class UsersService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
		@inject(TYPES.IUsersRepository) private readonly usersRepository: IUsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = +this.configService.get('SALT');
		await newUser.setPassword(password, salt);
		const result = await this.usersRepository.create(); //await this.usersRepository.get();
		return result;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
