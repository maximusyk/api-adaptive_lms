import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Lecture } from '../../lectures/entities/lecture.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';
import { Course } from '../../courses/entities/course.entity';

@Table({
    tableName: 'chapters',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } },
})
export class Chapter extends Model<Chapter> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @ForeignKey(() => Course)
    @Column({ type: DataType.UUID, allowNull: false })
    courseId: string;

    @HasMany(() => Lecture)
    lectures: Lecture[];

    @HasMany(() => Quiz)
    quizzes: Quiz[];

    @BelongsTo(() => Course)
    course: Course;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}
