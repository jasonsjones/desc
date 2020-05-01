import {
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    Entity,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import bcrypt from 'bcryptjs';

export enum UserRole {
    ADMIN = 'admin',
    APPROVER = 'approver',
    REQUESTOR = 'requestor',
    VOLUNTEER = 'volunteer',
    UNKNOWN = 'unknown'
}

export enum Program {
    HOUSING = 'housing first',
    INTEGRATED = 'integrated services',
    SURVIVAL = 'survival services',
    HEALTH = 'health services',
    EMPLOYMENT = 'employment services',
    RESEARCH_INNOVATION = 'research_innovation',
    UNKNOWN = 'unknown'
}

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
export default class User extends BaseEntity {
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

    @Column({ nullable: true })
    lastLoginAt: Date;

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

    isOwner(otherId: string = ''): boolean {
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
