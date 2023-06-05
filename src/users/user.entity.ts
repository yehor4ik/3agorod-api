import bcrypt from 'bcryptjs';
export class UserEntity {
	static async getPassword(password: string, salt: number): Promise<string> {
		return await bcrypt.hash(password, salt);
	}

	static async checkPassword(currentPassword: string, rightPassword: string): Promise<boolean> {
		return await bcrypt.compare(currentPassword, rightPassword);
	}
}
