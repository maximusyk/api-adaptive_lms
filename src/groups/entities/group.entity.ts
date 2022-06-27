import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
import { GroupCourse } from './group-courses.entity';

@Table({
    tableName: 'groups',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } },
})
export class Group extends Model<Group> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @HasMany(() => User)
    students: User[];

    @BelongsToMany(() => Course, () => GroupCourse)
    assignedCourses: Course[];

    @HasMany(() => GroupCourse)
    groupCourses: GroupCourse[];

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}
