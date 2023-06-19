import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Incorrect email' })
	email: string;
	@IsString({ message: 'Password is required field' })
	password: string;
}
