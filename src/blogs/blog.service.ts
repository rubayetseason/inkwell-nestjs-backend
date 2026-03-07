import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Blog, BlogDocument } from "./blog.schema";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { User, UserDocument } from "src/users/users.schema";

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(authorId: string, dto: CreateBlogDto): Promise<BlogDocument> {
    const blog = new this.blogModel({
      ...dto,
      author: new Types.ObjectId(authorId),
    });
    const saved = await blog.save();
    return saved.populate("author", "username profilePicture bio");
  }

  async findById(id: string): Promise<BlogDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException("Blog not found");
    const blog = await this.blogModel
      .findById(id)
      .populate("author", "username profilePicture bio followers following");
    if (!blog) throw new NotFoundException("Blog not found");
    return blog;
  }

  async update(
    blogId: string,
    userId: string,
    dto: UpdateBlogDto,
  ): Promise<BlogDocument> {
    if (!Types.ObjectId.isValid(blogId))
      throw new NotFoundException("Blog not found");
    const blog = await this.blogModel.findById(blogId);
    if (!blog) throw new NotFoundException("Blog not found");
    if (blog.author.toString() !== userId)
      throw new ForbiddenException("Not authorized");

    const updated = await this.blogModel
      .findByIdAndUpdate(blogId, { $set: dto }, { new: true })
      .populate("author", "username profilePicture bio");
    return updated;
  }

  async delete(blogId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(blogId))
      throw new NotFoundException("Blog not found");
    const blog = await this.blogModel.findById(blogId);
    if (!blog) throw new NotFoundException("Blog not found");
    if (blog.author.toString() !== userId)
      throw new ForbiddenException("Not authorized");
    await this.blogModel.findByIdAndDelete(blogId);
  }

  async getBlogsByUser(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    blogs: BlogDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (!Types.ObjectId.isValid(userId))
      throw new NotFoundException("User not found");
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      this.blogModel
        .find({ author: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture"),
      this.blogModel.countDocuments({ author: new Types.ObjectId(userId) }),
    ]);
    return { blogs, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getFeed(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    blogs: BlogDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const followingIds = user.following;
    const skip = (page - 1) * limit;

    const filter =
      followingIds.length > 0 ? { author: { $in: followingIds } } : {};

    const [blogs, total] = await Promise.all([
      this.blogModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture bio"),
      this.blogModel.countDocuments(filter),
    ]);

    return { blogs, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getLatestBlogs(
    page = 1,
    limit = 10,
  ): Promise<{
    blogs: BlogDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      this.blogModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture bio"),
      this.blogModel.countDocuments(),
    ]);
    return { blogs, total, page, totalPages: Math.ceil(total / limit) };
  }

  async like(blogId: string, userId: string): Promise<BlogDocument> {
    if (!Types.ObjectId.isValid(blogId))
      throw new NotFoundException("Blog not found");
    const userObjectId = new Types.ObjectId(userId);

    const blog = await this.blogModel
      .findByIdAndUpdate(
        blogId,
        {
          $addToSet: { likes: userObjectId },
          $pull: { dislikes: userObjectId },
        },
        { new: true },
      )
      .populate("author", "username profilePicture");
    if (!blog) throw new NotFoundException("Blog not found");
    return blog;
  }

  async dislike(blogId: string, userId: string): Promise<BlogDocument> {
    if (!Types.ObjectId.isValid(blogId))
      throw new NotFoundException("Blog not found");
    const userObjectId = new Types.ObjectId(userId);

    const blog = await this.blogModel
      .findByIdAndUpdate(
        blogId,
        {
          $addToSet: { dislikes: userObjectId },
          $pull: { likes: userObjectId },
        },
        { new: true },
      )
      .populate("author", "username profilePicture");
    if (!blog) throw new NotFoundException("Blog not found");
    return blog;
  }
}
