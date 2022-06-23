import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Lecture } from "../../lectures/entities/lecture.entity";
import { Quiz } from "../../quizzes/entities/quiz.entity";
import { Course } from "../../courses/entities/course.entity";

@Table({
  tableName: "chapters",
  paranoid: true
})
export class Chapter extends Model<Chapter> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @HasMany(() => Lecture)
  chapters: Lecture[];

  @HasMany(() => Quiz)
  quizzes: Quiz[];

  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID, allowNull: false })
  courseId: string;

  @BelongsTo(() => Course)
  course: Course;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  deletedAt: Date;
}
