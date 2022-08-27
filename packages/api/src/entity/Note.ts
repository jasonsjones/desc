/* eslint-disable @typescript-eslint/no-unused-vars  */
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import User from './User';
import Item from './Item';

@Entity()
export default class Note extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    body: string;

    @ManyToOne(() => User)
    submittedBy: User;

    @ManyToOne(() => Item, { onDelete: 'CASCADE' })
    item: Item | undefined;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toClientJSON(): Note {
        return {
            ...this,
            submittedBy: this.submittedBy.toClientJSON()
        };
    }
}
