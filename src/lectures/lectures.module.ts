import { Module } from "@nestjs/common";
import { LecturesService } from "./lectures.service";
import { LecturesController } from "./lectures.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Lecture } from "./entities/lecture.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([ Lecture ])
  ],
  controllers: [ LecturesController ],
  providers: [ LecturesService ],
  exports: [ LecturesService ]
})
export class LecturesModule {}
