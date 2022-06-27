import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Unit } from './unit.entity';

@Table({
    tableName: 'cohesion_rates',

    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } },
})
export class CohesionRate extends Model<CohesionRate> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @ForeignKey(() => Unit)
    @Column({ type: DataType.UUID, allowNull: false })
    assignedUnitId: string;

    @BelongsTo(() => Unit)
    assignedUnit: Unit;

    @ForeignKey(() => Unit)
    @Column({ type: DataType.UUID, allowNull: false })
    cohesionUnitId: string;

    @BelongsTo(() => Unit)
    cohesionUnit: Unit;

    @Column({ type: DataType.INTEGER, allowNull: false })
    cohesionRate: number;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}