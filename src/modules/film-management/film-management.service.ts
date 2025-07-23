import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  FilmQueryDayDto,
  FilmQueryDto,
  FilmQueryMaPhimDto,
  FilmQueryPhanTrangDto,
  FilmUpdateDto,
  FilmUploadDto,
  RemoveQueryDto,
} from './dto/film.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import { contains } from 'class-validator';
import { NguoiDung } from 'generated/prisma';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from 'src/common/cloudinary/init.cloudinary';

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

    const tu_ngayDate = tu_ngay ? new Date(tu_ngay) : undefined;
    const den_ngayDate = den_ngay ? new Date(den_ngay) : undefined;

    if (tu_ngayDate && den_ngayDate && tu_ngayDate > den_ngayDate) {
      throw new BadRequestException('Vui lòng nhập khoảng ngày hợp lệ');
    }

    // const whereCondition =
    //   ten_phim?.trim() && tu_ngay && den_ngay
    //     ? {
    //         ngay_khoi_chieu: {
    //           gte: tu_ngayDate,
    //           lte: den_ngayDate,
    //         },
    //         ten_phim: {
    //           contains: ten_phim.trim(),
    //         },
    //       }
    //     : {};

    const where: any = {};

    if (ten_phim?.trim()) {
      where.ten_phim = {
        contains: ten_phim.trim(),
      };
    }

    if (tu_ngayDate || den_ngayDate) {
      where.ngay_khoi_chieu = {};
      if (tu_ngayDate) {
        where.ngay_khoi_chieu.gte = tu_ngayDate;
      }
      if (den_ngayDate) {
        where.ngay_khoi_chieu.lte = den_ngayDate;
      }
    }

    const data = await paginate(this.prisma.phim, {
      where: where,
      page: pageNumber,
      limit: limitNumber,
    });

    return data;
  }

  async createNewFilm(body: any, file: Express.Multer.File, user: NguoiDung) {
    if (user.loai_nguoi_dung !== 'QuanTri') {
      throw new ForbiddenException('Bạn không có quyền thêm phim');
    }

    if (!body) {
      throw new BadRequestException('Thiếu dữ liệu phim');
    }

    if (!file) {
      throw new BadRequestException('Chưa tìm thấy file');
    }

    // Upload hình lên Cloudinary
    const uploadResult = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'images' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(file.buffer);
      },
    );

    if (!uploadResult || !uploadResult.secure_url) {
      throw new BadRequestException('Upload hình ảnh thất bại');
    }

    const data = {
      ten_phim: body.ten_phim,
      mo_ta: body.mo_ta,
      ngay_khoi_chieu: new Date(body.ngay_khoi_chieu),
      sap_chieu: body.sap_chieu === 'true' || body.sap_chieu === true,
      dang_chieu: body.dang_chieu === 'true' || body.dang_chieu === true,
      danh_gia: Number(body.danh_gia),
      hot: body.hot === 'true' || body.hot === true,
      trailer: body.trailer,
      hinh_anh: uploadResult.secure_url,
    };

    await this.prisma.phim.create({ data });
    return 'Tạo phim thành công';
  }

  async updateFilm(body: any, file: Express.Multer.File, user: NguoiDung) {
    if (user.loai_nguoi_dung !== 'QuanTri') {
      throw new ForbiddenException('Bạn không có quyền cập nhật phim');
    }

    const isFilm = await this.prisma.phim.findUnique({
      where: {
        ma_phim: Number(body.ma_phim),
      },
    });

    if (!isFilm) {
      throw new BadRequestException('Không tìm thấy mã phim');
    }

    const data: any = {};

    if (body.ten_phim !== undefined) data.ten_phim = body.ten_phim;
    if (body.mo_ta !== undefined) data.mo_ta = body.mo_ta;
    if (body.ngay_khoi_chieu !== undefined)
      data.ngay_khoi_chieu = new Date(body.ngay_khoi_chieu);
    if (body.sap_chieu !== undefined)
      data.sap_chieu = body.sap_chieu === 'true' || body.sap_chieu === true;
    if (body.dang_chieu !== undefined)
      data.dang_chieu = body.dang_chieu === 'true' || body.dang_chieu === true;
    if (body.danh_gia !== undefined) data.danh_gia = Number(body.danh_gia);
    if (body.hot !== undefined)
      data.hot = body.hot === 'true' || body.hot === true;
    if (body.trailer !== undefined) data.trailer = body.trailer;

    try {
      if (file) {
        // Upload hình mới lên Cloudinary
        const uploadResult = await new Promise<UploadApiResponse | undefined>(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: 'images' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
              })
              .end(file.buffer);
          },
        );

        if (!uploadResult || !uploadResult.secure_url) {
          throw new BadRequestException('Upload hình ảnh thất bại');
        }

        // Lưu public_id vào DB
        data.hinh_anh = uploadResult.secure_url;

        // Xóa hình cũ trên Cloudinary nếu có
        if (isFilm.hinh_anh) {
          await cloudinary.uploader.destroy(isFilm.hinh_anh);
        }
      }

      if (Object.keys(data).length === 0) {
        throw new BadRequestException('Không có dữ liệu cập nhật');
      }

      const updatedFilm = await this.prisma.phim.update({
        where: { ma_phim: Number(body.ma_phim) },
        data,
      });

      return {
        message: 'Cập nhật phim thành công',
        film: updatedFilm,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDetailFilm(query: FilmQueryMaPhimDto) {
    const { ma_phim } = query;

    return await this.prisma.phim.findUnique({
      where: {
        ma_phim: Number(ma_phim),
      },
    });
  }

  async removeFilm(query: RemoveQueryDto, user: NguoiDung) {
    const { ma_phim } = query;

    if (user.loai_nguoi_dung !== 'QuanTri') {
      throw new ForbiddenException('Bạn không có quyền xoá phim');
    }

    await this.prisma.phim.delete({
      where: {
        ma_phim: Number(ma_phim),
      },
    });

    return 'Xoá thành công';
  }
}
