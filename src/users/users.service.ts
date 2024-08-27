import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getUserIdTypeById } from './helpers/user-id-type.helper';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { telegram_id: createUserDto.telegram_id },
      ],
    });

    if (existingUser) {
      throw new NotFoundException(
        'User with this email or telegram ID already exists',
      );
    }

    const newUserData = {
      currency: 'USD',
      locale: 'en',
      created_at: new Date(),
      ...createUserDto,
      ...this.getPasswordData(createUserDto.password),
    };

    delete newUserData.password;

    return this.userModel.create(newUserData);
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(userId?: string | number): Promise<User> {
    if (!userId) {
      throw new BadRequestException('Request should contain user id');
    }
    return this.userModel
      .findOne({ [getUserIdTypeById(userId)]: userId })
      .exec();
  }

  async update(id: any, updateUserDto: UpdateUserDto) {
    const updateUserData = { ...updateUserDto };
    if (updateUserDto.password) {
      updateUserData['salt'] = crypto.randomBytes(16).toString('hex');

      updateUserData['hash'] = crypto
        .pbkdf2Sync(
          updateUserDto.password,
          updateUserData['salt'],
          1000,
          64,
          `sha512`,
        )
        .toString(`hex`);

      delete updateUserData.password;
    }

    return await this.userModel.findOneAndUpdate(
      { [getUserIdTypeById(id)]: id },
      updateUserData,
    );
  }

  async resetPassword(userId: any) {
    return await this.findOne(userId);
  }

  // TODO
  remove(userId: any) {
    return `This action removes a #${userId} user`;
  }

  private getPasswordData(password = 'password') {
    const salt = crypto.randomBytes(16).toString('hex');

    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return { salt, hash };
  }
}
