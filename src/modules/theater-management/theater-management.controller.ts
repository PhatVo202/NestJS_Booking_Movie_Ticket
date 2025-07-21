import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TheaterManagementService } from './theater-management.service';
import {
  GetInfoClusterOfTheaterDto,
  GetInfoTheaterDto,
  GetMovieShowtimeDto,
  GetShowtimeInfoOfTheaterDto,
} from './dto/theater-management.dto';
import { Public } from 'src/common/decorator/is-public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Quản Lý Rạp')
@Controller('QuanLyRap')
export class TheaterManagementController {
  constructor(
    private readonly theaterManagementService: TheaterManagementService,
  ) {}

  @Public()
  @Get('LayThongTinHeThongRap')
  async getInfoSystemTheater(@Query() query: GetInfoTheaterDto) {
    return await this.theaterManagementService.getInfoSystemTheater(query);
  }

  @Public()
  @Get('LayThongTinCumRapTheoHeThongRap')
  async getInfoClusterOfTheater(@Query() query: GetInfoClusterOfTheaterDto) {
    return await this.theaterManagementService.getInfoClusterOfTheater(query);
  }

  @Public()
  @Get('LayThongTinLichChieuHeThongRap')
  async getShowtimeInfoOfTheater(@Query() query: GetShowtimeInfoOfTheaterDto) {
    return await this.theaterManagementService.getShowtimeInfoOfTheater(query);
  }

  @Public()
  @Get('LayThongTinLichChieuPhim')
  async getMovieShowtime(@Query() query: GetMovieShowtimeDto) {
    return await this.theaterManagementService.getMovieShowtime(query);
  }
}
