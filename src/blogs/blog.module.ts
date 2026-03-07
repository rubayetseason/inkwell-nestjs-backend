import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsController } from "./blog.controller";
import { BlogsService } from "./blog.service";
import { Blog, BlogSchema } from "./blog.schema";
import { User, UserSchema } from "src/users/users.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
