import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { User, UserSchema } from "../users/users.schema";
import { Blog, BlogSchema } from "../blogs/blog.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
