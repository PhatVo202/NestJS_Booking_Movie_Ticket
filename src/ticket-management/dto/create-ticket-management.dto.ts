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
  @IsNumber()
  ma_lich_chieu: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VeDto)
  danhSachVe: VeDto[];
}

export class GetListRoomTicketDto {
  @IsNumber()
  @Type(() => Number)
  ma_lich_chieu: number;
}

export class ShowScheduleDto {
  @IsNumber()
  ma_phim: number;
  @IsNumber()
  ma_rap: number;
  @IsNumber()
  gia_ve: number;
  @IsString()
  ngay_gio_chieu: string;
}
