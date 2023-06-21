import { User } from './user.model';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IUsersRepository {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	findUserByEmail: (email: string) => Promise<User | null>;
}
