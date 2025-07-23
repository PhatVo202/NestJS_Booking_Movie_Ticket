import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilmManagementService } from './film-management.service';
import { Public } from 'src/common/decorator/is-public.decorator';
import {
  FilmQueryDayDto,
  FilmQueryDto,
  FilmQueryMaPhimDto,
  FilmQueryPhanTrangDto,
  FilmUpdateDto,
  FilmUploadDto,
  RemoveQueryDto,
} from './dto/film.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorator/user.decorator';
import { NguoiDung } from 'generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Quản Lý Phim')
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

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FilmUploadDto })
  @Post('ThemPhimUploadHinh')
  @UseInterceptors(FileInterceptor('hinh_anh'))
  async createNewFilm(
    @Body() body: FilmUploadDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: NguoiDung,
  ) {
    return await this.filmManagementService.createNewFilm(body, file, user);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FilmUpdateDto })
  @Post('CapNhatPhimUpload')
  @UseInterceptors(FileInterceptor('hinh_anh'))
  async updateFilm(
    @Body() body: FilmUpdateDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: NguoiDung,
  ) {
    return await this.filmManagementService.updateFilm(body, file, user);
  }

  @ApiBearerAuth()
  @Public()
  @Get('LayThongTinPhim')
  async getDetailFilm(@Query() query: FilmQueryMaPhimDto) {
    return await this.filmManagementService.getDetailFilm(query);
  }

  @ApiBearerAuth()
  @Delete('XoaPhim')
  async removeFilm(@Query() query: RemoveQueryDto, @User() user: NguoiDung) {
    return await this.filmManagementService.removeFilm(query, user);
  }
}
