import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetInfoClusterOfTheaterDto,
  GetInfoTheaterDto,
  GetMovieShowtimeDto,
  GetShowtimeInfoOfTheaterDto,
} from './dto/theater-management.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TheaterManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getInfoSystemTheater(query: GetInfoTheaterDto) {
    if (query.ma_he_thong_rap) {
      return await this.prisma.heThongRap.findUnique({
        where: {
          ma_he_thong_rap: Number(query.ma_he_thong_rap),
        },
      });
    } else {
      return await this.prisma.heThongRap.findMany();
    }
  }

  async getInfoClusterOfTheater(query: GetInfoClusterOfTheaterDto) {
    const { ma_he_thong_rap } = query;

    return await this.prisma.cumRap.findMany({
      where: {
        ma_he_thong_rap: Number(ma_he_thong_rap),
      },
      include: {
        RapPhim: true,
      },
    });
  }

  async getShowtimeInfoOfTheater(query: GetShowtimeInfoOfTheaterDto) {
    const { ma_he_thong_rap } = query;

    const result = await this.prisma.heThongRap.findMany({
      where: {
        ma_he_thong_rap: Number(ma_he_thong_rap),
      },
      include: {
        CumRap: {
          include: {
            RapPhim: {
              include: {
                LichChieu: {
                  include: {
                    Phim: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return result;
  }

  async getMovieShowtime(query: GetMovieShowtimeDto) {
    const { ma_phim } = query;
    const phim = await this.prisma.phim.findUnique({
      where: {
        ma_phim: Number(ma_phim),
      },
      include: {
        LichChieu: {
          include: {
            RapPhim: {
              include: {
                CumRap: {
                  include: {
                    HeThongRap: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!phim) {
      throw new NotFoundException('Phim không tồn tại');
    }

    const heThongMap: Record<string, any> = {};

    phim.LichChieu.forEach((lichChieu) => {
      const heThong = lichChieu?.RapPhim?.CumRap?.HeThongRap;
      const cumRap = lichChieu?.RapPhim?.CumRap;
      const rap = lichChieu?.RapPhim;

      if (!heThong || !cumRap || !rap) {
        // Trường hợp dữ liệu không đủ, bỏ qua.
        return;
      }

      if (!heThongMap[heThong.ma_he_thong_rap]) {
        heThongMap[heThong.ma_he_thong_rap] = {
          maHeThongRap: heThong.ma_he_thong_rap,
          tenHeThongRap: heThong.ten_he_thong_rap,
          logo: heThong.logo,
          cumRapChieu: [],
        };
      }

      let cumRapGroup = heThongMap[heThong.ma_he_thong_rap].cumRapChieu.find(
        (c) => c.maCumRap === cumRap.ma_cum_rap,
      );

      if (!cumRapGroup) {
        cumRapGroup = {
          maCumRap: cumRap.ma_cum_rap,
          tenCumRap: cumRap.ten_cum_rap,
          diaChi: cumRap.dia_chi,
          lichChieuPhim: [],
        };
        heThongMap[heThong.ma_he_thong_rap].cumRapChieu.push(cumRapGroup);
      }

      cumRapGroup.lichChieuPhim.push({
        maLichChieu: lichChieu.ma_lich_chieu,
        tenRap: rap.ten_rap,
        ngayChieuGioChieu: lichChieu.ngay_gio_chieu,
        giaVe: lichChieu.gia_ve,
      });
    });

    return {
      maPhim: phim.ma_phim,
      tenPhim: phim.ten_phim,
      hinhAnh: phim.hinh_anh,
      trailer: phim.trailer,
      moTa: phim.mo_ta,
      ngayKhoiChieu: phim.ngay_khoi_chieu,
      danhGia: phim.danh_gia,
      hot: phim.hot,
      dangChieu: phim.dang_chieu,
      sapChieu: phim.sap_chieu,
      heThongRapChieu: Object.values(heThongMap),
    };
  }
}
