import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';
import { Role } from '../role';

export class CreateUserDto {
  @IsEmail() 
  email!: string;

  @IsString() 
  @MinLength(6) 
  password!: string;

  @IsIn(['OWNER', 'ADMIN', 'VIEWER']) 
  role!: Role;
}
