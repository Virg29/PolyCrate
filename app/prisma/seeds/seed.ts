import { PrismaClient, Role, User } from '@prisma/client';
import { Auth as AuthTypes } from '../../src/common/types';

const prisma = new PrismaClient();

async function main() {
	const adminRole = await prisma.role.upsert({
		where: { name: AuthTypes.Enum.UserRole.ADMIN },
		update: {
			name: AuthTypes.Enum.UserRole.ADMIN,
			description: 'Admin',
		},
		create: {
			name: AuthTypes.Enum.UserRole.ADMIN,
			description: 'Admin',
		},
	});

	const makerRole = await prisma.role.upsert({
		where: { name: AuthTypes.Enum.UserRole.MAKER },
		update: {
			name: AuthTypes.Enum.UserRole.MAKER,
			description: 'Maker',
		},
		create: {
			name: AuthTypes.Enum.UserRole.MAKER,
			description: 'Maker',
		},
	});

	const userRole = await prisma.role.upsert({
		where: { name: AuthTypes.Enum.UserRole.USER },
		update: {
			name: AuthTypes.Enum.UserRole.USER,
			description: 'Maker',
		},
		create: {
			name: AuthTypes.Enum.UserRole.USER,
			description: 'Maker',
		},
	});

	for (let i = 0; i < 50; i++) {
		const ownerUser = await prisma.user.upsert({
			where: { email: 'admin@owner.com' },
			update: {
				name: 'App Owner' + i,
				email: `admin${i}@owner.com`,
				password:
					'$2a$10$6YSvK2c/GVVV.5.fbW1J9er7ZoMx1kg.PhIIAYF.NutesEIlRKRwm', // 123qwerty!
				role_id: adminRole.id,
			},
			create: {
				name: 'App Owner' + i,
				email: `admin${i}@owner.com`,
				password:
					'$2a$10$6YSvK2c/GVVV.5.fbW1J9er7ZoMx1kg.PhIIAYF.NutesEIlRKRwm', // 123qwerty!
				role_id: adminRole.id,
			},
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
