import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetInfoTheaterDto {
  @ApiPropertyOptional({ description: 'Mã hệ thống rạp' })
  @IsOptional()
  ma_he_thong_rap?: number;
}

export class GetInfoClusterOfTheaterDto {
  @ApiPropertyOptional({ description: 'Mã hệ thống rạp' })
  @IsOptional()
  ma_he_thong_rap?: number;
}

export class GetShowtimeInfoOfTheaterDto {
  @ApiPropertyOptional({ description: 'Mã hệ thống rạp' })
  @IsOptional()
  ma_he_thong_rap?: number;
}

export class GetMovieShowtimeDto {
  @ApiPropertyOptional({ description: 'Mã phim' })
  @IsOptional()
  ma_phim?: number;
}
