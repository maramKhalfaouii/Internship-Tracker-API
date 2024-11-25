import { IsString, IsOptional, IsEmail, IsDateString, IsBoolean, IsArray } from 'class-validator';

export class JobDetailsDTO {
  @IsString()
  companyName: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsDateString()
  postingDate?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  link: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsBoolean()
  remote?: boolean;
  datePosted: string;
}
