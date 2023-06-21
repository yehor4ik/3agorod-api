import { IUsersRepository } from './users.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { PostgresqlService } from '../../database/postgresql.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.model';
import { HttpError } from '../../errors/http-error.class';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PostgresqlService) private postgresqlService: PostgresqlService) {}

	async createUser(dto: UserRegisterDto): Promise<User | null> {
		try {
			const createdUser = User.create(dto);
			return createdUser ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'UsersRepository');
		}
	}
	async findUserByEmail(email: string): Promise<User | null> {
		try {
			const user = User.findOne({
				where: { email },
			});

			return user ?? null;
		} catch (e) {
			throw new HttpError(500, (e as Error).message, 'UsersRepository');
		}
	}
}
