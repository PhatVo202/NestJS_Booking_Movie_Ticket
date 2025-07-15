import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Tài khoản không được để trONGL' })
  tai_khoan: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  mat_khau: string;
}
