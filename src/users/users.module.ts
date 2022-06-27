import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { SequelizeModule } from "@nestjs/sequelize";
import { GroupsModule } from "../groups/groups.module";
import { RolesModule } from "../roles/roles.module";

@Module({
  imports: [
    SequelizeModule.forFeature([ User ]),
    forwardRef(() => GroupsModule),
    RolesModule
  ],
  controllers: [ UsersController ],
  providers: [ UsersService ],
  exports: [ UsersService ]
})
export class UsersModule {}
