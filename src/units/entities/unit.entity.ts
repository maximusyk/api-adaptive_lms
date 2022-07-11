import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { CreateUnitDto } from '../dto/units.dto';
import { CohesionRate } from './cohesion-rate.entity';
import { Lecture } from '../../lectures/entities/lecture.entity';

@Table({
    tableName: 'units',
    paranoid: true,
    defaultScope: { attributes: { exclude: [ 'deletedAt' ] } },
    scopes: { withDeletedAt: { attributes: { include: [ 'deletedAt' ] } } }
})
export class Unit extends Model<Unit, CreateUnitDto> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, allowNull: false })
    content: string;

    @BelongsToMany(() => Unit, { through: () => CohesionRate, as: 'assignedUnitId', foreignKey: 'id' })
    cohesionRates: CohesionRate[];

    @BelongsToMany(() => Unit, { through: () => CohesionRate, as: 'cohesionUnitId', foreignKey: 'id' })
    unitsToCohesion: Unit[];

    @ForeignKey(() => Lecture)
    @Column({ type: DataType.UUID, allowNull: false })
    lectureId: string;

    @BelongsTo(() => Lecture)
    lecture: Lecture;

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}
