import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilmQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  ten_phim?: string;
}

export class FilmQueryPhanTrangDto {
  @ApiPropertyOptional({ description: 'Tên theo phim ' })
  @IsOptional()
  ten_phim?: string;

  @ApiPropertyOptional({ description: 'Từ ' })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ description: 'Đến ' })
  @IsOptional()
  limit?: string;
}

export class FilmQueryDayDto {
  @ApiPropertyOptional({ description: 'Tên theo phim ' })
  @IsOptional()
  ten_phim?: string;

  @ApiPropertyOptional({ description: 'Từ ' })
  @IsOptional()
  page?: string;

  @ApiPropertyOptional({ description: 'Đến ' })
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({ description: 'Từ ngày: 2024-05-26 ' })
  @IsOptional()
  tu_ngay?: string;

  @ApiPropertyOptional({ description: 'Đến ngày: 2024-07-26 ' })
  @IsOptional()
  den_ngay?: string;
}

export class FilmQueryMaPhimDto {
  @ApiPropertyOptional({ description: 'Mã phim ' })
  @IsOptional()
  ma_phim?: number;
}

export class FilmUploadDto {
  @ApiProperty({ example: 'Avengers: Endgame' })
  @IsString()
  ten_phim: string;

  @ApiProperty({ example: 'Phim hành động viễn tưởng' })
  @IsString()
  mo_ta: string;

  @ApiProperty({
    example: '2025-08-01',
    description: 'Ngày khởi chiếu (định dạng yyyy-mm-dd)',
  })
  @IsDateString()
  ngay_khoi_chieu: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Type(() => Boolean)
  sap_chieu: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Type(() => Boolean)
  dang_chieu: boolean;

  @ApiProperty({ example: 9 })
  @IsNumber()
  @Type(() => Number)
  danh_gia: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Type(() => Boolean)
  hot: boolean;

  @ApiProperty({ example: 'https://youtube.com/trailer' })
  @IsString()
  trailer: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Hình ảnh poster phim',
  })
  hinh_anh: any;
}

export class FilmUpdateDto extends FilmUploadDto {
  @ApiProperty({ example: '25' })
  @IsNumber()
  @Type(() => Number)
  ma_phim: number;
}

export class RemoveQueryDto {
  @ApiProperty({ description: 'Mã phim ' })
  @IsNumber()
  @Type(() => Number)
  ma_phim: number;
}
