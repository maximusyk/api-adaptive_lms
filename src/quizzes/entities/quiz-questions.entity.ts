import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Unit } from "../../units/entities/unit.entity";
import { Quiz } from "./quiz.entity";
import { QuizQuestionType } from "./quiz-question-types.entity";
import { QuizAnswer } from "./quiz-answers.entity";

@Table({
  tableName: "quiz_questions",
  paranoid: true
})
export class QuizQuestion extends Model<QuizQuestion> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ForeignKey(() => QuizQuestionType)
  @Column({ type: DataType.UUID, allowNull: false })
  questionTypeId: string;

  @BelongsTo(() => QuizQuestionType)
  questionType: QuizQuestionType;

  @HasMany(() => QuizAnswer)
  answers: QuizAnswer[];

  @HasMany(() => Unit)
  connectedUnits: Unit[];

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