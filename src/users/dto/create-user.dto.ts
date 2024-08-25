export class CreateUserDto {
  email?: string;
  telegram_id?: string;
  name: string;
  locale?: string;
  currency?: string;
  password?: string;
  location?: string;
  tz?: string;
}
