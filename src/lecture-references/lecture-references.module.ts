import { Module } from '@nestjs/common';
import { LectureReferencesService } from './lecture-references.service';
import { LectureReferencesController } from './lecture-references.controller';

@Module({
  controllers: [LectureReferencesController],
  providers: [LectureReferencesService]
})
export class LectureReferencesModule {}
