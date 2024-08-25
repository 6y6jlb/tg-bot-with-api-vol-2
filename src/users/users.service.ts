import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { USER_ID_ENUM } from 'src/common/const';
import { UserError } from 'src/exceptions/User';
import { FindOneUserDto } from './dto/find-one-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(@Body() createUserDto: CreateUserDto) {
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

  findOne(findOneUserDto: FindOneUserDto): Promise<User> {
    const { userId, idType } = this.getIdAndTypeFromData(findOneUserDto);
    return this.userModel.findOne({ [idType]: userId }).exec();
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

    const { userId, idType } = this.getIdAndTypeFromData(updateUserDto);

    return await this.userModel.findOneAndUpdate(
      { [idType]: userId },
      updateUserData,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  getPasswordData(password = 'password') {
    const salt = crypto.randomBytes(16).toString('hex');

    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    return { salt, hash };
  }

  public getIdAndTypeFromData(data: { [key: string]: any }) {
    let userId = null;
    let idType = null;

    if (data.id || data._id) {
      userId = data.id || data._id;
      idType = USER_ID_ENUM.MONGO_ID;
    } else if (data.telegram_id) {
      userId = data.telegram_id;
      idType = USER_ID_ENUM.TELEGRAM_ID;
    } else if (data.email) {
      userId = data.email;
      idType = USER_ID_ENUM.EMAIL;
    }

    if (userId && idType) {
      return { userId, idType };
    }

    throw new UserError('User with this data does not exist!');
  }
}
