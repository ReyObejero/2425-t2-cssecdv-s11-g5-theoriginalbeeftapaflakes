import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import { errorMessages, statusCodes } from '@/constants';
import { prismaClient } from '@/database';
import { reviewService } from './review.service';

export type DetailedProduct = Prisma.ProductGetPayload<{
    include: {
        packages: {
            include: {
                items: {
                    include: {
                        flavor: true;
                        flavorVariant: true;
                    };
                };
            };
        };
    };
}>;

export type DetailedPackage = Prisma.PackageGetPayload<{
    include: {
        items: {
            include: {
                flavor: true;
                flavorVariant: true;
            };
        };
    };
}>;

const detailedProductQueryArgs = {
    include: {
        packages: {
            include: {
                items: {
                    include: {
                        flavor: true,
                        flavorVariant: true,
                    },
                },
            },
        },
    },
};

const detailedPackageQueryArgs = {
    include: {
        items: {
            include: {
                flavor: true,
                flavorVariant: true,
            },
        },
    },
};

export const productService = {
    deletePackage: async (productId: number, packageId: number): Promise<DetailedPackage> => {
        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        if (!packageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        const product = await productService.getProduct(productId);
        if (!product) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        const productPackage = await productService.getPackage(packageId);
        if (!productPackage) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        if (productPackage.productId != product.id) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        await prismaClient.package.delete({ where: { id: packageId } });

        if (product.packages.length - 1 === 0) {
            await productService.deleteProduct(productId);
        }

        return productPackage;
    },

    deletePackages: async (productId: number): Promise<DetailedPackage[]> => {
        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        const productPackages = await productService.getPackages(productId);

        await productService.deletePackages(productId);

        return productPackages;
    },

    deleteProduct: async (productId: number): Promise<DetailedProduct> => {
        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        const product = await productService.getProduct(productId);
        if (!product) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        await prismaClient.product.delete({ where: { id: productId } });

        return product;
    },

    getPackage: async (packageId: number): Promise<DetailedPackage | null> => {
        if (!packageId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PACKAGE_ID_INVALID);
        }

        return await prismaClient.package.findUnique({
            where: { id: packageId },
            ...detailedPackageQueryArgs,
        });
    },

    getPackages: async (productId: number): Promise<DetailedPackage[]> => {
        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        return await prismaClient.package.findMany({
            where: { productId },
            ...detailedPackageQueryArgs,
        });
    },

    getProduct: async (productId: number): Promise<DetailedProduct | null> => {
        if (!productId) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        return await prismaClient.product.findUnique({
            where: { id: productId },
            ...detailedProductQueryArgs,
        });
    },

    getProducts: async (): Promise<DetailedProduct[]> => {
        return await prismaClient.product.findMany({
            ...detailedProductQueryArgs,
        });
    },

    updateProductAverageRating: async (productId: number): Promise<DetailedProduct> => {
        if (!productId || !(await productService.getProduct(productId))) {
            throw createError(statusCodes.clientError.BAD_REQUEST, errorMessages.PRODUCT_ID_INVALID);
        }

        const reviews = await reviewService.getReviews();
        const sumRatings = reviews.reduce((accumulator, currentReview) => {
            return (accumulator += currentReview.rating);
        }, 0);

        return await prismaClient.product.update({
            where: { id: productId },
            data: { averageRating: sumRatings / reviews.length },
            ...detailedProductQueryArgs,
        });
    },
};
