import { type OrderStatus } from '@prisma/client';
import { prismaClient } from '@/database';

export const reportService = {
    getSales: async (
        productId?: number,
        packageId?: number,
        orderStatus?: OrderStatus,
        startDate?: Date,
        endDate?: Date,
    ): Promise<unknown> => {
        return await prismaClient.order.groupBy({
            by: ['productId', 'packageId'],
            where: {
                productId,
                packageId,
                status: {
                    not: 'CANCELLED',
                    equals: orderStatus,
                },
                createdAt: {
                    ...(startDate && { gte: startDate }),
                    ...(endDate && { lte: endDate }),
                },
            },
            _count: {
                id: true,
            },
            _sum: {
                price: true,
            },
        });
    },
};
