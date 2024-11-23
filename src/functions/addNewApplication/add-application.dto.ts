import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class AddApplicationDTO {
  @IsString()
  @IsNotEmpty()
  link: string; 

  @IsBoolean()
  applied: boolean; 
}
