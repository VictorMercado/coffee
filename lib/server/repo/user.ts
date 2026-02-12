import { prisma } from "@/lib/prisma";

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
  username: string;
  password: string;
  role?: string;
}) {
  return prisma.user.create({
    data: {
      username: data.username,
      password: data.password,
      role: data.role ?? "USER",
    },
  });
}
