import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { QuizConfig } from './quiz-config.entity';
import { QuizResult } from './quiz-results.entity';
import { QuizQuestion } from './quiz-questions.entity';

@Table({
    tableName: 'quizzes',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } }
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
    @Column({ type: DataType.UUID })
    quizConfigId: string;

    @BelongsTo(() => QuizConfig)
    quizConfig: QuizConfig;

    @HasMany(() => QuizQuestion)
    quizQuestions: QuizQuestion[];

    @HasMany(() => QuizResult)
    quizResults: QuizResult[];

    @ForeignKey(() => Chapter)
    @Column({ type: DataType.UUID, allowNull: false })
    chapterId: string;

    @BelongsTo(() => Chapter)
    chapter: Chapter;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}
