import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { RoleEnum } from '../enums/role.enum';
import { User } from '../../users/entities/user.entity';
import { UserRoles } from './user-roles.entity';

@Table({
    tableName: 'roles',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } },
})
export class Role extends Model<Role> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: RoleEnum;

    @BelongsToMany(() => User, () => UserRoles)
    users: User[];

    @HasMany(() => UserRoles)
    userRoles: UserRoles[];

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    deletedAt: Date;
}
