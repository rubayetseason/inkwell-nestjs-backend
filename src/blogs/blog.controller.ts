import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { BlogsService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";

@Controller("blogs")
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() dto: CreateBlogDto) {
    return this.blogsService.create(req.user.userId, dto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get("feed")
  async getFeed(
    @Request() req,
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    if (req.user) {
      return this.blogsService.getFeed(req.user.userId, +page, +limit);
    }
    return this.blogsService.getLatestBlogs(+page, +limit);
  }

  @Get("user/:userId")
  async getBlogsByUser(
    @Param("userId") userId: string,
    @Query("page") page = "1",
    @Query("limit") limit = "10",
  ) {
    return this.blogsService.getBlogsByUser(userId, +page, +limit);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.blogsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Request() req,
    @Param("id") id: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Request() req, @Param("id") id: string) {
    await this.blogsService.delete(id, req.user.userId);
    return { message: "Blog deleted successfully" };
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/like")
  async like(@Request() req, @Param("id") id: string) {
    return this.blogsService.like(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/dislike")
  async dislike(@Request() req, @Param("id") id: string) {
    return this.blogsService.dislike(id, req.user.userId);
  }
}
