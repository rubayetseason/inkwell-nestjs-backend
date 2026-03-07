import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.usersService.findByEmail(dto.email);
    if (existingEmail) throw new ConflictException("Email already in use");

    const existingUsername = await this.usersService.findByUsername(
      dto.username,
    );
    if (existingUsername) throw new ConflictException("Username already taken");

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    return {
      access_token: token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");

    const token = this.generateToken(user);
    return {
      access_token: token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        followers: user.followers,
        following: user.following,
      },
    };
  }

  async getMe(userId: string) {
    return this.usersService.findById(userId);
  }

  private generateToken(user: any) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }
}
