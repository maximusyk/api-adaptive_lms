import { forwardRef, Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Unit } from './entities/unit.entity';
import { LecturesModule } from '../lectures/lectures.module';
import { QuizzesModule } from '../quizzes/quizzes.module';

@Module({
    imports: [
        SequelizeModule.forFeature([ Unit ]),
        forwardRef(() => LecturesModule),
        QuizzesModule
    ],
    controllers: [ UnitsController ],
    providers: [ UnitsService ],
    exports: [ UnitsService ]
})
export class UnitsModule {}
