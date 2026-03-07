import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./users.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException("User not found");
    const user = await this.userModel
      .findById(id)
      .select("-password")
      .populate("followers", "username profilePicture")
      .populate("following", "username profilePicture");
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).select("-password");
  }

  async create(data: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save();
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserDocument> {
    if (dto.username) {
      const existing = await this.userModel.findOne({
        username: dto.username,
        _id: { $ne: userId },
      });
      if (existing) throw new ConflictException("Username already taken");
    }

    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: dto }, { new: true })
      .select("-password");
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async follow(currentUserId: string, targetUserId: string): Promise<void> {
    if (currentUserId === targetUserId)
      throw new BadRequestException("Cannot follow yourself");
    if (!Types.ObjectId.isValid(targetUserId))
      throw new NotFoundException("User not found");

    const target = await this.userModel.findById(targetUserId);
    if (!target) throw new NotFoundException("User not found");

    const currentObjectId = new Types.ObjectId(currentUserId);
    const targetObjectId = new Types.ObjectId(targetUserId);

    await this.userModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetObjectId },
    });
    await this.userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentObjectId },
    });
  }

  async unfollow(currentUserId: string, targetUserId: string): Promise<void> {
    if (!Types.ObjectId.isValid(targetUserId))
      throw new NotFoundException("User not found");

    const currentObjectId = new Types.ObjectId(currentUserId);
    const targetObjectId = new Types.ObjectId(targetUserId);

    await this.userModel.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetObjectId },
    });
    await this.userModel.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentObjectId },
    });
  }

  async getFollowers(userId: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new NotFoundException("User not found");
    const user = await this.userModel
      .findById(userId)
      .populate("followers", "username profilePicture bio");
    if (!user) throw new NotFoundException("User not found");
    return user.followers;
  }

  async getFollowing(userId: string) {
    if (!Types.ObjectId.isValid(userId))
      throw new NotFoundException("User not found");
    const user = await this.userModel
      .findById(userId)
      .populate("following", "username profilePicture bio");
    if (!user) throw new NotFoundException("User not found");
    return user.following;
  }
}
