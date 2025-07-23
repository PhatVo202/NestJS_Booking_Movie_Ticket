import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'admin1' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  tai_khoan: string;

  @ApiProperty({ example: '@Admin123' })
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

  @ApiProperty({ example: 'Admin 1' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  ho_ten: string;

  @ApiProperty({ example: 'admin1@gmail.com' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '0918542222' })
  @IsNotEmpty({ message: 'SĐT không được để trống' })
  so_dt: string;

  @ApiProperty({ example: 'QuanTri' })
  @IsNotEmpty({ message: 'Loại người dùng không được để trống' })
  loai_nguoi_dung: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'ha' })
  @IsNotEmpty({ message: 'Tài khoản không được để trống' })
  tai_khoan: string;

  @ApiProperty({ example: '@Voletruongphatcc11' })
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

  @ApiProperty({ example: 'Hung Anh' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  ho_ten: string;

  @ApiProperty({ example: 'ha1@gmail.com' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '0918542222' })
  @IsNotEmpty({ message: 'SĐT không được để trống' })
  so_dt: string;
}

export class UserQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Từ khoá theo họ tên & id' })
  tuKhoa?: string;
}

export class UserQueryPhanTrangDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Từ khoá theo họ tên & id' })
  tuKhoa?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'soTrang' })
  @IsNumberString()
  page?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'soPhanTuTrenTrang' })
  @IsNumberString()
  limit?: string;
}

export class GetInfoUserDto {
  @ApiPropertyOptional({ description: 'Từ khoá theo họ tên & id' })
  @IsString({ message: 'Vui lòng nhập tên tài khoản' })
  tai_khoan: string;
}
