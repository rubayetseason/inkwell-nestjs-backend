import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  async getUser(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Patch("profile")
  async updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Get(":id/followers")
  async getFollowers(@Param("id") id: string) {
    return this.usersService.getFollowers(id);
  }

  @Get(":id/following")
  async getFollowing(@Param("id") id: string) {
    return this.usersService.getFollowing(id);
  }

  @Post(":id/follow")
  async follow(@Request() req, @Param("id") targetId: string) {
    await this.usersService.follow(req.user.userId, targetId);
    return { message: "Followed successfully" };
  }

  @Post(":id/unfollow")
  async unfollow(@Request() req, @Param("id") targetId: string) {
    await this.usersService.unfollow(req.user.userId, targetId);
    return { message: "Unfollowed successfully" };
  }
}
