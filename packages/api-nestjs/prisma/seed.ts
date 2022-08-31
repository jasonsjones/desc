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

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    const ollie = await prisma.user.upsert({
        where: { email: users[0].email },
        update: {},
        create: {
            ...users[0],
            password: {
                create: {
                    hash: hashedPassword
                }
            }
        }
    });

    const barry = await prisma.user.upsert({
        where: { email: users[1].email },
        update: {},
        create: {
            ...users[1],
            password: {
                create: {
                    hash: hashedPassword
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
