import { IUsersRepository } from './users.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { PostgresqlService } from '../../database/postgresql.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.model';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PostgresqlService) private postgresqlService: PostgresqlService) {}

	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const createdUser = User.create(dto);
		return createdUser ?? null;
	}
	async findUserByEmail(email: string): Promise<User | null> {
		const user = User.findOne({
			where: { email },
		});

		return user ?? null;
	}
}
