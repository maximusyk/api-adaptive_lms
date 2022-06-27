import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Group } from './group.entity';
import { Course } from '../../courses/entities/course.entity';

@Table({
    tableName: 'group_courses',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } },
})
export class GroupCourse extends Model<GroupCourse> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @ForeignKey(() => Group)
    @Column({ type: DataType.UUID, allowNull: false })
    groupId: string;

    @BelongsTo(() => Group)
    group: Group;

    @ForeignKey(() => Course)
    @Column({ type: DataType.UUID, allowNull: false })
    assignedCourseId: string;

    @BelongsTo(() => Course)
    assignedCourse: Course;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}