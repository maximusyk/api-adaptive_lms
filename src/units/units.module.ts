import { Module } from "@nestjs/common";
import { UnitsService } from "./units.service";
import { UnitsController } from "./units.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Unit } from "./entities/unit.entity";

@Module({
  imports: [
    SequelizeModule.forFeature([ Unit ])
  ],
  controllers: [ UnitsController ],
  providers: [ UnitsService ]
})
export class UnitsModule {}
