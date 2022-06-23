import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Quiz } from "./quiz.entity";
import { QuizQuestion } from "./quiz-questions.entity";

@Table({
  tableName: "quiz_answers",
  paranoid: true
})
export class QuizAnswer extends Model<QuizAnswer> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isCorrect: boolean;

  @ForeignKey(() => QuizQuestion)
  @Column({ type: DataType.UUID, allowNull: false })
  quizQuestionId: string;

  @BelongsTo(() => QuizQuestion)
  quizQuestion: QuizQuestion;

  @ForeignKey(() => Quiz)
  @Column({ type: DataType.UUID, allowNull: false })
  quizId: string;

  @BelongsTo(() => Quiz)
  quiz: Quiz;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  deletedAt: Date;
}