import bcrypt from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = '123456';

const users: Prisma.UserCreateInput[] = [
    {
        firstName: 'Oliver',
        lastName: 'Queen',
        email: 'oliver@desc.org',
        program: 'RESEARCH_INNOVATION',
        roles: ['ADMIN', 'APPROVER']
    },
    {
        firstName: 'Barry',
        lastName: 'Allen',
        email: 'barry@desc.org',
        program: 'SURVIVAL_SERVICES'
    }
];

async function seed(): Promise<void> {
    await prisma.user.deleteMany({});

    const hash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    const ollie = await prisma.user.create({
        data: {
            ...users[0],
            hashedPassword: {
                create: {
                    hash
                }
            }
        }
    });

    const barry = await prisma.user.create({
        data: {
            ...users[1],
            hashedPassword: {
                create: {
                    hash
                }
            }
        }
    });

    console.log({ ollie, barry });
}

seed()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
