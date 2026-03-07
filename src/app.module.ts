import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { BlogsModule } from "./blogs/blog.module";
import { KanbanModule } from "./kanban/kanban.module";
import { AiModule } from "./ai/ai.module";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          "MONGODB_URI",
          "mongodb://localhost:27017/blogplatform",
        ),
      }),
    }),
    AuthModule,
    UsersModule,
    BlogsModule,
    KanbanModule,
    AiModule,
    SearchModule,
  ],
})
export class AppModule {}
