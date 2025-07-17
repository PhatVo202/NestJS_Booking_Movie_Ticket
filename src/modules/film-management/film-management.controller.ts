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
import { FilmManagementService } from './film-management.service';
import { Public } from 'src/common/decorator/is-public.decorator';
import {
  FilmQueryDayDto,
  FilmQueryDto,
  FilmQueryPhanTrangDto,
} from './dto/film.dto';

@Controller('QuanLyPhim')
export class FilmManagementController {
  constructor(private readonly filmManagementService: FilmManagementService) {}

  @Public()
  @Get('LayDanhSachBanner')
  async getListBanner() {
    return await this.filmManagementService.getListBanner();
  }

  @Public()
  @Get('LayDanhSachPhim')
  async getListFilms(@Query() query: FilmQueryDto) {
    return this.filmManagementService.getListFilms(query);
  }

  @Public()
  @Get('LayDanhSachPhimPhanTrang')
  async getListPaginationFilm(@Query() query: FilmQueryPhanTrangDto) {
    return await this.filmManagementService.getListPaginationFilm(query);
  }

  @Public()
  @Get('LayDanhSachPhimTheoNgay')
  async getListWithDayFilm(@Query() query: FilmQueryDayDto) {
    return await this.filmManagementService.getListWithDayFilm(query);
  }

  @Post('ThemPhimUploadHinh')
  async createNewFilm() {
    const data = {
      tenPhim: 'Ghost Train',
      moTa: 'Phim kinh dị nói về chuyến về quê của cô gái đầy kinh dị trên tàu',
      ngayKhoiChieu: new Date(2025 - 16 - 7),
      sapChieu: true,
      danChieu: false,
      hot: true,
      danhGia: 10,
      maPhim: 'GP01',
      File: 'img/sdewwf',
    };
    return this.filmManagementService.createNewFilm();
  }
}
