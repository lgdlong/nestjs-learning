import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Create new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  // Get one user by _id
  async findOne(_id: string): Promise<User> {
    const user = await this.userModel
      .findOne({ _id })
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with _id ${_id} not found`);
    }
    return user;
  }

  // Update user by _id
  async update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findById(_id);
    Object.assign(updatedUser, updateUserDto);
    await updatedUser.save(); // ✅ sẽ tự tăng __v

    if (!updatedUser) {
      throw new NotFoundException(`User with _id ${_id} not found`);
    }

    return updatedUser;
  }

  // Delete user by _id
  async remove(_id: string): Promise<User> {
    const deletedUser = await this.userModel.findOneAndDelete({ _id }).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with _id ${_id} not found`);
    }

    return deletedUser;
  }
}
