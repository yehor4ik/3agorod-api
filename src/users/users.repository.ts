import { IUsersRepository } from './users.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PostgresqlService } from '../database/postgresql.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PostgresqlService) private postgresqlService: PostgresqlService) {}

	async get(): Promise<any> {
		const res = await this.postgresqlService.client.query(
			'SELECT * FROM collection ORDER BY id ASC',
		);
		return res;
	}

	async create(): Promise<any> {
		const res = await this.postgresqlService.client.query(
			`INSERT INTO Collection (name, background_image)
        VALUES
        ('Summer Collection 2', 'https://example.com/summer.jpg 2') RETURNING *`,
		);
		return res;
	}
	// async create(user: User): Promise<any> {}
	// find: (email: string) => Promise<any | null>;
}
