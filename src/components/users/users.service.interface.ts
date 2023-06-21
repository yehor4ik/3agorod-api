import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.model';
import { UserLoginDto } from './dto/user-login.dto';
import { IResponseUserLogin } from './types/response-user-login';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User>;
	loginUser: (dto: UserLoginDto) => Promise<IResponseUserLogin>;
}
