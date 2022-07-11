import { forwardRef, Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lecture } from './entities/lecture.entity';
import { AwsService } from '../aws/aws.service';
import { UnitsModule } from '../units/units.module';

@Module({
    imports: [
        SequelizeModule.forFeature([ Lecture ]),
        forwardRef(() => UnitsModule)
    ],
    controllers: [ LecturesController ],
    providers: [ LecturesService, AwsService ],
    exports: [ LecturesService ]
})
export class LecturesModule {}
