import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Program, UserRole } from '../common/types/enums';

interface UserDataForClient {
    id: string;
    name: {
        first: string;
        last: string;
    };
    email: string;
    program: Program;
    roles: UserRole[];
}

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column('varchar', { unique: true, length: 255 })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Program, default: Program.UNKNOWN })
    program: Program;

    @Column({ type: 'enum', enum: UserRole, array: true, default: [UserRole.REQUESTOR] })
    roles: UserRole[];

    @Column()
    emailVerificationToken: string;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ default: 0 })
    refreshTokenVersion: number;

    @Column({ default: '' })
    passwordResetToken: string;

    @Column({ default: new Date() })
    passwordResetTokenExpiresAt: Date;

    @Column({ default: new Date() })
    passwordLastChangedAt: Date;

    @Column({ nullable: true })
    lastLoginAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    verifyPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

    isAdmin(): boolean {
        return this.roles.includes(UserRole.ADMIN);
    }

    isOwner(otherId = ''): boolean {
        return this.id === otherId;
    }

    toClientJSON(): UserDataForClient {
        return {
            id: this.id,
            name: {
                first: this.firstName,
                last: this.lastName
            },
            email: this.email,
            program: this.program,
            roles: this.roles
        };
    }
}
