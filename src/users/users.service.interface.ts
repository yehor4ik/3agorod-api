import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.model';
import { UserLoginDto } from './dto/user-login.dto';
import { HttpError } from '../errors/http-error.class';
import { IResponseUserLogin } from './types/response-user-login';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | HttpError>;
	loginUser: (dto: UserLoginDto) => Promise<IResponseUserLogin | HttpError>;
}
