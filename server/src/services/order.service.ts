import { OrderStatus, Prisma } from '@prisma/client';
import createError from 'http-errors';
import { env } from '@/config';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { generatePayPalAccessToken } from '@/utils';
import { productService } from './product.service';
import { userService } from './user.service';

export type DetailedOrder = Prisma.OrderGetPayload<{
    include: {
        user: true;
        product: true;
        package: true;
    };
}>;

const detailedOrderQueryArgs = {
    include: {
        user: true,
        product: true,
        package: true,
    },
};

export const orderService = {
    createOrder: async (
        userId: number,
        productId: number,
        packageId: number,
        quantity: number,
        price: number,
        creditCard: unknown,
    ): Promise<DetailedOrder> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!user.address) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ADDRESS_INVALID);
        }

        if (!productId || !(await productService.getProduct(productId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!packageId || !(await productService.getPackage(packageId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        if (!quantity) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID);
        }

        if (!price) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRICE_INVALID);
        }

        const order = await prismaClient.order.create({
            data: { userId, productId, packageId, quantity, price },
            ...detailedOrderQueryArgs,
        });
        const response = await fetch(`${env.paypal.SANDBOX_BASE_URL}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'PayPal-Request-Id': order.id.toString(),
                Authorization: `Bearer ${await generatePayPalAccessToken()}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'PHP',
                            value: price.toString(),
                        },
                    },
                ],
                payment_source: {
                    card: creditCard,
                },
            }),
        });
        const data = await response.json();

        if (response.status !== 200 && response.status !== 201) {
            await orderService.deleteOrder(order.id);
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PAYMENT_FAILED);
        }

        await orderService.updateOrderStatus(userId, order.id, 'CONFIRMED', new Date());

        return await orderService.updatePayPalOrderId(order.id, data.id);
    },

    getOrder: async (orderId: number): Promise<DetailedOrder | null> => {
        if (!orderId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID);
        }

        return prismaClient.order.findUnique({ where: { id: orderId }, ...detailedOrderQueryArgs });
    },

    getOrders: async (): Promise<DetailedOrder[]> => {
        return await prismaClient.order.findMany(detailedOrderQueryArgs);
    },

    getOrdersByUserId: async (userId: number): Promise<DetailedOrder[]> => {
        if (!userId || !(await userService.getUserById(userId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        return await prismaClient.order.findMany({ where: { userId }, ...detailedOrderQueryArgs });
    },

    updateOrderStatus: async (
        userId: number,
        orderId: number,
        updatedStatus: OrderStatus,
        updatedDate: Date,
    ): Promise<DetailedOrder> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!orderId || !(await orderService.getOrder(orderId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID);
        }

        if (!updatedStatus || !Object.values(OrderStatus).includes(updatedStatus) || updatedStatus === 'PROCESSING') {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_STATUS_INVALID);
        }

        if (!updatedDate) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.DATE_INVALID);
        }

        /*if (user.role !== 'ADMIN' && updatedStatus !== 'DELIVERED' && updatedStatus !== 'CANCELLED') {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_STATUS_UPDATE_DENIED);
        }*/

        const statusDateFields: Record<string, string> = {
            CONFIRMED: 'confirmedAt',
            PACKED: 'packedAt',
            SHIPPED: 'shippedAt',
            OUT_FOR_DELIVERY: 'outForDeliveryAt',
            DELIVERED: 'deliveredAt',
            CANCELLED: 'cancelledAt',
        };
        const dateField = statusDateFields[updatedStatus];

        return await prismaClient.order.update({
            where: { id: orderId },
            data: { status: updatedStatus, [dateField]: updatedDate },
            ...detailedOrderQueryArgs,
        });
    },

    updatePayPalOrderId: async (orderId: number, payPalOrderId: string): Promise<DetailedOrder> => {
        if (!orderId || !(await orderService.getOrder(orderId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID);
        }

        if (!payPalOrderId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID);
        }

        return await prismaClient.order.update({
            where: { id: orderId },
            data: { payPalOrderId },
            ...detailedOrderQueryArgs,
        });
    },

    deleteOrder: async (orderId: number): Promise<DetailedOrder> => {
        if (!orderId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID);
        }

        const order = await orderService.getOrder(orderId);
        if (!order) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.ORDER_ID_INVALID);
        }

        return await prismaClient.order.delete({ where: { id: orderId }, ...detailedOrderQueryArgs });
    },
};
