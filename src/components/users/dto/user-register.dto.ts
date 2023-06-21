import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Incorrect email' })
	email: string;
	@IsString({ message: 'Password is required field' })
	password: string;
	@IsString({ message: 'Name is required field' })
	name: string;
}
