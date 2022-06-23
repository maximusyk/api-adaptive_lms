import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Course } from "../../courses/entities/course.entity";
import { Chapter } from "../../chapters/entities/chapter.entity";
import { QuizConfig } from "./quiz-config.entity";
import { QuizResults } from "./quiz-results.entity";
import { QuizQuestion } from "./quiz-questions.entity";

@Table({
  tableName: "quizzes",
  paranoid: true
})
export class Quiz extends Model<Quiz> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ForeignKey(() => QuizConfig)
  @Column({ type: DataType.UUID, allowNull: false })
  quizConfigId: string;

  @BelongsTo(() => QuizConfig)
  quizConfig: QuizConfig;

  @HasMany(() => QuizQuestion)
  quizQuestions: QuizQuestion[];

  @HasMany(() => QuizResults)
  quizResults: QuizResults[];

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, allowNull: false })
  courseId: string;

  @BelongsTo(() => Course)
  course: Course;

  @ForeignKey(() => Chapter)
  @Column({ type: DataType.UUID, allowNull: false })
  chapterId: string;

  @BelongsTo(() => Chapter)
  chapter: Chapter;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  deletedAt: Date;
}
