import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilmQueryDto {
  @IsOptional()
  ten_phim?: string;
}

export class FilmQueryPhanTrangDto {
  @IsOptional()
  ten_phim?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}

export class FilmQueryDayDto {
  @IsOptional()
  ten_phim?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;

  @IsOptional()
  tu_ngay?: string;

  @IsOptional()
  den_ngay?: string;
}

export class FilmQueryMaPhimDto {
  @IsOptional()
  ma_phim?: number;
}

export class FilmUploadDto {
  ten_phim: string;
  mo_ta: string;
  ngay_khoi_chieu: string;
  sap_chieu: boolean;
  dang_chieu: boolean;
  danh_gia: number;
  hot: boolean;
  trailer: string;
  hinh_anh: string;
}

export class FilmUpdateDto extends FilmUploadDto {
  ma_phim: string;
}

export class RemoveQueryDto {
  @IsNumber()
  @Type(() => Number)
  ma_phim: number;
}
