import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { Group } from '../../groups/entities/group.entity';
import { GroupCourse } from '../../groups/entities/group-courses.entity';

@Table({
    tableName: 'courses',
    paranoid: true,
    defaultScope: { attributes: { exclude: ['deletedAt'] } },
    scopes: { withDeletedAt: { attributes: { include: ['deletedAt'] } } },
})
export class Course extends Model<Course> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING })
    description: string;

    // TODO: Implement Category Entity
    // @Column({ type: DataType.STRING, allowNull: false })
    // category: string;
    //
    // TODO: Implement Course Image
    // @Column({ type: DataType.STRING, allowNull: false })
    // image: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    professorId: string;

    @BelongsTo(() => User)
    professor: User;

    @HasMany(() => Chapter)
    chapters: Chapter[];

    @BelongsToMany(() => Group, () => GroupCourse)
    assignedGroups: Group[];

    @HasMany(() => GroupCourse)
    groupCourses: GroupCourse[];

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}
