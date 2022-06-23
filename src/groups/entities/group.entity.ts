import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../../users/entities/user.entity";
import { Course } from "../../courses/entities/course.entity";
import { GroupCourse } from "./group-courses.entity";

@Table({
  tableName: "groups",
  paranoid: true
})
export class Group extends Model<Group> {
  @Column({
    type: DataType.UUID,
    unique: true,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  curatorId: string;

  @BelongsTo(() => User)
  curator: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  leaderId: string;

  @BelongsTo(() => User)
  leader: User;

  @HasMany(() => User)
  users: User[];

  @BelongsToMany(() => Course, () => GroupCourse)
  assignedCourses: Course[];

  @HasMany(() => GroupCourse)
  groupCourses: GroupCourse[];

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  deletedAt: Date;
}