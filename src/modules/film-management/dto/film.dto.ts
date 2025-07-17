import { IsOptional } from 'class-validator';

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
