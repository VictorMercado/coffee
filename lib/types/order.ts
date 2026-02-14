import type { Order as PrismaOrder } from "@prisma/client";
import type { OrderItem as PrismaOrderItem } from "@prisma/client";

export type Order = PrismaOrder;
export type OrderItem = PrismaOrderItem;
