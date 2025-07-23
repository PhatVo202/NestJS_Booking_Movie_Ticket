import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateTicketManagementDto {}

class VeDto {
  @IsNumber()
  ma_ghe: number;

  @IsNumber()
  gia_ve: number;
}

export class BookTicketDto {
  @ApiProperty({ example: '601' })
  @IsNumber()
  ma_lich_chieu: number;

  @ApiProperty({
    type: [VeDto],
    description: 'Danh sách vé',
    example: [
      { ma_ghe: 503, gia_ve: 120000 },
      { ma_ghe: 504, gia_ve: 120000 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VeDto)
  danhSachVe: VeDto[];
}

export class GetListRoomTicketDto {
  @ApiPropertyOptional({ description: 'Mã lịch chiếu' })
  @IsNumber()
  @Type(() => Number)
  ma_lich_chieu: number;
}

export class ShowScheduleDto {
  @ApiProperty({ example: '9' })
  @IsNumber()
  ma_phim: number;

  @ApiProperty({ example: '412' })
  @IsNumber()
  ma_rap: number;

  @ApiProperty({ example: '120000' })
  @IsNumber()
  gia_ve: number;

  @ApiProperty({ example: '2025-08-03 18:30:00' })
  @IsString()
  ngay_gio_chieu: string;
}
