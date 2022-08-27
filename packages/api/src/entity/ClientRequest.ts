/* eslint-disable @typescript-eslint/no-unused-vars  */
import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Column
} from 'typeorm';
import User from './User';
import Item from './Item';

@Entity()
export default class ClientRequest extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    clientId: string;

    @ManyToOne(() => User)
    @JoinColumn()
    submittedBy: User;

    @OneToMany(() => Item, (item) => item.clientRequest, { cascade: true })
    @JoinColumn()
    items: Item[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
