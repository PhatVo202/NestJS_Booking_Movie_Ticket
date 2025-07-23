import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { NguoiDung } from 'generated/prisma';
import { cloudinary } from 'src/common/cloudinary/init.cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserDto,
  GetInfoUserDto,
  UpdateUserDto,
  UserQueryDto,
  UserQueryPhanTrangDto,
} from './dto/user.dto';
import { paginate } from 'src/common/helpers/paginate.helper';
import * as bcrypt from 'bcrypt';

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
      throw new BadRequestException('Chưa tìm thấy file');
    }

    if (!user) {
      throw new BadRequestException('Chưa tìm thấy user');
    }

    try {
      await this.prisma.nguoiDung.update({
        where: {
          id: Number(user.id),
        },
        data: {
          avatar: uploadResult.secure_url,
        },
      });

      // if (user.avatar) {
      //   const oldFilePath = path.join('images', user.avatar);
      //   if (fs.existsSync(oldFilePath)) {
      //     fs.unlinkSync(oldFilePath);
      //   }
      // }

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

  async findAll(query: UserQueryDto) {
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

  async findAllPaginate(query: UserQueryPhanTrangDto) {
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

    const { mat_khau } = body;

    const hashPassword = bcrypt.hashSync(mat_khau, 10);

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
        mat_khau: hashPassword,
      },
    });

    const { mat_khau: _, ...safeData } = data;

    return safeData;
  }

  async updateUser(body: UpdateUserDto) {
    const { tai_khoan, mat_khau, so_dt, email, ho_ten } = body;
    const hashPassword = bcrypt.hashSync(mat_khau, 10);
    const isTaiKhoan = await this.prisma.nguoiDung.findUnique({
      where: {
        tai_khoan: tai_khoan,
      },
    });

    const data = {
      tai_khoan: tai_khoan,
      mat_khau: hashPassword,
      so_dt: so_dt,
      email: email,
      ho_ten: ho_ten,
      loai_nguoi_dung: isTaiKhoan?.loai_nguoi_dung,
    };

    if (tai_khoan !== isTaiKhoan?.tai_khoan) {
      throw new BadRequestException('Bạn không có quyền thay đổi tài khoản');
    }

    const result = await this.prisma.nguoiDung.update({
      where: {
        tai_khoan: tai_khoan,
      },
      data: {
        ...data,
      },
    });

    const { mat_khau: _, loai_nguoi_dung, ...safeData } = result;

    return safeData;
  }

  async updateUserForAdmin(body: CreateUserDto, user: NguoiDung) {
    const { tai_khoan, mat_khau, ho_ten, email, so_dt, loai_nguoi_dung } = body;
    const hashPassword = bcrypt.hashSync(mat_khau, 10);

    const isTaiKhoan = await this.prisma.nguoiDung.findUnique({
      where: {
        tai_khoan: tai_khoan,
      },
    });

    const data = {
      tai_khoan,
      mat_khau: hashPassword,
      so_dt,
      email,
      ho_ten,
      loai_nguoi_dung,
    };

    if (user.loai_nguoi_dung !== 'QuanTri') {
      throw new ForbiddenException('Vui lòng đăng nhập bằng Admin');
    }

    if (tai_khoan !== isTaiKhoan?.tai_khoan) {
      throw new BadRequestException('không thể thay đổi tài khoản');
    }

    return await this.prisma.nguoiDung.update({
      where: {
        tai_khoan: tai_khoan,
      },
      data: {
        ...data,
      },
    });
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

  async getInfoUser(query: GetInfoUserDto, user: NguoiDung) {
    const { tai_khoan } = query;
    if (user.loai_nguoi_dung !== 'QuanTri') {
      throw new ForbiddenException('Bạn không có quyền!');
    }

    if (!tai_khoan && tai_khoan === '') {
      throw new BadRequestException('Vui lớn nhập tài khoản');
    }
    const data = await this.prisma.nguoiDung.findMany({
      where: {
        tai_khoan: {
          contains: tai_khoan.trim(),
        },
      },
    });

    return data;
  }
}
