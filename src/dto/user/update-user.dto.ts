import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../../entity/user.entity';
export class UpdateUserDto { @IsOptional() @IsString() @MinLength(2) @MaxLength(120) name?: string; @IsOptional() @IsEmail() email?: string; @IsOptional() @IsString() phone?: string; @IsOptional() @IsEnum(UserRole) role?: UserRole; @IsOptional() @IsEnum(UserStatus) status?: UserStatus; }
