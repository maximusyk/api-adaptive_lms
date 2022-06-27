import { forwardRef, Module } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsController } from "./groups.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Group } from "./entities/group.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    SequelizeModule.forFeature([ Group ]),
    forwardRef(() => UsersModule)
  ],
  controllers: [ GroupsController ],
  providers: [ GroupsService ],
  exports: [ GroupsService ]
})
export class GroupsModule {}
