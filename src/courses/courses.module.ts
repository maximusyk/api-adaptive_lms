import { forwardRef, Module } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { Course } from "./entities/course.entity";
import { SequelizeModule } from "@nestjs/sequelize";
import { ChaptersModule } from "../chapters/chapters.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    SequelizeModule.forFeature([ Course ]),
    forwardRef(() => ChaptersModule),
    UsersModule
  ],
  controllers: [ CoursesController ],
  providers: [ CoursesService ],
  exports: [ CoursesService ]
})
export class CoursesModule {}
