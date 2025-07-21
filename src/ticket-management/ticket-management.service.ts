import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BookTicketDto,
  GetListRoomTicketDto,
  ShowScheduleDto,
} from './dto/create-ticket-management.dto';
import { UpdateTicketManagementDto } from './dto/update-ticket-management.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { NguoiDung } from 'generated/prisma';
import * as dayjs from 'dayjs';
import * as moment from 'moment';

@Injectable()
export class TicketManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async bookTicket(body: BookTicketDto, user: NguoiDung) {
    const { ma_lich_chieu, danhSachVe } = body;

    if (user.loai_nguoi_dung !== 'KhachHang') {
      throw new NotFoundException('Admin không có quyền đặt vé');
    }
    const lichChieu = await this.prisma.lichChieu.findUnique({
      where: {
        ma_lich_chieu: Number(ma_lich_chieu),
      },
    });

    if (!lichChieu) {
      throw new NotFoundException('Lịch chiếu không tồn tại!');
    }

    const isGheDaDat = await this.prisma.datVe.findMany({
      where: {
        ma_lich_chieu: Number(ma_lich_chieu),
        ma_ghe: {
          in: danhSachVe.map((item) => item.ma_ghe),
        },
      },
    });

    if (isGheDaDat.length > 0) {
      throw new BadRequestException('Có ghế đã được đặt, vui lòng chọn lại!');
    }

    const datVe = danhSachVe.map((item) => {
      return {
        nguoi_dung_id: user.id,
        ma_lich_chieu: Number(ma_lich_chieu),
        ma_ghe: Number(item.ma_ghe),
      };
    });

    await this.prisma.datVe.createMany({
      data: datVe,
    });

    return 'Đặt vé thành công!';
  }

  async getListRoomTicket(query: GetListRoomTicketDto) {
    const { ma_lich_chieu } = query;

    const lichChieu = await this.prisma.lichChieu.findUnique({
      where: {
        ma_lich_chieu: Number(ma_lich_chieu),
      },
      include: {
        Phim: true,
        RapPhim: {
          include: {
            CumRap: true,
            Ghe: true,
          },
        },
      },
    });

    if (!lichChieu) {
      throw new NotFoundException('Lịch chiếu không tồn tại!');
    }

    if (!lichChieu.RapPhim?.Ghe || lichChieu.RapPhim.Ghe.length === 0) {
      throw new NotFoundException('Rạp này chưa có danh sách ghế!');
    }

    return {
      thongTinPhim: {
        maLichChieu: lichChieu.ma_lich_chieu,
        tenCumRap: lichChieu.RapPhim.CumRap?.ten_cum_rap,
        tenRap: lichChieu.RapPhim.ten_rap,
        diaChi: lichChieu.RapPhim.CumRap?.dia_chi,
        tenPhim: lichChieu.Phim?.ten_phim,
        hinhAnh: lichChieu.Phim?.hinh_anh,
        ngayChieu: dayjs(lichChieu.ngay_gio_chieu).format('DD/MM/YYYY'),
        gioChieu: dayjs(lichChieu.ngay_gio_chieu).format('HH:mm'),
      },
      danhSachGhe: lichChieu.RapPhim.Ghe.map((ghe) => ({
        maGhe: ghe.ma_ghe,
        tenGhe: ghe.ten_ghe,
        maRap: lichChieu.RapPhim?.ma_rap,
        loaiGhe: ghe.loai_ghe,
      })),
    };
  }

  async createShowSchedule(body: ShowScheduleDto, user: NguoiDung) {
    const { ma_phim, ma_rap, gia_ve, ngay_gio_chieu } = body;
    const ngay_gio_chieu_format = moment(
      ngay_gio_chieu,
      'DD-MM-YYYY HH:mm:ss',
    ).toDate();
    const nowDate = new Date();
    const isNowDate = moment(nowDate, 'DD-MM-YYYY HH:mm:ss').toDate();

    console.log({
      ngay_gio_chieu: ngay_gio_chieu,
      ngay_gio_chieu_format: ngay_gio_chieu_format,
      nowDate: isNowDate,
    });

    if (user.loai_nguoi_dung !== 'QuanTri') {
      throw new NotFoundException('Bạn không có quyền tạo lịch chiếu!');
    }

    if (ngay_gio_chieu_format < isNowDate) {
      throw new BadRequestException(
        'Ngày khởi chiếu không được nhỏ hơn ngày hiện tại',
      );
    }

    await this.prisma.lichChieu.create({
      data: {
        ma_phim: Number(ma_phim),
        ma_rap: Number(ma_rap),
        ngay_gio_chieu: ngay_gio_chieu_format,
        gia_ve: Number(gia_ve),
      },
    });
    return 'Tạo lịch chiếu thành công';
  }
}
