import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Chapter } from '../../chapters/entities/chapter.entity';
import { Unit } from '../../units/entities/unit.entity';

@Table({
    tableName: 'lectures',
    paranoid: true,
    defaultScope: { attributes: { exclude: ['deletedAt'] } },
    scopes: { withDeletedAt: { attributes: { include: ['deletedAt'] } } },
})
export class Lecture extends Model<Lecture> {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, allowNull: false })
    fileId: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isActive: boolean;

    @ForeignKey(() => Chapter)
    @Column({ type: DataType.UUID, allowNull: false })
    chapterId: string;

    @BelongsTo(() => Chapter)
    chapter: Chapter;

    @HasMany(() => Unit)
    units: Unit[];

    @Column({ type: DataType.DATE, allowNull: false })
    createdAt: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    updatedAt: Date;

    @Column({ type: DataType.DATE })
    deletedAt: Date;
}
