import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import ClientRequest from './ClientRequest';
import Note from './Note';
import User from './User';
import { ItemCategory, ItemPriority, ItemStatus, HouseLocation } from '../common/types';

@Entity()
export default class Item extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    clientId: string;

    @ManyToOne(() => ClientRequest)
    clientRequest: ClientRequest;

    @Column({ type: 'enum', enum: ItemCategory })
    category: ItemCategory;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: ItemPriority, default: ItemPriority.STANDARD })
    priority: ItemPriority;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @ManyToOne(() => User)
    @JoinColumn()
    submittedBy: User;

    @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.ACTIVE })
    status: ItemStatus;

    @Column({ type: 'enum', enum: HouseLocation })
    location: HouseLocation;

    @OneToMany(
        () => Note,
        note => note.item,
        { cascade: true }
    )
    @JoinColumn()
    notes: Note[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toClientJSON(): Item {
        const hasNotes = this.notes && this.notes.length > 0;
        const sanitizedNotes = hasNotes && this.notes.map(note => note.toClientJSON());

        if (hasNotes) {
            return {
                ...this,
                submittedBy: this.submittedBy.toClientJSON(),
                notes: sanitizedNotes
            };
        } else {
            return {
                ...this,
                submittedBy: this.submittedBy.toClientJSON()
            };
        }
    }
}
