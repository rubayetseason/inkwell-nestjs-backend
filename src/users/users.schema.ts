import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: "" })
  profilePicture: string;

  @Prop({ default: "" })
  coverPhoto: string;

  @Prop({ default: "" })
  bio: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }], default: [] })
  followers: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: "User" }], default: [] })
  following: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
