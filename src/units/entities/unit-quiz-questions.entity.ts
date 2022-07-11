import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Unit } from './unit.entity';
import { QuizQuestion } from '../../quizzes/entities/quiz-questions.entity';

@Table({
    tableName: 'unit_quiz_questions',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } }
})
export class UnitQuizQuestions extends Model<UnitQuizQuestions> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @ForeignKey(() => Unit)
    @Column({ type: DataType.UUID, allowNull: false })
    unitId: string;

    @BelongsTo(() => Unit)
    unit: Unit;

    @ForeignKey(() => QuizQuestion)
    @Column({ type: DataType.UUID, allowNull: false })
    quizQuestionId: string;

    @BelongsTo(() => QuizQuestion)
    quizQuestion: QuizQuestion;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}