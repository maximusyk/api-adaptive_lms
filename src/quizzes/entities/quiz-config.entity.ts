import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'quiz_configs',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } },
})
export class QuizConfig extends Model<QuizConfig> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    attempts: number;

    @Column({ type: DataType.DATE, allowNull: false })
    duration: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    startDate: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    endDate: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}