import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ha' })
  @IsNotEmpty({ message: 'Tài khoản không được để trONGL' })
  tai_khoan: string;

  @ApiProperty({ example: '@Voletruongphatcc11' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  mat_khau: string;
}
