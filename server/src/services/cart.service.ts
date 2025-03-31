import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { productService } from './product.service';
import { userService } from './user.service';

export type DetailedCart = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
                package: true;
            };
        };
    };
}>;

export type DetailedCartItem = Prisma.CartItemGetPayload<{
    include: {
        product: true;
        package: true;
    };
}>;

const detailedCartQueryArgs = {
    include: {
        items: {
            include: {
                product: true,
                package: true,
            },
        },
    },
};

const detailedCartItemQueryArgs = {
    include: {
        product: true,
        package: true,
    },
};

export const cartService = {
    createCart: async (userId: number): Promise<DetailedCart> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        const existingCart = await cartService.getCartByUserId(userId);
        if (existingCart) {
            throw createError(statusCodes.clientError.CONFLICT, errorMessages.CART_ALREADY_EXISTS);
        }

        return await prismaClient.cart.create({
            data: {
                userId,
            },
            ...detailedCartQueryArgs,
        });
    },

    createCartItem: async (
        userId: number,
        productId: number,
        packageId: number,
        quantity: number = 1,
    ): Promise<DetailedCartItem> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!packageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        if (!quantity) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.QUANTITY_INVALID);
        }

        if (!(await userService.getUserById(userId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        if (!(await productService.getProduct(productId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        const productPackage = await productService.getPackage(packageId);
        if (!productPackage) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        let cart = await cartService.getCartByUserId(userId);
        if (!cart) {
            cart = await cartService.createCart(userId);
        }

        let existingCartItem = await cartService.getCartItemByPackage(cart.id, productId, packageId);
        if (!existingCartItem) {
            const cartItem = await prismaClient.cartItem.create({
                data: {
                    cartId: cart?.id,
                    productId,
                    packageId,
                    quantity,
                    price: productPackage?.price * quantity,
                },
                ...detailedCartItemQueryArgs,
            });

            await cartService.updateCartTotalPrice(cart.id);

            return cartItem;
        } else {
            existingCartItem = await cartService.updateCartItem(
                existingCartItem.id,
                existingCartItem.quantity + quantity,
            );

            return existingCartItem;
        }
    },

    getCartById: async (cartId: number): Promise<DetailedCart | null> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        return await prismaClient.cart.findUnique({
            where: {
                id: cartId,
            },
            ...detailedCartQueryArgs,
        });
    },

    getCartByUserId: async (userId: number): Promise<DetailedCart | null> => {
        if (!userId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.USER_ID_INVALID);
        }

        return await prismaClient.cart.findUnique({
            where: {
                userId,
            },
            ...detailedCartQueryArgs,
        });
    },

    getCartItemById: async (cartItemId: number): Promise<DetailedCartItem | null> => {
        if (!cartItemId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }

        return await prismaClient.cartItem.findUnique({
            where: {
                id: cartItemId,
            },
            ...detailedCartItemQueryArgs,
        });
    },

    getCartItemByPackage: async (
        cartId: number,
        productId: number,
        packageId: number,
    ): Promise<DetailedCartItem | null> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!packageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        return await prismaClient.cartItem.findFirst({
            where: {
                cartId,
                productId,
                packageId,
            },
            ...detailedCartItemQueryArgs,
        });
    },

    getCartItemsByCartId: async (cartId: number): Promise<DetailedCartItem[]> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        return await prismaClient.cartItem.findMany({
            where: { cartId },
            ...detailedCartItemQueryArgs,
        });
    },

    getCarts: async (): Promise<DetailedCart[]> => {
        return await prismaClient.cart.findMany(detailedCartQueryArgs);
    },

    updateCartTotalPrice: async (cartId: number): Promise<DetailedCart> => {
        if (!cartId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        const cart = await cartService.getCartById(cartId);
        if (!cart) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ID_INVALID);
        }

        const cartItems = await cartService.getCartItemsByCartId(cartId);
        const newTotalPrice = cartItems.reduce(
            (accumulator, currentCartItem) => accumulator + currentCartItem.price,
            0,
        );

        return await prismaClient.cart.update({
            where: { id: cartId },
            data: { totalPrice: newTotalPrice },
            ...detailedCartQueryArgs,
        });
    },

    updateCartItem: async (cartItemId: number, quantity: number): Promise<DetailedCartItem> => {
        if (!cartItemId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }

        if (!quantity) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.QUANTITY_INVALID);
        }

        let cartItem = await cartService.getCartItemById(cartItemId);
        if (!cartItem) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }

        cartItem = await prismaClient.cartItem.update({
            where: { id: cartItemId },
            data: {
                quantity,
            },
            ...detailedCartItemQueryArgs,
        });

        await cartService.updateCartTotalPrice(cartItem.cartId);

        return cartItem;
    },

    deleteCartItem: async (cartItemId: number): Promise<DetailedCartItem> => {
        if (!cartItemId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }

        const cartItem = await cartService.getCartItemById(cartItemId);
        if (!cartItem) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.CART_ITEM_ID_INVALID);
        }

        await prismaClient.cartItem.delete({ where: { id: cartItem.id } });
        await cartService.updateCartTotalPrice(cartItem.cartId);

        return cartItem;
    },

    deleteCarts: async (): Promise<DetailedCart[]> => {
        const carts = await cartService.getCarts();
        await prismaClient.cart.deleteMany();

        return carts;
    },
};
