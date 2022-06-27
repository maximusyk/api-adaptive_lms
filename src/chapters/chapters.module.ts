import { forwardRef, Module } from "@nestjs/common";
import { ChaptersService } from "./chapters.service";
import { ChaptersController } from "./chapters.controller";
import { Chapter } from "./entities/chapter.entity";
import { SequelizeModule } from "@nestjs/sequelize";
import { CoursesModule } from "../courses/courses.module";

@Module({
  imports: [
    SequelizeModule.forFeature([
      Chapter
    ]),
    forwardRef(() => CoursesModule)
  ],
  controllers: [ ChaptersController ],
  providers: [ ChaptersService ],
  exports: [ ChaptersService ]
})
export class ChaptersModule {}
