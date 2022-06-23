import { Module } from "@nestjs/common";
import { ChaptersService } from "./chapters.service";
import { ChaptersController } from "./chapters.controller";
import { Chapter } from "./entities/chapter.entity";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Chapter
    ])
  ],
  controllers: [ ChaptersController ],
  providers: [ ChaptersService ]
})
export class ChaptersModule {}
