import { IsNumberString, IsString, Length } from 'class-validator';

export class GetRateDto {
  @IsNumberString()
  count: number;

  @IsString()
  @Length(3, 3)
  target: string;

  @IsString()
  @Length(3, 3)
  current: string;
}
