import { prisma } from "@/lib/prisma";

const getUserById = async (id: string) => {
	let user = await prisma.users.findUniqueOrThrow({
		where: {
			id: id,
		},
	});

	return user;
};

export default getUserById;
