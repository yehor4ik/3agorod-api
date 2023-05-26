import { User } from './user.entity';

export interface IUsersRepository {
	//TODO замість any повинен бути можель повертаїмой сущності
	get: () => Promise<any>;
	create: () => Promise<any>;
	// find: (email: string) => Promise<any | null>;
}
