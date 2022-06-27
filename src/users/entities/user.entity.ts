import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { CreateUserDto } from '../dto/users.dto';
import { Role } from '../../roles/entities/role.entity';
import { Group } from '../../groups/entities/group.entity';

@Table({
    tableName: 'users',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } },
})
export class User extends Model<User, CreateUserDto> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    firstName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    lastName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    username: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @Column({ type: DataType.STRING, allowNull: false })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    phone: string;

    @ForeignKey(() => Role)
    @Column({ type: DataType.UUID, allowNull: false })
    roleId: string;

    @BelongsTo(() => Role)
    role: Role;

    @ForeignKey(() => Group)
    @Column({ type: DataType.UUID, allowNull: false })
    groupId: string;

    @BelongsTo(() => Group)
    group: Group;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}
