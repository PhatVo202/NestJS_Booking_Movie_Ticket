import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { NguoiDung } from 'generated/prisma';
import { cloudinary } from 'src/common/cloudinary/init.cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import {
  CreateUserDto,
  UserQueryDto,
  UserQueryPhanTrangDto,
} from './dto/user.dto';
import { paginate } from 'src/common/helpers/paginate.helper';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async updateAvatarCloud(file: Express.Multer.File, user: NguoiDung) {
    if (!file) {
      throw new BadRequestException('Chưa tìm thấy file');
    }
    const uploadResult = await new Promise<UploadApiResponse | undefined>(
      (resolve) => {
        cloudinary.uploader
          .upload_stream({ folder: 'images' }, (error, uploadResult) => {
            return resolve(uploadResult);
          })
          .end(file.buffer);
      },
    );

    if (uploadResult === undefined) {
      throw new BadRequestException('Chua tim thay file');
    }

    if (!user) {
      throw new BadRequestException('Chua tim thay user');
    }

    try {
      await this.prisma.nguoiDung.update({
        where: {
          id: Number(user.id),
        },
        data: {
          avatar: uploadResult.public_id,
        },
      });

      if (user.avatar) {
        const oldFilePath = path.join('images', user.avatar);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      if (user?.avatar) {
        cloudinary.uploader.destroy(user.avatar);
      }

      // cloudinary.uploader.destroy(user.avatar);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    console.log(uploadResult);
    return {
      folder: uploadResult.asset_folder,
      filename: file.originalname,
      imgUrl: uploadResult.secure_url,
    };
  }

  async getListUserType() {
    const typeUser = this.prisma.nguoiDung.findMany({
      distinct: ['loai_nguoi_dung'],
      select: {
        loai_nguoi_dung: true,
      },
    });

    const result = (await typeUser).map((item) => {
      return {
        maLoaiNguoiDung: item.loai_nguoi_dung,
        tenLoai:
          item.loai_nguoi_dung === 'KhachHang' ? 'Khách hàng' : 'Quản trị',
      };
    });

    return result;
  }

  async getAllListUser(query: UserQueryDto) {
    const { tuKhoa } = query;

    if (tuKhoa && tuKhoa !== '') {
      const dataUser = await this.prisma.nguoiDung.findMany({
        where: {
          ho_ten: {
            contains: tuKhoa.trim(),
          },
        },
      });
      return dataUser;
    } else {
      const dataUser = await this.prisma.nguoiDung.findMany();
      return dataUser;
    }
  }

  async getAllListUserPhanTrang(query: UserQueryPhanTrangDto) {
    const { tuKhoa, page = '1', limit = '10' } = query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const whereCondition = tuKhoa?.trim()
      ? {
          ho_ten: {
            contains: tuKhoa.trim(),
          },
        }
      : {};

    const data = await paginate(this.prisma.nguoiDung, {
      where: whereCondition,
      page: pageNumber,
      limit: limitNumber,
    });

    return data;
  }

  async getInfo(user: NguoiDung) {
    return user;
  }

  async addUser(body: CreateUserDto, user: NguoiDung) {
    if (user.loai_nguoi_dung !== 'QuanTri') {
      throw new ForbiddenException('Bạn không có quyền!');
    }

    const userExits = await this.prisma.nguoiDung.findUnique({
      where: {
        tai_khoan: body.tai_khoan,
      },
    });

    if (userExits) {
      throw new BadRequestException('Tài khoản đã tồn tại!');
    }

    const data = await this.prisma.nguoiDung.create({
      data: {
        ...body,
      },
    });

    return data;
  }

  async updateUser() {
    return 'update success';
  }

  async removeUser(id, user: NguoiDung) {
    if (user.loai_nguoi_dung !== 'QuanTri') {
      throw new ForbiddenException('Bạn không có quyền!');
    }

    const userExits = await this.prisma.nguoiDung.findUnique({
      where: {
        id: +id,
      },
    });

    if (!userExits) {
      throw new BadRequestException('User không tồn tại!');
    }

    await this.prisma.nguoiDung.delete({
      where: {
        id: +id,
      },
    });

    return 'Xoá thành công';
  }
}
