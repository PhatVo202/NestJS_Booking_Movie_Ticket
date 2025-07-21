import { IsOptional } from 'class-validator';

export class GetInfoTheaterDto {
  @IsOptional()
  ma_he_thong_rap?: number;
}

export class GetInfoClusterOfTheaterDto {
  @IsOptional()
  ma_he_thong_rap?: number;
}

export class GetShowtimeInfoOfTheaterDto {
  @IsOptional()
  ma_he_thong_rap?: number;
}

export class GetMovieShowtimeDto {
  @IsOptional()
  ma_phim?: number;
}
