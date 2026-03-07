import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Blog, BlogDocument } from "../blogs/blog.schema";
import { User, UserDocument } from "src/users/users.schema";

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  async search(query: string, type: "all" | "users" | "blogs" = "all") {
    if (!query || query.trim().length < 1) return { users: [], blogs: [] };

    const q = query.trim();
    const regex = new RegExp(q, "i");

    const results: { users: any[]; blogs: any[] } = { users: [], blogs: [] };

    if (type === "all" || type === "users") {
      results.users = await this.userModel
        .find({
          $or: [{ username: regex }, { bio: regex }],
        })
        .select("username profilePicture bio followers following")
        .limit(10);
    }

    if (type === "all" || type === "blogs") {
      results.blogs = await this.blogModel
        .find({
          $or: [{ title: regex }, { shortDescription: regex }],
        })
        .populate("author", "username profilePicture")
        .select(
          "title shortDescription thumbnail author createdAt likes dislikes",
        )
        .sort({ createdAt: -1 })
        .limit(10);
    }

    return results;
  }
}
