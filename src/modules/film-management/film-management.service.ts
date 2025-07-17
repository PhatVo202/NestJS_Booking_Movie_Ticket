import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  FilmQueryDayDto,
  FilmQueryDto,
  FilmQueryPhanTrangDto,
} from './dto/film.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { contains } from 'class-validator';

@Injectable()
export class FilmManagementService {
  constructor(private readonly prisma: PrismaService) {}
  async getListBanner() {
    return await this.prisma.banner.findMany({});
  }

  async getListFilms(query: FilmQueryDto) {
    const { ten_phim } = query;
    if (ten_phim) {
      return await this.prisma.phim.findMany({
        where: {
          ten_phim: {
            contains: ten_phim.trim(),
          },
        },
      });
    }
    return await this.prisma.phim.findMany({});
  }

  async getListPaginationFilm(query: FilmQueryPhanTrangDto) {
    const { ten_phim, page = '1', limit = '10' } = query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const whereCondition = ten_phim?.trim()
      ? {
          ten_phim: {
            contains: ten_phim.trim(),
          },
        }
      : {};

    const data = await paginate(this.prisma.phim, {
      where: whereCondition,
      page: pageNumber,
      limit: limitNumber,
    });

    return data;
  }

  async getListWithDayFilm(query: FilmQueryDayDto) {
    const { ten_phim, page = '1', limit = '10', tu_ngay, den_ngay } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const whereCondition =
      ten_phim?.trim() && tu_ngay && den_ngay
        ? {
            ngay_khoi_chieu: {
              ...(tu_ngay && { gte: new Date(tu_ngay) }),
              ...(den_ngay && { lte: new Date(den_ngay) }),
            },
            ten_phim: {
              contains: ten_phim.trim(),
            },
          }
        : {};

    const data = await paginate(this.prisma.phim, {
      where: whereCondition,
      page: pageNumber,
      limit: limitNumber,
    });

    return data;
  }

  async createNewFilm() {
    return 'Create success film';
  }
}
