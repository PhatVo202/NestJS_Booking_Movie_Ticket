import { BadRequestException, Injectable } from '@nestjs/common';
import { NguoiDung } from 'generated/prisma';
import { cloudinary } from 'src/common/cloudinary/init.cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import * as fs from 'fs';

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

  async getAllListUser(query: string) {
    console.log({ query: query });
    const dataUser = await this.prisma.nguoiDung.findMany();

    return dataUser;
  }
}
