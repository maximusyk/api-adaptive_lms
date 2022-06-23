import { Module } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { CoursesController } from "./courses.controller";
import { Course } from "./entities/course.entity";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    SequelizeModule.forFeature([ Course ])
  ],
  controllers: [ CoursesController ],
  providers: [ CoursesService ]
})
export class CoursesModule {}
