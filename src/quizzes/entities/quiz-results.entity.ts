import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Quiz } from "./quiz.entity";
import { User } from "../../users/entities/user.entity";

@Table({
  tableName: "quiz_results",
  paranoid: true
})
export class QuizResults extends Model<QuizResults> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @Column({ type: DataType.DOUBLE, allowNull: false })
  score: number;

  @ForeignKey(() => Quiz)
  @Column({ type: DataType.UUID, allowNull: false })
  quizId: string;

  @BelongsTo(() => Quiz)
  quiz: Quiz;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  studentId: string;

  @BelongsTo(() => User)
  student: User;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;

  @Column({ type: DataType.DATE })
  deletedAt: Date;
}