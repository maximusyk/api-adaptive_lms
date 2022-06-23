import { Module } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsController } from "./groups.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Group } from "./entities/group.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([ Group ])
  ],
  controllers: [ GroupsController ],
  providers: [ GroupsService ]
})
export class GroupsModule {}
