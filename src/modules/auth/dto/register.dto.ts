import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user1' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  tai_khoan: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @MaxLength(32, { message: 'Mật khẩu không được vượt quá 32 ký tự' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
    {
      message:
        'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
    },
  )
  mat_khau: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  ho_ten: string;

  @ApiProperty({ example: 'Vd1b4@example.com' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '0123456789' })
  @IsNotEmpty({ message: 'SĐT không được để trống' })
  so_dt: string;

  loai_nguoi_dung: string;
}

// 'Email không đúng định dạng',
